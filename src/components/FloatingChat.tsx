import React from 'react';
import { useChat } from '../context/ChatContext';
import { ChatContainer } from './ChatContainer';
import { MessageSquareText, Sparkles, X } from 'lucide-react';

export const FloatingChat: React.FC = () => {
  const { isFloatingOpen, setIsFloatingOpen, messages, connectionStatus } = useChat();

  return (
    <>
      {/* Floating Chat Container Modal when open */}
      {isFloatingOpen && (
        <ChatContainer
          variant="floating"
          onClose={() => setIsFloatingOpen(false)}
        />
      )}

      {/* Floating Launcher Button */}
      {!isFloatingOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Friendly prompt bubble */}
          <div
            onClick={() => setIsFloatingOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-lg px-3.5 py-2 rounded-full cursor-pointer hover:border-blue-300 hover:shadow-xl transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">
              Need campus help? Ask AI
            </span>
          </div>

          <button
            onClick={() => setIsFloatingOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Open CampusConnect AI Helpdesk Chatbot"
          >
            <MessageSquareText className="w-6 h-6 group-hover:rotate-6 transition-transform" />

            {/* Sparkle badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-400 text-slate-900 flex items-center justify-center shadow-xs">
              <Sparkles className="w-3 h-3 text-slate-950 font-bold" />
            </span>

            {/* Status dot */}
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500'
                  : connectionStatus === 'checking'
                  ? 'bg-amber-400'
                  : 'bg-blue-400'
              }`}
            />
          </button>
        </div>
      )}
    </>
  );
};
