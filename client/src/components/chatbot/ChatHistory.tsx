import React from 'react';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { Conversation } from '../../types/chat';

interface Props {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export const ChatHistory: React.FC<Props> = ({
  conversations,
  activeConversationId,
  onSelect,
  onNew,
  onDelete,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
      {/* Header */}
      <div className="px-3 py-3 border-b border-slate-200">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-colors ${
                conv.id === activeConversationId
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-white hover:border hover:border-slate-200 border border-transparent'
              }`}
              onClick={() => onSelect(conv.id)}
            >
              <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${conv.id === activeConversationId ? 'text-blue-600' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${conv.id === activeConversationId ? 'text-blue-700' : 'text-slate-700'}`}>
                  {conv.title}
                </p>
                <p className="text-[10px] text-slate-400">{relativeTime(conv.updatedAt)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                title="Delete conversation"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
