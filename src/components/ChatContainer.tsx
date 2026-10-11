import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { ChatMessageItem } from './ChatMessageItem';
import { TypingIndicator } from './TypingIndicator';
import { SuggestedQuestions } from './SuggestedQuestions';
import {
  Send,
  RotateCcw,
  Download,
  Settings,
  ShieldAlert,
  Wifi,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ChatContainerProps {
  variant?: 'inline' | 'floating';
  onClose?: () => void;
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  variant = 'inline',
  onClose,
  className = '',
}) => {
  const {
    messages,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
    resetConversation,
    prefillAndFocus,
    setIsConfigModalOpen,
    connectionStatus,
    statusDetails,
    sessionId,
    n8nUrl,
  } = useChat();

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll when messages change or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isTyping) {
        sendMessage();
      }
    }
  };

  const handleExportTranscript = () => {
    const textLines = [
      `=========================================================`,
      `CAMPUSCONNECT AI — STUDENT HELPDESK CHAT TRANSCRIPT`,
      `Session ID: ${sessionId}`,
      `Exported At: ${new Date().toLocaleString()}`,
      `Connected Endpoint: ${n8nUrl}`,
      `=========================================================\n`,
    ];

    messages.forEach((m) => {
      const senderLabel = m.sender === 'user' ? 'STUDENT' : 'CAMPUSCONNECT AI';
      textLines.push(`[${m.timestamp}] ${senderLabel}:`);
      textLines.push(m.text);
      if (m.ticketId) {
        textLines.push(`Ticket Reference: ${m.ticketId}`);
      }
      if (m.citations && m.citations.length > 0) {
        textLines.push(`Citations: ${m.citations.map((c) => c.documentTitle).join(', ')}`);
      }
      textLines.push('\n---------------------------------------------------------\n');
    });

    const blob = new Blob([textLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusConnect_Transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isFloating = variant === 'floating';

  return (
    <div
      className={`flex flex-col bg-white border border-slate-200/90 shadow-xl overflow-hidden ${
        isFloating
          ? isExpanded
            ? 'fixed inset-4 sm:inset-10 z-50 rounded-2xl'
            : 'fixed bottom-5 right-5 w-[92vw] sm:w-[420px] md:w-[460px] h-[640px] max-h-[85vh] z-50 rounded-2xl shadow-2xl'
          : 'rounded-3xl h-[680px] max-h-[85vh] w-full'
      } ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-blue-900/40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-400'
                  : connectionStatus === 'checking'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">CampusConnect AI</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-blue-500/20 text-blue-200 border border-blue-400/30 uppercase">
                Student Desk
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                {connectionStatus === 'connected' ? (
                  <span className="text-emerald-300 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> n8n Connected
                  </span>
                ) : connectionStatus === 'checking' ? (
                  <span className="text-amber-300 flex items-center gap-1">
                    <Wifi className="w-3 h-3 animate-pulse" /> Connecting...
                  </span>
                ) : (
                  <span className="text-rose-300 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3 h-3" /> Check Workflow
                  </span>
                )}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 text-[11px] truncate max-w-[140px] sm:max-w-[200px]" title={n8nUrl}>
                cloud.n8n
              </span>
            </div>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex items-center gap-1 text-slate-300">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            title="n8n Integration & Diagnostics"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportTranscript}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
            title="Export Conversation Transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowConfirmReset((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-slate-300"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {showConfirmReset && (
              <div className="absolute right-0 top-10 w-56 p-3 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 z-50 text-xs animate-in fade-in">
                <p className="font-semibold text-slate-900 mb-1">Reset this session?</p>
                <p className="text-slate-500 mb-2.5">Clear chat history and begin a fresh student query session.</p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      resetConversation();
                      setShowConfirmReset(false);
                    }}
                    className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {isFloating && (
            <>
              <button
                onClick={() => setIsExpanded((v) => !v)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors ml-1"
                  title="Close Helpdesk Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Connection Notification Bar if error or checking */}
      {connectionStatus === 'error' && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-2 truncate pr-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">
              n8n workflow is currently standby or in test mode. Live queries will attempt direct/proxy connection.
            </span>
          </div>
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="font-semibold text-amber-900 underline hover:text-amber-700 shrink-0"
          >
            Diagnostics
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2 bg-gradient-to-b from-slate-50/60 to-white">
        {/* Policy Notice Badge */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-2.5 text-xs text-blue-900 flex items-start gap-2.5 mb-3">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-semibold">Campus Verification Notice:</span> AI-generated guidance is based on
            available campus policy documents and live workflow logic. For official approval or sensitive appeals,
            visit designated campus offices.
          </div>
        </div>

        {/* Message Items */}
        {messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            onRetry={(text) => {
              sendMessage(text);
            }}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Topics (if visible) */}
      {messages.length <= 3 && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 shrink-0">
          <SuggestedQuestions
            compact={true}
            onSelectQuestion={(q) => {
              prefillAndFocus(q, true, variant);
            }}
          />
        </div>
      )}

      {/* Chat Input Section */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="relative flex items-end gap-2"
        >
          <div className="relative flex-1">
            <textarea
              id={isFloating ? 'floating-chat-input' : 'inline-chat-input'}
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about fees, hostel rules, leave, ID card, or Wi-Fi..."
              rows={isFloating && !isExpanded ? 2 : 2}
              className="w-full resize-none rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 pl-3.5 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all outline-hidden bg-slate-50/40 focus:bg-white"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`h-[42px] px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              inputValue.trim() && !isTyping
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title="Send query"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>

        {/* Safety & Transparency Notice directly underneath input */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <p className="flex items-center gap-1 leading-tight">
            <span>AI guidance based on demo campus policies. For sensitive cases, contact office.</span>
          </p>
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>Press Enter ↵ to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};
