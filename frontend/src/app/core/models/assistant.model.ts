export type ChatRole = 'user' | 'assistant' | 'model';

export interface ChatMessage {
  id?: string;
  role: ChatRole;
  content: string;
  timestamp?: string;
  suggestedActions?: string[];
  actionCta?: ActionCta;
  detectedIntent?: 'consultation' | 'pricing' | 'service_area' | 'emergency' | 'general';
  isStreaming?: boolean;
}

export interface ActionCta {
  label: string;
  targetUrl: string;
  type: 'consultation' | 'area_checker' | 'plans' | 'emergency';
}

export interface ChatResponse {
  reply: string;
  suggestedActions: string[];
  detectedIntent: 'consultation' | 'pricing' | 'service_area' | 'emergency' | 'general';
  actionCta?: ActionCta;
  timestamp: string;
}

export interface QuickPromptItem {
  label: string;
  prompt: string;
  icon?: string;
}

export interface QuickPromptsResponse {
  welcomeMessage: string;
  tagline: string;
  serviceArea: string;
  prompts: QuickPromptItem[];
}

export interface ChatRequestPayload {
  messages: { role: ChatRole; content: string }[];
  contextLocality?: string;
  contextPlanSlug?: string;
}
