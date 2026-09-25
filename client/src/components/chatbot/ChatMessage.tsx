import React, { useState } from 'react';
import { Copy, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/chat';

interface Props {
  message: ChatMessageType;
  streamingContent?: string;
  onRetry?: () => void;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/** Very lightweight markdown renderer — no external dependency needed */
function renderMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="bg-slate-900 text-emerald-400 rounded-lg p-3 text-xs overflow-x-auto my-2 font-mono"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-blue-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>')
    // Bullet lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="my-1 space-y-0.5">$&</ul>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="font-bold text-slate-900 text-sm mt-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-bold text-slate-900 mt-2">$1</h2>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br/>');
}

export const ChatMessage: React.FC<Props> = ({ message, streamingContent, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const content = message.isStreaming ? (streamingContent || '') : message.content;
  const isEmpty = message.isStreaming && !streamingContent;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%]">
          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm text-sm leading-relaxed">
            {content}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 text-right">{formatTime(message.createdAt)}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex items-start gap-2.5 mb-4 group">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <span className="text-white text-xs font-bold">AI</span>
      </div>
      <div className="flex-1 max-w-[85%]">
        {message.isError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex items-start gap-2 text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{content || 'An error occurred. Please try again.'}</span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            )}
          </div>
        ) : isEmpty ? (
          <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm text-slate-800 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: '<p class="mb-2">' + renderMarkdown(content) + '</p>' }}
            />
            {!message.isStreaming && content && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                title="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        )}
        {!message.isStreaming && (
          <p className="text-[10px] text-slate-400 mt-1 ml-1">{formatTime(message.createdAt)}</p>
        )}
      </div>
    </div>
  );
};
