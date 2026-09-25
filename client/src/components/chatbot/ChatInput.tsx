import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSend: (content: string) => void;
  isStreaming: boolean;
  disabled?: boolean;
}

const MAX_LENGTH = 2000;

export const ChatInput: React.FC<Props> = ({ onSend, isStreaming, disabled }) => {
  const [value, setValue] = React.useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isStreaming && !disabled;
  const isOverLimit = value.length > MAX_LENGTH;

  return (
    <div className="border-t border-slate-200 bg-white px-3 py-3">
      <div className={`flex items-end gap-2 bg-slate-50 border rounded-xl px-3 py-2 transition-colors ${
        isOverLimit ? 'border-red-300' : 'border-slate-200 focus-within:border-blue-300'
      }`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? 'AI is responding…' : 'Ask about flood risk, safety, or this platform…'}
          disabled={isStreaming || disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none min-h-[24px] max-h-[120px] disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!canSend || isOverLimit}
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            canSend && !isOverLimit
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          title="Send (Enter)"
        >
          {isStreaming ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <div className="flex justify-between items-center mt-1 px-1">
        <p className="text-[9px] text-slate-400">Enter to send · Shift+Enter for new line</p>
        <p className={`text-[9px] ${isOverLimit ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
          {value.length}/{MAX_LENGTH}
        </p>
      </div>
    </div>
  );
};
