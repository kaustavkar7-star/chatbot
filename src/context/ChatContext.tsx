import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ChatMessage, ChatCitation } from '../types';
import {
  getConfiguredN8nUrl,
  setConfiguredN8nUrl,
  resetN8nUrlToDefault,
  getOrCreateSessionId,
  sendQueryToN8n,
  testN8nConnection,
  DEFAULT_N8N_URL,
} from '../services/n8nService';

interface ChatContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  inputValue: string;
  setInputValue: (val: string) => void;
  isFloatingOpen: boolean;
  setIsFloatingOpen: (open: boolean) => void;
  n8nUrl: string;
  updateN8nUrl: (url: string) => void;
  resetUrlToDefault: () => void;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (open: boolean) => void;
  connectionStatus: 'connected' | 'checking' | 'error' | 'unconfigured';
  statusDetails: string;
  sendMessage: (textToSubmit?: string) => Promise<void>;
  prefillAndFocus: (text: string, autoSend?: boolean, viewTarget?: 'inline' | 'floating') => void;
  resetConversation: () => void;
  sessionId: string;
  recheckConnection: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: `Hello! I am **CampusConnect AI**, your official college student helpdesk assistant. 

I can help you navigate campus policies, fee deadlines, hostel guidelines, attendance rules, lost ID replacements, and campus IT setup.

**How can I assist you today?** Feel free to choose one of the suggested topics below or type your inquiry.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  citations: [
    {
      documentTitle: 'University Student Code & Campus Regulations 2025–26',
      section: 'Official Helpdesk Knowledge Base',
    },
  ],
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = sessionStorage.getItem('campusconnect_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [isFloatingOpen, setIsFloatingOpen] = useState<boolean>(false);
  const [n8nUrl, setN8nUrlState] = useState<string>(getConfiguredN8nUrl());
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'checking' | 'error' | 'unconfigured'>(
    'checking'
  );
  const [statusDetails, setStatusDetails] = useState<string>('Verifying n8n webhook connection...');

  // Save messages to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem('campusconnect_chat_history', JSON.stringify(messages));
    } catch {
      // storage full or disabled
    }
  }, [messages]);

  // Check connection on mount or URL change
  const recheckConnection = useCallback(async () => {
    const activeUrl = getConfiguredN8nUrl();
    if (!activeUrl || !activeUrl.startsWith('http')) {
      setConnectionStatus('unconfigured');
      setStatusDetails('n8n Webhook URL is not configured.');
      return;
    }
    setConnectionStatus('checking');
    setStatusDetails('Pinging n8n webhook...');

    const res = await testN8nConnection(activeUrl);
    if (res.success) {
      setConnectionStatus('connected');
      setStatusDetails(`Online (${res.latencyMs ? res.latencyMs + 'ms' : 'Active'})`);
    } else {
      // It's still configured, but n8n workflow might need activation or message trigger
      setConnectionStatus('error');
      setStatusDetails(res.message);
    }
  }, []);

  useEffect(() => {
    recheckConnection();
  }, [n8nUrl, recheckConnection]);

  const updateN8nUrl = (url: string) => {
    setConfiguredN8nUrl(url);
    setN8nUrlState(url);
    recheckConnection();
  };

  const resetUrlToDefault = () => {
    resetN8nUrlToDefault();
    setN8nUrlState(DEFAULT_N8N_URL);
    recheckConnection();
  };

  const resetConversation = useCallback(() => {
    const newSession = getOrCreateSessionId(true);
    setSessionId(newSession);
    const freshWelcome: ChatMessage = {
      ...INITIAL_WELCOME_MESSAGE,
      id: `msg-welcome-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([freshWelcome]);
    sessionStorage.removeItem('campusconnect_chat_history');
  }, []);

  const sendMessage = useCallback(
    async (textToSubmit?: string) => {
      const text = (textToSubmit !== undefined ? textToSubmit : inputValue).trim();
      if (!text || isTyping) return;

      const userMsgId = `msg-usr-${Date.now()}`;
      const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newUserMessage: ChatMessage = {
        id: userMsgId,
        sender: 'user',
        text,
        timestamp: nowFormatted,
        status: 'sending',
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInputValue('');
      setIsTyping(true);

      try {
        const response = await sendQueryToN8n(text, sessionId, n8nUrl);

        const aiMsgId = `msg-ai-${Date.now()}`;
        const newAiMessage: ChatMessage = {
          id: aiMsgId,
          sender: 'assistant',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: response.citations,
          ticketId: response.ticketId,
          status: 'sent',
        };

        setMessages((prev) =>
          prev
            .map((m): ChatMessage => (m.id === userMsgId ? { ...m, status: 'sent' as const } : m))
            .concat(newAiMessage)
        );
        setConnectionStatus('connected');
        setStatusDetails('Active');
      } catch (err: any) {
        const errorText = err?.message || 'Could not reach the n8n Student Helpdesk workflow.';
        const errorMsgId = `msg-err-${Date.now()}`;

        const errorAiMessage: ChatMessage = {
          id: errorMsgId,
          sender: 'assistant',
          text: `⚠️ **Unable to fetch response from n8n Helpdesk Workflow**\n\n${errorText}\n\n*Troubleshooting Steps:*\n1. Check if the n8n workflow is toggled to **Active** in your n8n workspace.\n2. Confirm the Webhook URL is set to the **Production URL** rather than the temporary test URL if using live triggers.\n3. You can click **n8n Status** at the top right to check endpoint details and test ping.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          status: 'error',
        };

        setMessages((prev) =>
          prev
            .map((m): ChatMessage => (m.id === userMsgId ? { ...m, status: 'error' as const } : m))
            .concat(errorAiMessage)
        );
        setConnectionStatus('error');
        setStatusDetails('Workflow unreachable');
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping, sessionId, n8nUrl]
  );

  const prefillAndFocus = useCallback(
    (text: string, autoSend = false, viewTarget: 'inline' | 'floating' = 'inline') => {
      setInputValue(text);

      if (viewTarget === 'floating') {
        setIsFloatingOpen(true);
      } else {
        const chatElement = document.getElementById('chat-section');
        if (chatElement) {
          chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      if (autoSend) {
        setTimeout(() => {
          sendMessage(text);
        }, 120);
      } else {
        // Focus input after slight scroll
        setTimeout(() => {
          const inputEl = document.querySelector<HTMLTextAreaElement | HTMLInputElement>(
            viewTarget === 'floating' ? '#floating-chat-input' : '#inline-chat-input'
          );
          if (inputEl) {
            inputEl.focus();
          }
        }, 300);
      }
    },
    [sendMessage]
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        inputValue,
        setInputValue,
        isFloatingOpen,
        setIsFloatingOpen,
        n8nUrl,
        updateN8nUrl,
        resetUrlToDefault,
        isConfigModalOpen,
        setIsConfigModalOpen,
        connectionStatus,
        statusDetails,
        sendMessage,
        prefillAndFocus,
        resetConversation,
        sessionId,
        recheckConnection,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
