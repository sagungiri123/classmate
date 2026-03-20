import ReactMarkdown from "react-markdown";
import { getInitials } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : "flex-row"}`}>

      {/* Avatar */}
      {isUser ? (
        <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center
                        text-xs font-semibold text-brand-200 shrink-0 mt-1">
          {getInitials(user?.name)}
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-surface-3 border border-white/10
                        flex items-center justify-center shrink-0 mt-1">
          <svg className="w-4 h-4 text-brand-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a5 5 0 015 5v1h1a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6a3 3 0 013-3h1V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v1h6V7a3 3 0 00-3-3zm6 7H6a1 1 0 00-1 1v6a1 1 0 001 1h12a1 1 0 001-1v-6a1 1 0 00-1-1zm-6 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
        ${isUser
          ? "bg-brand-600 text-white rounded-tr-sm"
          : "bg-surface-2 border border-white/5 text-white/85 rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-ai">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;