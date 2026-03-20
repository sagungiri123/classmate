import { useState, useRef, useEffect } from "react";

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText]   = useState("");
  const textareaRef       = useRef(null);

  // Listen for suggestion chip clicks from WelcomeScreen
  useEffect(() => {
    const handler = (e) => {
      setText(e.detail);
      textareaRef.current?.focus();
    };
    window.addEventListener("suggestion", handler);
    return () => window.removeEventListener("suggestion", handler);
  }, []);

  // Auto-resize textarea as user types
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    // Send on Enter (but not Shift+Enter — that adds a newline)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-5 pt-3 border-t border-white/5 bg-surface/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-surface-2 border border-white/10 rounded-2xl px-4 py-3
                        focus-within:border-brand-500/50 focus-within:ring-1 focus-within:ring-brand-500/20
                        transition-all duration-200">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (Enter to send, Shift+Enter for newline)"
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none
                       resize-none max-h-40 leading-relaxed disabled:opacity-40"
          />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || disabled}
            className="shrink-0 w-8 h-8 rounded-xl bg-brand-600 hover:bg-brand-500
                       disabled:opacity-30 disabled:cursor-not-allowed
                       flex items-center justify-center transition-all duration-200 active:scale-90"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>

        <p className="text-center text-xs text-white/15 mt-2">
          Review the answers properly, don't just copy paste.
          @2026 Classmate AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;