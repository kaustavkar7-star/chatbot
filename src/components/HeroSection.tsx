import React from 'react';
import { useChat } from '../context/ChatContext';
import {
  Sparkles,
  MessageSquare,
  Compass,
  CheckCircle,
  FileText,
  Building,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { prefillAndFocus } = useChat();

  const handleChatClick = () => {
    prefillAndFocus('', false, 'inline');
  };

  const handleExploreClick = () => {
    const el = document.getElementById('categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 -z-10 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-100/70 blur-3xl" />
        <div className="absolute top-[-10%] right-[15%] w-[450px] h-[450px] rounded-full bg-teal-100/60 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-semibold shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Official University Student Helpdesk</span>
              <span className="text-blue-300">•</span>
              <span className="text-blue-700 font-bold">2025–2026 Academic Year</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Your Campus Questions, <br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                Answered.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Get instant guidance on campus policies, hostel, fees, leave, ID cards, and IT support. Powered by
              our verified n8n AI workflow connected directly to official university regulations.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={handleChatClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat with AI Assistant</span>
              </button>

              <button
                onClick={handleExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-base shadow-2xs hover:shadow-sm transition-all cursor-pointer"
              >
                <Compass className="w-5 h-5 text-blue-600" />
                <span>Explore Help Topics</span>
              </button>
            </div>

            {/* Feature trust markers */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Handbooks</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Instant 24/7 Response</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Direct Office Routing</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-fidelity Campus Helpdesk Preview Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Backing decorative card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-teal-500/10 rounded-3xl transform rotate-2 scale-102 filter blur-sm" />

              {/* Main Card */}
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 shadow-2xl p-6 space-y-4">
                {/* Simulated Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      CC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">CampusConnect AI Assistant</div>
                      <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active n8n Workflow
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                    Live Demo
                  </span>
                </div>

                {/* Simulated Student Query */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-br-xs px-3.5 py-2.5 text-xs font-medium max-w-[85%] shadow-xs">
                    How do I pay my semester fees and what is the deadline?
                  </div>
                </div>

                {/* Simulated AI Answer */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    AI
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3.5 text-xs text-slate-800 space-y-2 flex-1 shadow-2xs">
                    <p className="leading-relaxed">
                      Semester tuition fees must be paid online via the <strong>Student Accounts ERP Portal</strong>.
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-[11px] space-y-1">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>Standard Deadline:</span>
                        <span className="text-emerald-700">Sept 15, 2025</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Late Fee Window:</span>
                        <span className="text-amber-700">Sept 16 – Sept 30 ($25 fine)</span>
                      </div>
                    </div>
                    {/* Citation pill */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-900 text-[10px] font-medium">
                      <FileText className="w-3 h-3 text-blue-600" />
                      <span>Academic Fee Regulations 2025–26 §4.1</span>
                    </div>
                  </div>
                </div>

                {/* Prompt trigger chip */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Try Asking Now:
                  </div>
                  <button
                    onClick={() => prefillAndFocus('How do I pay my semester fees?', true, 'inline')}
                    className="w-full text-left p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 text-xs text-blue-950 font-medium flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <span>"How do I pay my semester fees?"</span>
                    <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Floating micro badge */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">5 Help Categories</div>
                  <div className="text-[10px] text-slate-500">Hostel, Fees, ID, IT & Leave</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
