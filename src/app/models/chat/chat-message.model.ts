export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdUtc: string; // ISO timestamp
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdUtc: string;
  updatedUtc: string;
}
