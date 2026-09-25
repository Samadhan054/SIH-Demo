import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Clear unread badge when opened
  useEffect(() => {
    if (isOpen) setHasNewMessage(false);
  }, [isOpen]);

  return (
    <>
      {/* Floating Chat Window */}
      {isOpen && (
        <>
          {/* Mobile: full-screen overlay */}
          <div className="fixed inset-0 z-50 sm:hidden bg-white">
            <ChatWindow onClose={() => setIsOpen(false)} />
          </div>

          {/* Desktop: floating panel */}
          <div
            className="hidden sm:flex fixed bottom-24 right-6 z-50 flex-col"
            style={{ width: '400px', height: '580px' }}
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-800 rotate-0'
            : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
        }`}
        title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}

        {/* Unread badge */}
        {!isOpen && hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}

        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20 pointer-events-none" />
        )}
      </button>

      {/* Click-outside to close (desktop) */}
      {isOpen && (
        <div
          className="hidden sm:block fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
