import React, { useEffect, useRef, useState } from 'react';
import { X, Plus, ChevronLeft, ChevronRight, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHistory } from './ChatHistory';
import { useChat } from '../../hooks/useChat';
import { useSocket } from '../../context/SocketContext';

// Suggested starter prompts shown in empty state
const SUGGESTED_PROMPTS = [
  'Explain this dashboard',
  'What is flash flood risk?',
  'How do I send an emergency SOS?',
  'Help me understand the hazard map',
];

interface Props {
  onClose: () => void;
}

export const ChatWindow: React.FC<Props> = ({ onClose }) => {
  const { isConnected } = useSocket();
  const {
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
  } = useChat();

  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConv = conversations.find((c) => c.id === activeConversationId);

  // Load conversations on open
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Auto-scroll to bottom on new messages or streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSend = (content: string) => {
    setError(null);
    sendMessage(content);
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleRetry = (messageContent: string) => {
    sendMessage(messageContent);
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden w-full h-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white shrink-0">
        {/* History toggle */}
        <button
          onClick={() => setShowHistory((s) => !s)}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          title="Toggle history"
        >
          {showHistory ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <div>
              <p className="text-sm font-bold leading-none">FloodGuard AI</p>
              <div className="flex items-center gap-1 mt-0.5">
                {isConnected ? (
                  <>
                    <Wifi className="w-2.5 h-2.5 text-emerald-300" />
                    <span className="text-[10px] text-emerald-200">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-2.5 h-2.5 text-red-300" />
                    <span className="text-[10px] text-red-200">Reconnecting…</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {activeConv && (
          <p className="text-[10px] text-blue-200 truncate max-w-[100px] hidden sm:block">{activeConv.title}</p>
        )}

        <button
          onClick={createConversation}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          title="New conversation"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* History sidebar */}
        {showHistory && (
          <div className="w-52 shrink-0 overflow-hidden border-r border-slate-200">
            <ChatHistory
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelect={(id) => { selectConversation(id); setShowHistory(false); }}
              onNew={() => { createConversation(); setShowHistory(false); }}
              onDelete={deleteConversation}
            />
          </div>
        )}

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0">

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className="ml-2 text-xs underline hover:no-underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && messages.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty state — no conversation or no messages */}
            {!isLoading && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-white text-xl font-black">AI</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">How can I help?</h3>
                <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                  Ask me anything about flood risk, emergency procedures, or how to use this platform.
                </p>
                <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handlePromptClick(prompt)}
                      className="text-xs text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-xl px-3 py-2.5 transition-all leading-tight font-medium"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                streamingContent={msg.id === streamingMessageId ? streamingContent : undefined}
                onRetry={msg.isError ? () => handleRetry(msg.content) : undefined}
              />
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Disclaimer */}
          <p className="text-[9px] text-slate-400 text-center py-1 px-4 border-t border-slate-100 bg-white">
            AI responses are advisory only. In emergencies, call <strong>112</strong>.
          </p>

          {/* Input */}
          <ChatInput
            onSend={handleSend}
            isStreaming={isStreaming}
            disabled={!isConnected}
          />
        </div>
      </div>
    </div>
  );
};
