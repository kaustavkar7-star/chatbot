import React from 'react';
import { useChat } from '../context/ChatContext';
import { HELP_CATEGORIES } from '../data/campusData';
import { HelpCategory } from '../types';
import {
  CreditCard,
  Building2,
  GraduationCap,
  IdCard,
  Wifi,
  ArrowRight,
  MessageSquare,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const HelpCategories: React.FC = () => {
  const { prefillAndFocus } = useChat();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6" />;
      case 'IdCard':
        return <IdCard className="w-6 h-6" />;
      case 'Wifi':
        return <Wifi className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const handleCardClick = (cat: HelpCategory) => {
    // Pick the first sample question
    const defaultQuestion = cat.sampleQuestions[0];
    prefillAndFocus(defaultQuestion, true, 'inline');
  };

  const handleQuestionClick = (e: React.MouseEvent, question: string) => {
    e.stopPropagation();
    prefillAndFocus(question, true, 'inline');
  };

  return (
    <section id="categories" className="py-16 lg:py-24 bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Campus Help Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Browse by Topic or Ask Directly
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Select any category below to load verified institutional regulations, review working office hours, or
            launch an instant chat query with the n8n AI assistant.
          </p>
        </div>

        {/* Categories Grid (5 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {HELP_CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCardClick(category)}
              className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${category.accentColor.iconBg}`}
                  >
                    {getIcon(category.iconName)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${category.accentColor.badgeBg}`}
                  >
                    {category.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {category.description}
                </p>

                {/* Quick Questions Sublist */}
                <div className="space-y-2 mb-6">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Common Questions:
                  </div>
                  <div className="space-y-1.5">
                    {category.sampleQuestions.slice(0, 3).map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => handleQuestionClick(e, q)}
                        className="w-full text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-transparent hover:border-blue-200 transition-colors flex items-center justify-between group/btn cursor-pointer"
                      >
                        <span className="truncate pr-2">• {q}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover/btn:text-blue-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Bottom / Associated Office & Action */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{category.associatedOffice.location}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    Ask AI Assistant <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">Instant AI</span>
                </div>
              </div>
            </div>
          ))}

          {/* 6th Card: All-in-One Comprehensive Help Card */}
          <div className="group relative bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/20 text-teal-200 border border-teal-400/30">
                  Custom Inquiries
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Have a Different Question?</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Our n8n Student Query Helpdesk handles cross-departmental questions including library books, student
                visas, sports facilities, cafeteria timing, and campus transport.
              </p>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-xs text-slate-200 space-y-2">
                <div className="font-semibold text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Direct n8n Workflow Integration
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Processes live prompts directly against your uploaded university PDFs and institutional datasets.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => prefillAndFocus('', false, 'inline')}
                className="w-full py-3 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span>Open Custom Query Box</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
