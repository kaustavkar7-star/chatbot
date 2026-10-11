import { ChatCitation } from '../types';

export const DEFAULT_N8N_URL =
  import.meta.env.VITE_N8N_CHAT_URL ||
  'https://kaustavkar7.app.n8n.cloud/webhook/72241871-55fd-4c9d-b85d-df8c595b2ec5/chat';

const STORAGE_KEY_URL = 'campusconnect_n8n_chat_url';
const STORAGE_KEY_SESSION = 'campusconnect_session_id';

export function getConfiguredN8nUrl(): string {
  const custom = localStorage.getItem(STORAGE_KEY_URL);
  if (custom && custom.trim().length > 0) {
    return custom.trim();
  }
  return DEFAULT_N8N_URL;
}

export function setConfiguredN8nUrl(url: string): void {
  if (!url || url.trim() === DEFAULT_N8N_URL) {
    localStorage.removeItem(STORAGE_KEY_URL);
  } else {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
  }
}

export function resetN8nUrlToDefault(): void {
  localStorage.removeItem(STORAGE_KEY_URL);
}

export function getOrCreateSessionId(forceNew = false): string {
  if (forceNew) {
    const newId = `campus-std-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEY_SESSION, newId);
    return newId;
  }
  let current = sessionStorage.getItem(STORAGE_KEY_SESSION);
  if (!current) {
    current = `campus-std-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEY_SESSION, current);
  }
  return current;
}

export interface N8nParsedResponse {
  text: string;
  citations: ChatCitation[];
  ticketId?: string;
  raw?: any;
}

/**
 * Extracts citations and ticket IDs from text or JSON payload
 */
