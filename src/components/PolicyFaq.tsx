import React, { useState } from 'react';
import { POPULAR_FAQS } from '../data/campusData';
import { useChat } from '../context/ChatContext';
import { ChevronDown, ChevronUp, FileText, Sparkles, MessageSquare } from 'lucide-react';

export const PolicyFaq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { prefillAndFocus } = useChat();

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Document Grounding & Statutes</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Referenced Policies
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Preview key rules codified in official university statutes. Ask the AI assistant to drill down into any
            specific exception or clause.
          </p>
        </div>

        <div className="space-y-3">
          {POPULAR_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 bg-white shadow-2xs hover:border-blue-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 shrink-0">
                      {faq.category}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">
                      {faq.question}
                    </span>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-700 bg-slate-50/50 border-t border-slate-100 space-y-3 animate-in fade-in">
                    <p className="leading-relaxed">{faq.shortAnswer}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/60 text-xs">
                      <div className="flex items-center gap-2 text-slate-500">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Source: <strong className="text-slate-700">{faq.documentSource}</strong></span>
                      </div>

                      <button
                        type="button"
                        onClick={() => prefillAndFocus(faq.question, true, 'inline')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Ask AI Assistant More About This
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
