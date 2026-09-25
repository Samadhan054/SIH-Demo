// Chat-related TypeScript types for FloodGuard AI Chatbot

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
  isStreaming?: boolean;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export type StreamState = 'idle' | 'streaming' | 'error';

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: ChatMessage[];
  streamState: StreamState;
  streamingContent: string;
  streamingMessageId: string | null;
  error: string | null;
  isLoading: boolean;
}
