import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <Bot className="w-4.5 h-4.5 animate-pulse" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            CampusConnect AI
            <span className="text-[10px] text-teal-600 font-medium flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 animate-spin" /> Retrieving official regulations...
            </span>
          </span>
        </div>

        <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-white border border-slate-200/90 shadow-xs flex items-center gap-1.5 w-fit">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
          <span className="text-xs text-slate-400 font-medium ml-2">Formulating answer...</span>
        </div>
      </div>
    </div>
  );
};
