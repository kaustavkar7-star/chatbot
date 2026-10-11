import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/campusData';
import { MessageSquareText, BookOpenCheck, Building, ArrowRight, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquareText':
        return <MessageSquareText className="w-7 h-7" />;
      case 'BookOpenCheck':
        return <BookOpenCheck className="w-7 h-7" />;
      case 'Building':
        return <Building className="w-7 h-7" />;
      default:
        return <ShieldCheck className="w-7 h-7" />;
    }
  };

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How CampusConnect AI Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            From quick midnight queries about mess rebates to critical end-semester academic rules, here is how our
            embedded n8n workflow assists students.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="relative bg-slate-50/70 hover:bg-white rounded-3xl p-8 border border-slate-200/90 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Step number badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  {getStepIcon(step.icon)}
                </div>
                <span className="w-9 h-9 rounded-full bg-blue-100/80 text-blue-800 font-extrabold text-sm flex items-center justify-center">
                  0{step.step}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-teal-700 tracking-wider uppercase block mb-1">
                  {step.subtitle}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Step completion pill */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs text-slate-500 font-medium">
                {step.step === 1 && 'Available on Web & Mobile'}
                {step.step === 2 && 'Grounding via n8n RAG nodes'}
                {step.step === 3 && 'Office locations, hours & ticketing'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
