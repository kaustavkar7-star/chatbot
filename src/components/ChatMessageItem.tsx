import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  Bot,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  FileText,
  Ticket,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
  onRetry?: (text: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown symbols for clean speech
    const cleanSpeech = message.text.replace(/[*#_`~[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2.5 my-3 group">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-xs px-4 py-3 shadow-md shadow-blue-500/10 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-medium px-1">
            <span>{message.timestamp}</span>
            {message.status === 'sending' && <span className="text-blue-500 animate-pulse">Sending...</span>}
            {message.status === 'error' && (
              <span className="text-rose-500 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3 h-3" /> Failed
              </span>
            )}
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 shadow-xs mb-5">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 my-4 group">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <Bot className="w-4.5 h-4.5" />
      </div>

      <div className="flex flex-col max-w-[90%] sm:max-w-[82%]">
        {/* Header tag */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            CampusConnect AI
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
              <Sparkles className="w-2.5 h-2.5 text-teal-500" /> Policy Verified
            </span>
          </span>
          <span className="text-[11px] text-slate-400">{message.timestamp}</span>
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl rounded-tl-xs p-4.5 shadow-sm border text-sm leading-relaxed transition-all ${
            message.isError
              ? 'bg-rose-50/70 border-rose-200 text-rose-900'
              : 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300'
          }`}
        >
          <MarkdownRenderer content={message.text} />

          {/* Ticket ID Badge if returned */}
          {message.ticketId && (
            <div className="mt-3.5 p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-900">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold">
                  <Ticket className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <div className="font-semibold text-amber-950">Campus Helpdesk Ticket Logged</div>
                  <div className="text-[11px] text-amber-800/90">
                    ID: <span className="font-mono font-bold tracking-wide">{message.ticketId}</span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 text-[10px] font-medium uppercase tracking-wider shrink-0">
                Pending Staff Review
              </span>
            </div>
          )}

          {/* Source Document Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                Source Policy Citations ({message.citations.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {message.citations.map((citation, i) => (
                  <div
                    key={`cite-${i}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-900 text-xs transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="font-medium">{citation.documentTitle}</span>
                    {citation.section && (
                      <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                        {citation.section}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action bar (Copy, Speak, Retry) */}
        <div className="flex items-center gap-1 mt-1.5 px-1 text-slate-400 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-600 text-xs flex items-center gap-1 transition-colors"
            title="Copy message to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {'speechSynthesis' in window && !message.isError && (
            <button
              onClick={handleSpeak}
              className={`p-1 rounded-md hover:bg-slate-100 hover:text-slate-600 text-xs flex items-center gap-1 transition-colors ${
                isSpeaking ? 'text-blue-600 font-medium' : ''
              }`}
              title={isSpeaking ? 'Stop speech' : 'Listen to response'}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-blue-600" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>
          )}

          {message.isError && onRetry && (
            <button
              onClick={() => onRetry(message.text)}
              className="p-1 rounded-md text-rose-600 hover:bg-rose-50 text-xs flex items-center gap-1 font-medium ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px]">Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
