// useChat — custom hook for chatbot state management
// Connects to existing Socket.IO via useSocket() and existing auth via useAuth()

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Conversation, ChatMessage } from '../types/chat';
import * as chatApi from '../services/chatApi';

export function useChat() {
  const { token, user } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamingContentRef = useRef('');

  // ── Join socket room for targeted streaming ────────────────────────────────
  useEffect(() => {
    if (socket && user.id) {
      socket.emit('chat_join', user.id);
    }
  }, [socket, user.id]);

  // ── Socket.IO streaming event listeners ───────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const onStreamStart = ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
      if (conversationId !== activeConversationId) return;
      setIsStreaming(true);
      setStreamingMessageId(messageId);
      setStreamingContent('');
      streamingContentRef.current = '';
    };

    const onStreamChunk = ({ conversationId, messageId, chunk }: { conversationId: string; messageId: string; chunk: string }) => {
      if (conversationId !== activeConversationId) return;
      streamingContentRef.current += chunk;
      setStreamingContent(streamingContentRef.current);
    };

    const onStreamEnd = ({ conversationId, messageId, fullContent }: { conversationId: string; messageId: string; fullContent: string }) => {
      if (conversationId !== activeConversationId) return;
      setIsStreaming(false);
      setStreamingMessageId(null);
      setStreamingContent('');
      streamingContentRef.current = '';

      // Replace placeholder assistant message with final content
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: fullContent, isStreaming: false }
            : m
        )
      );

      // Update conversation list (title may have changed, updatedAt changed)
      refreshConversations();
    };

    const onStreamError = ({ conversationId, messageId, error: errMsg }: { conversationId: string; messageId: string; error: string }) => {
      if (conversationId !== activeConversationId) return;
      setIsStreaming(false);
      setStreamingMessageId(null);
      setStreamingContent('');
      streamingContentRef.current = '';
      setError(errMsg);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: errMsg, isStreaming: false, isError: true }
            : m
        )
      );
    };

    socket.on('chat_stream_start', onStreamStart);
    socket.on('chat_stream_chunk', onStreamChunk);
    socket.on('chat_stream_end', onStreamEnd);
    socket.on('chat_stream_error', onStreamError);

    return () => {
      socket.off('chat_stream_start', onStreamStart);
      socket.off('chat_stream_chunk', onStreamChunk);
      socket.off('chat_stream_end', onStreamEnd);
      socket.off('chat_stream_error', onStreamError);
    };
  }, [socket, activeConversationId]);

  // ── Conversation management ───────────────────────────────────────────────

  const refreshConversations = useCallback(async () => {
    try {
      const convs = await chatApi.getConversations(token);
      setConversations(convs);
    } catch {
      // silently fail refresh
    }
  }, [token]);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const convs = await chatApi.getConversations(token);
      setConversations(convs);
    } catch (err: any) {
      setError('Failed to load conversations.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createConversation = useCallback(async () => {
    try {
      const conv = await chatApi.createConversation(token);
      setConversations((prev) => [conv, ...prev]);
      setActiveConversationId(conv.id);
      setMessages([]);
      setError(null);
      return conv;
    } catch (err: any) {
      setError('Failed to create conversation.');
      return null;
    }
  }, [token]);

  const selectConversation = useCallback(async (conversationId: string) => {
    if (conversationId === activeConversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { messages: msgs } = await chatApi.getConversation(token, conversationId);
      setMessages(msgs);
      setActiveConversationId(conversationId);
    } catch {
      setError('Failed to load conversation.');
    } finally {
      setIsLoading(false);
    }
  }, [token, activeConversationId]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await chatApi.deleteConversation(token, conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch {
      setError('Failed to delete conversation.');
    }
  }, [token, activeConversationId]);

  // ── Send message ──────────────────────────────────────────────────────────

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;
    setError(null);

    let convId = activeConversationId;

    // Auto-create conversation if none active
    if (!convId) {
      const conv = await createConversation();
      if (!conv) return;
      convId = conv.id;
    }

    try {
      const result = await chatApi.sendMessage(token, convId, content, socket?.id);

      // Add user message to local state immediately
      setMessages((prev) => [...prev, result.userMessage]);

      // Add streaming placeholder for assistant
      if (result.streaming) {
        setMessages((prev) => [
          ...prev,
          {
            id: result.assistantMessageId,
            conversationId: convId!,
            userId: user.id,
            role: 'assistant' as const,
            content: '',
            createdAt: new Date().toISOString(),
            isStreaming: true,
          },
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    }
  }, [token, socket, activeConversationId, isStreaming, user.id, createConversation]);

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    streamingMessageId,
    error,
    loadConversations,
    createConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    setError,
  };
}
