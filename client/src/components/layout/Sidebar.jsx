import { useAuth } from "../../context/AuthContext";
import { formatDate, truncate, getInitials } from "../../utils/helpers";
import Spinner from "../ui/Spinner";

const Sidebar = ({
  chats, activeChatId, listLoading,
  onNewChat, onOpenChat, onDeleteChat,
  onLogout,
}) => {
  const { user } = useAuth();

  return (
    <aside className="flex flex-col h-full w-64 bg-surface-1 border-r border-white/5">

      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-xs font-display font-bold">
            CM
          </div>
          <span className="font-display font-semibold text-sm text-white">
            Classmate
          </span>
        </div>
      </div>

      {/* New chat button */}
      <div className="px-3 pt-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                     border border-white/10 hover:border-brand-500/50 hover:bg-brand-600/10
                     text-white/60 hover:text-white text-sm transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </button>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {listLoading ? (
          <div className="flex justify-center pt-6">
            <Spinner size="sm" />
          </div>
        ) : chats.length === 0 ? (
          <p className="text-xs text-white/25 text-center pt-6 px-4 leading-relaxed">
            No chats yet. Start a new one above!
          </p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => onOpenChat(chat._id)}
              className={`group relative flex items-start gap-2 px-3 py-2.5 rounded-xl cursor-pointer
                          transition-all duration-150
                          ${activeChatId === chat._id
                            ? "bg-brand-600/20 border border-brand-500/30"
                            : "hover:bg-white/5 border border-transparent"
                          }`}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${activeChatId === chat._id ? "text-white" : "text-white/60"}`}>
                  {truncate(chat.title, 30)}
                </p>
                <p className="text-xs text-white/25 mt-0.5">
                  {formatDate(chat.updatedAt)}
                </p>
              </div>

              {/* Delete button (visible on hover) */}
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/20
                           hover:text-red-400 text-white/30 transition-all duration-150 shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* User profile + logout */}
      <div className="px-3 pb-4 pt-2 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-semibold text-brand-200 shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{user?.name}</p>
            <p className="text-xs text-white/30 truncate">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/70 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;