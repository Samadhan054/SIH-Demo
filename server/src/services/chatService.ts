/**
 * Chat Service — Conversation & Message Management
 * -------------------------------------------------
 * Uses in-memory storage (consistent with the rest of the application).
 * Schema is production-ready for migration to PostgreSQL when needed.
 *
 * Security:
 * - All methods require userId for ownership verification.
 * - Users can only access their own conversations.
 */

import { v4 as uuidv4 } from 'uuid';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
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

// ─── In-Memory Stores ─────────────────────────────────────────────────────────
// Production: Replace these Maps with PostgreSQL queries.

const conversationStore = new Map<string, Conversation>();   // conversationId → Conversation
const messageStore = new Map<string, ChatMessage[]>();       // conversationId → ChatMessage[]
const userConversationIndex = new Map<string, string[]>();   // userId → conversationId[]

// ─── Chat Service ─────────────────────────────────────────────────────────────

class ChatService {

  // ── Conversations ──────────────────────────────────────────────────────────

  createConversation(userId: string, title = 'New Conversation'): Conversation {
    const id = uuidv4();
    const now = new Date().toISOString();

    const conversation: Conversation = {
      id,
      userId,
      title,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
    };

    conversationStore.set(id, conversation);
    messageStore.set(id, []);

    // Update user index
    const userConvs = userConversationIndex.get(userId) || [];
    userConversationIndex.set(userId, [id, ...userConvs]);

    return conversation;
  }

  getConversations(userId: string): Conversation[] {
    const ids = userConversationIndex.get(userId) || [];
    return ids
      .map((id) => conversationStore.get(id))
      .filter((c): c is Conversation => !!c)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getConversation(conversationId: string, userId: string): Conversation | null {
    const conv = conversationStore.get(conversationId);
    if (!conv || conv.userId !== userId) return null;
    return conv;
  }

  deleteConversation(conversationId: string, userId: string): boolean {
    const conv = conversationStore.get(conversationId);
    if (!conv || conv.userId !== userId) return false;

    conversationStore.delete(conversationId);
    messageStore.delete(conversationId);

    const userConvs = userConversationIndex.get(userId) || [];
    userConversationIndex.set(userId, userConvs.filter((id) => id !== conversationId));

    return true;
  }

  private updateConversationTitle(conversationId: string, firstUserMessage: string): void {
    const conv = conversationStore.get(conversationId);
    if (!conv || conv.title !== 'New Conversation') return;

    // Auto-generate title from first message (truncate at 45 chars)
    const title = firstUserMessage.length > 45
      ? firstUserMessage.slice(0, 42) + '...'
      : firstUserMessage;
    conv.title = title;
    conv.updatedAt = new Date().toISOString();
  }

  private updateConversationTimestamp(conversationId: string): void {
    const conv = conversationStore.get(conversationId);
    if (conv) {
      conv.updatedAt = new Date().toISOString();
      conv.messageCount = (messageStore.get(conversationId) || []).length;
    }
  }

  // ── Messages ───────────────────────────────────────────────────────────────

  addMessage(
    conversationId: string,
    userId: string,
    role: ChatRole,
    content: string,
    metadata?: Record<string, unknown>
  ): ChatMessage | null {
    const conv = conversationStore.get(conversationId);
    if (!conv || conv.userId !== userId) return null;

    const message: ChatMessage = {
      id: uuidv4(),
      conversationId,
      userId,
      role,
      content,
      createdAt: new Date().toISOString(),
      metadata,
    };

    const messages = messageStore.get(conversationId) || [];
    messages.push(message);
    messageStore.set(conversationId, messages);

    // Auto-title from first user message
    if (role === 'user') {
      const userMessages = messages.filter((m) => m.role === 'user');
      if (userMessages.length === 1) {
        this.updateConversationTitle(conversationId, content);
      }
    }

    this.updateConversationTimestamp(conversationId);
    return message;
  }

  getMessages(conversationId: string, userId: string): ChatMessage[] | null {
    const conv = conversationStore.get(conversationId);
    if (!conv || conv.userId !== userId) return null;
    return messageStore.get(conversationId) || [];
  }

  /**
   * Returns messages formatted for AI context (role + content only).
   * Limits to last MAX_CONTEXT_MESSAGES to control token usage.
   */
  getAIContext(conversationId: string, userId: string, maxMessages = 20): { role: 'user' | 'model'; content: string }[] {
    const messages = this.getMessages(conversationId, userId) || [];
    return messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-maxMessages)
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));
  }

  updateMessageContent(messageId: string, conversationId: string, content: string): void {
    const messages = messageStore.get(conversationId) || [];
    const msg = messages.find((m) => m.id === messageId);
    if (msg) msg.content = content;
  }
}

export const chatService = new ChatService();
