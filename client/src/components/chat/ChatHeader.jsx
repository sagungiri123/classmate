const ChatHeader = ({ title, onNewChat }) => (
  <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 shrink-0">
    <div className="flex items-center gap-3">
      {/* Status dot */}
      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
      <h1 className="font-display text-sm font-semibold text-white/80 truncate max-w-xs">
        {title || "New chat"}
      </h1>
    </div>

    <button
      onClick={onNewChat}
      className="btn-ghost flex items-center gap-1.5 text-xs"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      New chat
    </button>
  </header>
);

export default ChatHeader;