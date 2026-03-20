import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingDots from "../ui/TypingDots";

const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-8 animate-fade-in">
    {/* Glowing orb */}
    <div className="relative mb-8">
      <div className="w-20 h-20 rounded-full bg-brand-600/20 border border-brand-500/30
                      flex items-center justify-center">
        <svg className="w-9 h-9 text-brand-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a5 5 0 015 5v1h1a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6a3 3 0 013-3h1V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v1h6V7a3 3 0 00-3-3zm6 7H6a1 1 0 00-1 1v6a1 1 0 001 1h12a1 1 0 001-1v-6a1 1 0 00-1-1zm-6 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
        </svg>
      </div>
      <div className="absolute inset-0 rounded-full bg-brand-500/10 blur-xl -z-10" />
    </div>

    <h2 className="font-display text-2xl font-semibold text-white mb-2">
      What do you want to learn?
    </h2>
    <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-8">
      Ask me anything — concepts, problems, essays, code. I'll explain it clearly and help you actually understand it.
    </p>

    {/* Suggestion chips */}
    <div className="grid grid-cols-2 gap-2 w-full max-w-md">
      {[
        "Explain photosynthesis simply",
        "Help me with quadratic equations",
        "What caused World War I?",
        "How does recursion work in code?",
      ].map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => {
            // Dispatch a custom event the ChatInput can listen to
            window.dispatchEvent(new CustomEvent("suggestion", { detail: suggestion }));
          }}
          className="text-left px-3 py-2.5 rounded-xl bg-surface-2 border border-white/5
                     hover:border-brand-500/40 hover:bg-brand-600/10 text-white/50
                     hover:text-white/80 text-xs transition-all duration-200"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
);

const MessageList = ({ messages, loading }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0) return <WelcomeScreen />;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}

      {/* AI typing indicator */}
      {loading && (
        <div className="flex gap-3 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-surface-3 border border-white/10
                          flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-brand-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a5 5 0 015 5v1h1a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6a3 3 0 013-3h1V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v1h6V7a3 3 0 00-3-3zm6 7H6a1 1 0 00-1 1v6a1 1 0 001 1h12a1 1 0 001-1v-6a1 1 0 00-1-1zm-6 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
            </svg>
          </div>
          <div className="bg-surface-2 border border-white/5 rounded-2xl rounded-tl-sm">
            <TypingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;