export function extractMetadataFromText(content: string): {
  cleanText: string;
  citations: ChatCitation[];
  ticketId?: string;
} {
  const citations: ChatCitation[] = [];
  let ticketId: string | undefined = undefined;

  // Search for Ticket ID formats like TKT-1234, TICKET#456, TICKET: 8901, TKT-2025-XXXX
  const ticketRegex = /(?:Ticket\s*(?:ID|Number|#)?[:\s-]*|#)(TKT-[A-Z0-9-]+|[0-9]{5,8})/i;
  const ticketMatch = content.match(ticketRegex);
  if (ticketMatch && ticketMatch[1]) {
    ticketId = ticketMatch[1].toUpperCase();
    if (!ticketId.startsWith('TKT-') && !ticketId.startsWith('#')) {
      ticketId = `TKT-${ticketId}`;
    }
  }

  // Look for citation formats like [Campus Handbook §3.2], [Academic Regulations p.14], Source: [XYZ]
  const bracketCitationRegex = /\[(?:Source|Citation|Doc|Policy)?\s*:?\s*([^\]]+)\]/gi;
  let match;
  while ((match = bracketCitationRegex.exec(content)) !== null) {
    const citeText = match[1].trim();
    if (
      citeText.length > 3 &&
      !citeText.toLowerCase().includes('http') &&
      !citations.some((c) => c.documentTitle === citeText)
    ) {
      // Split section if present
      const parts = citeText.split(/(?:§|Sec\.|Section|Rule|Art\.)/i);
      citations.push({
        documentTitle: parts[0].trim(),
        section: parts[1] ? parts[1].trim() : undefined,
      });
    }
  }

  // Search for "Sources:" or "References:" list at the bottom of the message
  const sourceLineRegex = /(?:Sources?|References?|Citations?|Document Reference):\s*([^\n\r]+)/gi;
  let sourceMatch;
  while ((sourceMatch = sourceLineRegex.exec(content)) !== null) {
    const item = sourceMatch[1].trim();
    if (item && !citations.some((c) => c.documentTitle.toLowerCase() === item.toLowerCase())) {
      citations.push({
        documentTitle: item,
      });
    }
  }

  return { cleanText: content, citations, ticketId };
}

/**
 * Sends a chat message to the configured n8n endpoint.
 * Tries direct fetch first, falling back to local proxy if cross-origin errors occur.
 */
export async function sendQueryToN8n(
  message: string,
  sessionId?: string,
  targetUrl?: string
): Promise<N8nParsedResponse> {
  const activeUrl = targetUrl || getConfiguredN8nUrl();
  const activeSessionId = sessionId || getOrCreateSessionId();

  if (!activeUrl || !activeUrl.startsWith('http')) {
    throw new Error('The n8n Chat Webhook URL is not configured or is invalid. Please verify the URL.');
  }

  const payload = {
    action: 'sendMessage',
    chatInput: message,
    sessionId: activeSessionId,
    message: message, // Support both n8n chat trigger formats
  };

  let responseData: any;
  let usedProxy = false;

  try {
    // Attempt direct fetch to n8n webhook
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    const directRes = await fetch(activeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!directRes.ok) {
      // If error status, grab text
      const errText = await directRes.text();
      throw new Error(`n8n responded with status ${directRes.status}: ${errText || directRes.statusText}`);
    }

    const contentType = directRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      responseData = await directRes.json();
    } else {
      const text = await directRes.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }
    }
  } catch (error: any) {
    // Check if network / CORS issue, fallback to backend proxy
    const isNetworkError =
      error?.name === 'TypeError' ||
      error?.message?.includes('Failed to fetch') ||
      error?.message?.includes('NetworkError') ||
      error?.message?.includes('CORS');

    if (isNetworkError) {
      try {
        const proxyRes = await fetch('/api/chat-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetUrl: activeUrl,
            payload,
          }),
        });

        if (!proxyRes.ok) {
          const proxyErr = await proxyRes.text();
          throw new Error(`n8n webhook error via proxy (${proxyRes.status}): ${proxyErr}`);
        }

        const contentType = proxyRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          responseData = await proxyRes.json();
        } else {
          const txt = await proxyRes.text();
          try {
            responseData = JSON.parse(txt);
          } catch {
            responseData = txt;
          }
        }
        usedProxy = true;
      } catch (proxyError: any) {
        throw new Error(
          `Unable to connect to n8n Helpdesk (${activeUrl}). Please ensure the workflow is active in your n8n workspace. Details: ${proxyError.message || error.message}`
        );
      }
    } else {
      throw error;
    }
  }

  // Parse response from n8n
  let outputText = '';
  let citations: ChatCitation[] = [];
  let ticketId: string | undefined = undefined;

  if (typeof responseData === 'string') {
    outputText = responseData;
  } else if (Array.isArray(responseData) && responseData.length > 0) {
    const first = responseData[0];
    if (typeof first === 'string') {
      outputText = first;
    } else if (typeof first === 'object' && first !== null) {
      outputText = first.output || first.response || first.text || first.message || JSON.stringify(first);
      if (Array.isArray(first.citations)) citations = first.citations;
      if (first.ticketId) ticketId = first.ticketId;
    }
  } else if (typeof responseData === 'object' && responseData !== null) {
    outputText =
      responseData.output ||
      responseData.response ||
      responseData.text ||
      responseData.message ||
      responseData.reply ||
      responseData.data ||
      JSON.stringify(responseData, null, 2);

    if (Array.isArray(responseData.citations)) {
      citations = responseData.citations;
    }
    if (responseData.ticketId) {
      ticketId = responseData.ticketId;
    }
  }

  // If no output text extracted, provide informative fallback
  if (!outputText || outputText.trim() === '') {
    outputText = 'Your query was processed by the campus workflow, but no text response was returned.';
  }

  // Extract any citations or ticket IDs that were embedded in the markdown text
  const extracted = extractMetadataFromText(outputText);
  if (citations.length === 0 && extracted.citations.length > 0) {
    citations = extracted.citations;
  }
  if (!ticketId && extracted.ticketId) {
    ticketId = extracted.ticketId;
  }

  return {
    text: outputText,
    citations,
    ticketId,
    raw: responseData,
  };
}

/**
 * Quick diagnostic ping test for the n8n endpoint
 */
export async function testN8nConnection(url: string): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
}> {
  const startTime = performance.now();
  try {
    const testPayload = {
      action: 'sendMessage',
      chatInput: 'ping_healthcheck_test',
      sessionId: `ping-${Date.now()}`,
    };

    // Try direct or proxy
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });
    } catch {
      res = await fetch('/api/chat-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: url,
          payload: testPayload,
        }),
      });
    }

    const latencyMs = Math.round(performance.now() - startTime);

    if (res.ok || res.status === 200 || res.status === 201) {
      return {
        success: true,
        message: `Connected successfully! (Latency: ${latencyMs}ms)`,
        latencyMs,
      };
    } else {
      return {
        success: false,
        message: `Endpoint returned HTTP ${res.status} (${res.statusText}). In n8n, make sure your workflow is toggled to "Active".`,
        latencyMs,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Connection failed. Please check network or URL.',
    };
  }
}
