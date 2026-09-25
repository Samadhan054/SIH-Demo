// Chat API service — wraps all /api/chat/* calls with auth token

import { Conversation, ChatMessage } from '../types/chat';

const BASE = '/api/chat';

function authHeaders(token: string | null): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export async function createConversation(token: string | null, title?: string): Promise<Conversation> {
  const res = await fetch(`${BASE}/conversations`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to create conversation');
  return res.json();
}

export async function getConversations(token: string | null): Promise<Conversation[]> {
  const res = await fetch(`${BASE}/conversations`, { headers: authHeaders(token) });
  if (!res.ok) throw new Error('Failed to load conversations');
  return res.json();
}

export async function getConversation(
  token: string | null,
  conversationId: string
): Promise<{ conversation: Conversation; messages: ChatMessage[] }> {
  const res = await fetch(`${BASE}/conversations/${conversationId}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to load conversation');
  return res.json();
}

export async function deleteConversation(token: string | null, conversationId: string): Promise<void> {
  const res = await fetch(`${BASE}/conversations/${conversationId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete conversation');
}

export async function sendMessage(
  token: string | null,
  conversationId: string,
  content: string,
  socketId?: string
): Promise<{ userMessage: ChatMessage; assistantMessageId: string; streaming: boolean }> {
  const res = await fetch(`${BASE}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ content, socketId }),
  });
  if (res.status === 429) {
    const data = await res.json();
    throw new Error(data.error || 'Rate limit exceeded. Please wait before sending again.');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to send message');
  }
  return res.json();
}
