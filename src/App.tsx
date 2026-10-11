/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChatProvider } from './context/ChatContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HelpCategories } from './components/HelpCategories';
import { DedicatedChatSection } from './components/DedicatedChatSection';
import { HowItWorks } from './components/HowItWorks';
import { PolicyFaq } from './components/PolicyFaq';
import { CampusDirectory } from './components/CampusDirectory';
import { Footer } from './components/Footer';
import { FloatingChat } from './components/FloatingChat';
import { ConfigModal } from './components/ConfigModal';

export default function App() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        {/* Top Navigation */}
        <Navbar />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection />

          {/* Interactive Help Category Cards (5 Categories) */}
          <HelpCategories />

          {/* Dedicated Embedded n8n Chat Section */}
          <DedicatedChatSection />

          {/* How It Works (3 Steps) */}
          <HowItWorks />

          {/* Policy Statutes & FAQs */}
          <PolicyFaq />

          {/* Campus Office Directory & Escalation */}
          <CampusDirectory />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Floating Chat Widget (Bottom Right) */}
        <FloatingChat />

        {/* n8n Configuration & Diagnostics Modal */}
        <ConfigModal />
      </div>
    </ChatProvider>
  );
}
