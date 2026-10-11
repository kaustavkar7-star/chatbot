import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { DEFAULT_SUGGESTED_QUESTIONS } from '../data/campusData';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  className?: string;
  compact?: boolean;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  className = '',
  compact = false,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
        <span>Frequently Asked Student Inquiries</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {DEFAULT_SUGGESTED_QUESTIONS.map((question, idx) => (
          <button
            key={`suggested-${idx}`}
            onClick={() => onSelectQuestion(question)}
            className={`group text-left inline-flex items-center gap-2 rounded-xl transition-all duration-200 border cursor-pointer ${
              compact
                ? 'px-3 py-1.5 text-xs bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900'
                : 'px-3.5 py-2 text-xs sm:text-sm bg-white hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-teal-50/80 border-slate-200/90 hover:border-blue-300 text-slate-700 hover:text-blue-950 shadow-2xs hover:shadow-sm'
            }`}
          >
            <span className="font-medium group-hover:translate-x-0.5 transition-transform">{question}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};
