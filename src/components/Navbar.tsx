import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import {
  GraduationCap,
  Sparkles,
  Menu,
  X,
  MessageSquare,
  Settings,
  HelpCircle,
  Building,
  CheckCircle2,
  AlertCircle,
  Wifi,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { prefillAndFocus, connectionStatus, setIsConfigModalOpen, n8nUrl } = useChat();

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Ask AI', href: '#chat-section' },
    { label: 'Help Categories', href: '#categories' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Campus Directory', href: '#directory' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="flex items-center gap-3 group focus:outline-hidden"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                CampusConnect<span className="text-blue-600">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                v2.4
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 tracking-wide uppercase">
              Student Helpdesk & Policy Portal
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100/70 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: n8n Status Badge + Chat CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* n8n Status Indicator Button */}
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              connectionStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80'
                : connectionStatus === 'checking'
                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100/80'
            }`}
            title="Configure or test n8n chat webhook endpoint"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : connectionStatus === 'checking'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
            <span className="truncate max-w-[120px]">
              {connectionStatus === 'connected'
                ? 'n8n Live'
                : connectionStatus === 'checking'
                ? 'Pinging n8n'
                : 'n8n Workflow'}
            </span>
            <Settings className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => prefillAndFocus('', false, 'inline')}
            className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Assistant</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            title="n8n settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsConfigModalOpen(true);
              }}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                Status: {connectionStatus === 'connected' ? 'n8n Connected' : 'Check n8n'}
              </span>
              <Settings className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                prefillAndFocus('', false, 'inline');
              }}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat with AI Assistant
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
