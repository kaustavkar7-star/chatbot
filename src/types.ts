export interface ChatCitation {
  documentTitle: string;
  section?: string;
  page?: string | number;
  url?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  citations?: ChatCitation[];
  ticketId?: string;
  isError?: boolean;
  status?: 'sending' | 'sent' | 'error';
  categoryHint?: string;
}

export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconName: string;
  accentColor: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    iconBg: string;
  };
  sampleQuestions: string[];
  associatedOffice: {
    name: string;
    location: string;
    email: string;
    hours: string;
  };
}

export interface CampusOffice {
  id: string;
  name: string;
  department: string;
  location: string;
  email: string;
  phone: string;
  hours: string;
  primaryTopics: string[];
}

export interface CampusPolicyFaq {
  question: string;
  category: string;
  shortAnswer: string;
  documentSource: string;
}
