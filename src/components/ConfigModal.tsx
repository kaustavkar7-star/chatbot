import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { testN8nConnection, DEFAULT_N8N_URL } from '../services/n8nService';
import {
  X,
  Settings,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Code2,
  Cpu,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

export const ConfigModal: React.FC = () => {
  const {
    n8nUrl,
    updateN8nUrl,
    resetUrlToDefault,
    isConfigModalOpen,
    setIsConfigModalOpen,
    sessionId,
  } = useChat();

  const [tempUrl, setTempUrl] = useState(n8nUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isConfigModalOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testN8nConnection(tempUrl);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = () => {
    updateN8nUrl(tempUrl);
    setIsConfigModalOpen(false);
  };

  const handleReset = () => {
    resetUrlToDefault();
    setTempUrl(DEFAULT_N8N_URL);
    setTestResult(null);
  };

  const samplePayloadSnippet = JSON.stringify(
    {
      action: 'sendMessage',
      chatInput: 'How do I pay my semester fees?',
      sessionId: sessionId,
      message: 'How do I pay my semester fees?',
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">n8n Workflow Integration</h3>
              <p className="text-xs text-slate-500">Embedded Chatbot Endpoint & Configuration</p>
            </div>
          </div>
          <button
            onClick={() => setIsConfigModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Active Webhook URL field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              n8n Chat Webhook URL (`VITE_N8N_CHAT_URL`)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://your-n8n-instance.app.n8n.cloud/webhook/.../chat"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-hidden bg-slate-50/50"
              />
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !tempUrl}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                {testing ? 'Testing...' : 'Test Ping'}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Configured via environment variable or custom override</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Reset to Provided URL
              </button>
            </div>
          </div>

          {/* Test Result Box */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  {testResult.success ? 'Endpoint Reachable!' : 'Connection Warning'}
                </div>
                <div className="mt-0.5 leading-relaxed">{testResult.message}</div>
                {testResult.latencyMs && (
                  <div className="text-[11px] font-mono mt-1 text-slate-600">
                    Response time: {testResult.latencyMs} ms
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Integration Guide Accordion / Info */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-blue-600" />
              How the Chatbot Communicates with n8n
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When a student submits an inquiry on CampusConnect AI, our frontend sends a POST request with the following JSON schema:
            </p>

            <div className="relative">
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-normal">
                {samplePayloadSnippet}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(samplePayloadSnippet);
                  setCopiedSnippet(true);
                  setTimeout(() => setCopiedSnippet(false), 2000);
                }}
                className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
              >
                {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 pt-1">
              <div className="font-semibold text-slate-800">Your n8n Workflow Configuration Checklist:</div>
              <ul className="list-disc pl-4 space-y-1 text-[12px] text-slate-600">
                <li>
                  <strong>Chat Trigger Node:</strong> Use the default <code>Chat Trigger</code> or <code>Webhook</code> node with method <code>POST</code>.
                </li>
                <li>
                  <strong>Read Question:</strong> Read from <code>chatInput</code> or <code>message</code>.
                </li>
                <li>
                  <strong>AI Memory:</strong> Use <code>sessionId</code> (e.g. <code>{sessionId}</code>) to retain multi-turn context.
                </li>
                <li>
                  <strong>Response Node:</strong> Return an object with <code>{`{ "output": "your answer..." }`}</code> or plain text. You can also include <code>ticketId</code> or <code>citations</code>!
                </li>
                <li>
                  <strong>Workflow Active Switch:</strong> Ensure the toggle in top-right of your n8n workflow canvas is set to <strong>Active</strong>.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-3xl">
          <a
            href="https://kaustavkar7.app.n8n.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
          >
            Open n8n Workspace <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex gap-2">
            <button
              onClick={() => setIsConfigModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
