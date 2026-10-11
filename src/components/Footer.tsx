import React from 'react';
import { GraduationCap, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { HELP_CATEGORIES } from '../data/campusData';
import { useChat } from '../context/ChatContext';

export const Footer: React.FC = () => {
  const { prefillAndFocus, setIsConfigModalOpen } = useChat();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                CampusConnect<span className="text-teal-400">AI</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Official Student Helpdesk portal. Instant AI guidance grounded in published university policy documents,
              academic regulations, and administrative service channels.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-teal-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built to make campus support simpler.</span>
            </div>
          </div>

          {/* Quick Help Categories */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Help Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {HELP_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => prefillAndFocus(cat.sampleQuestions[0], true, 'inline')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Resources */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Student Helpdesk
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#chat-section" className="hover:text-white transition-colors">
                  Ask AI Helpdesk
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#directory" className="hover:text-white transition-colors">
                  Campus Office Directory
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  n8n Integration Status
                </button>
              </li>
            </ul>
          </div>

          {/* Policy & Governance */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Privacy & Trust
            </h4>
            <div className="text-xs space-y-3 leading-relaxed text-slate-400">
              <p>
                <strong>Privacy Notice:</strong> Queries submitted through CampusConnect AI are handled in accordance
                with Student Data Privacy regulations. Do not submit sensitive passwords or banking credentials.
              </p>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Private Credential Logging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} CampusConnect AI — Student Helpdesk. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400">Institutional Regulation v2025.2</span>
            <span>•</span>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="text-teal-400 hover:text-teal-300 hover:underline"
            >
              n8n Cloud Webhook Config
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
