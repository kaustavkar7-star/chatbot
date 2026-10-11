import React from 'react';
import { ChatContainer } from './ChatContainer';
import { Sparkles, ShieldCheck, HelpCircle, FileText, Bot } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const DedicatedChatSection: React.FC = () => {
  const { connectionStatus, setIsConfigModalOpen, n8nUrl } = useChat();

  return (
    <section id="chat-section" className="py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive AI Helpdesk Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ask CampusConnect AI Directly
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Real-time conversational assistant connected directly to your n8n workflow. Ask about course drop dates,
            mess refunds, hostel gates, duplicate ID cards, or campus Wi-Fi access.
          </p>
        </div>

        {/* The Inline Chat Experience */}
        <div className="max-w-4xl mx-auto">
          <ChatContainer variant="inline" />
        </div>
      </div>
    </section>
  );
};
