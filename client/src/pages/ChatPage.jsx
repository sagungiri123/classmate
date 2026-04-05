import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";
import { sendMessage as apiSendMessage, getAllChats, getChatById, deleteChat } from "../interceptor/chat";

// --- Helper Functions ---
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 1000 * 60 * 60) {
    const mins = Math.floor(diff / (1000 * 60));
    return `${mins}m ago`;
  } else if (diff < 1000 * 60 * 60 * 24) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h ago`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};

const truncate = (str, n) => (str?.length > n ? str.substr(0, n - 1) + "..." : str);

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// --- SVG Icons ---
const PencilIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const BookOpenIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A9 9 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A9 9 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const LightbulbIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
  </svg>
);

// --- Sub-Components ---

const Sidebar = ({ chats, activeChatId, onNewChat, onOpenChat, onDeleteChat, onLogout, user }) => {
  return (
    <aside className="w-72 h-full flex flex-col" style={{ background: "#F5F0E8", borderRight: "1px solid #E5DDD1" }}>
      {/* Logo / Brand */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center" style={{ 
            background: "#C17A5F", 
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(193, 122, 95, 0.3)"
          }}>
            <BookOpenIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg" style={{ 
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#2C2926"
            }}>
              Classmate
            </h1>
            <p className="text-xs" style={{ color: "#8A8580" }}>Your study companion</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-5 mb-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:shadow-md"
          style={{ 
            background: "#FFFFFF",
            border: "1px solid #E5DDD1",
            borderRadius: "10px",
            color: "#2C2926",
            boxShadow: "0 1px 3px rgba(44, 41, 38, 0.04)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#C17A5F";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E5DDD1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <PlusIcon className="w-4 h-4" style={{ color: "#C17A5F" }} />
          New Study Session
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-5 py-2">
        <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "#8A8580" }}>
          Recent Sessions
        </p>
        <div className="space-y-1">
          {chats.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: "#8A8580" }}>
              No sessions yet. Start one above!
            </p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => onOpenChat(chat._id)}
                className="group relative flex items-start gap-3 px-3 py-3 cursor-pointer transition-all duration-150"
                style={{
                  background: activeChatId === chat._id ? "#FFFFFF" : "transparent",
                  borderRadius: "8px",
                  borderLeft: activeChatId === chat._id ? "3px solid #C17A5F" : "3px solid transparent",
                  boxShadow: activeChatId === chat._id ? "0 1px 3px rgba(44, 41, 38, 0.06)" : "none"
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate font-medium" style={{ 
                    color: activeChatId === chat._id ? "#2C2926" : "#5A5652"
                  }}>
                    {truncate(chat.title, 32)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#8A8580" }}>
                    {formatDate(chat.updatedAt)}
                  </p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteChat(chat._id); }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 transition-all duration-150"
                  style={{ 
                    color: "#8A8580",
                    borderRadius: "6px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(193, 122, 95, 0.1)";
                    e.currentTarget.style.color = "#C17A5F";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#8A8580";
                  }}
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="px-5 py-4" style={{ borderTop: "1px solid #E5DDD1" }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 flex items-center justify-center text-sm font-semibold"
            style={{ 
              background: "#E8D5C4",
              color: "#8B5A3C",
              borderRadius: "50%"
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "#2C2926" }}>
              {user?.name || "Student"}
            </p>
            <p className="text-xs truncate" style={{ color: "#8A8580" }}>
              {user?.email || "Ready to learn"}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 transition-all duration-150"
            style={{ 
              color: "#8A8580",
              borderRadius: "8px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(193, 122, 95, 0.1)";
              e.currentTarget.style.color = "#C17A5F";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#8A8580";
            }}
            title="Logout"
          >
            <LogoutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

const MessageBubble = ({ message, user }) => {
  const isUser = message.role === "user";

  return (
    <div 
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      style={{ animation: "slideUp 0.35s ease-out forwards" }}
    >
      {/* Avatar */}
      <div 
        className="w-8 h-8 flex items-center justify-center text-xs font-semibold shrink-0"
        style={{
          background: isUser ? "#E8D5C4" : "#F5F0E8",
          color: isUser ? "#8B5A3C" : "#5A5652",
          borderRadius: "50%",
          border: isUser ? "none" : "1px solid #E5DDD1"
        }}
      >
        {isUser ? getInitials(user?.name) : "AI"}
      </div>

      {/* Message Card */}
      <div 
        className="max-w-[80%] px-5 py-4 text-sm leading-relaxed"
        style={{
          background: isUser ? "#FDF6ED" : "#FFFFFF",
          border: isUser ? "1px solid #E8D5C4" : "1px solid #E5DDD1",
          borderLeft: isUser ? "1px solid #E8D5C4" : "3px solid #C17A5F",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          boxShadow: isUser 
            ? "0 1px 3px rgba(193, 122, 95, 0.08), 0 2px 8px rgba(193, 122, 95, 0.06)"
            : "0 1px 3px rgba(44, 41, 38, 0.04), 0 2px 8px rgba(44, 41, 38, 0.04)",
          color: "#2C2926"
        }}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap" style={{ lineHeight: "1.7" }}>{message.content}</p>
        ) : (
          <div className="prose-study">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-1 py-2">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full"
        style={{
          background: "#C17A5F",
          opacity: 0.4,
          animation: `pulseDot 1.4s ease-in-out ${i * 0.2}s infinite`
        }}
      />
    ))}
    <style>{`
      @keyframes pulseDot {
        0%, 100% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
);

const WelcomeScreen = ({ onSuggestion }) => {
  const suggestions = [
    "Explain photosynthesis simply",
    "Help me understand derivatives",
    "What caused World War I?",
    "How does recursion work?",
  ];

  return (
    <div 
      className="flex flex-col items-center justify-center h-full px-8"
      style={{ animation: "fadeIn 0.5s ease-out" }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Doodle/Icon */}
      <div 
        className="w-20 h-20 flex items-center justify-center mb-6"
        style={{
          background: "#FDF6ED",
          borderRadius: "50%",
          border: "2px dashed #E8D5C4"
        }}
      >
        <LightbulbIcon className="w-9 h-9" style={{ color: "#C17A5F" }} />
      </div>

      <h2 
        className="text-2xl mb-2"
        style={{ 
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "#2C2926",
          fontWeight: 500
        }}
      >
        What shall we study today?
      </h2>
      <p 
        className="text-sm max-w-md text-center mb-8"
        style={{ color: "#5A5652", lineHeight: "1.7" }}
      >
        Ask me anything — concepts, problems, essays, code. 
        I will explain it clearly and help you actually understand it.
      </p>

      {/* Suggestion Cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestion(suggestion)}
            className="text-left px-4 py-3 text-sm transition-all duration-200"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5DDD1",
              borderRadius: "10px",
              color: "#5A5652",
              boxShadow: "0 1px 3px rgba(44, 41, 38, 0.03)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C17A5F";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(193, 122, 95, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5DDD1";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(44, 41, 38, 0.03)";
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

const MessageList = ({ messages, loading, user, onSuggestion }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0) {
    return <WelcomeScreen onSuggestion={onSuggestion} />;
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} user={user} />
      ))}

      {/* AI typing indicator */}
      {loading && (
        <div 
          className="flex gap-4"
          style={{ animation: "slideUp 0.35s ease-out forwards" }}
        >
          <div 
            className="w-8 h-8 flex items-center justify-center text-xs font-semibold shrink-0"
            style={{
              background: "#F5F0E8",
              color: "#5A5652",
              borderRadius: "50%",
              border: "1px solid #E5DDD1"
            }}
          >
            AI
          </div>
          <div 
            className="px-4 py-2"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5DDD1",
              borderLeft: "3px solid #C17A5F",
              borderRadius: "16px 16px 16px 4px",
              boxShadow: "0 1px 3px rgba(44, 41, 38, 0.04)"
            }}
          >
            <TypingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      setText(e.detail);
      textareaRef.current?.focus();
    };
    window.addEventListener("suggestion", handler);
    return () => window.removeEventListener("suggestion", handler);
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-6 pb-6 pt-3">
      <div className="max-w-3xl mx-auto">
        {/* Notepad-style input container */}
        <div 
          className="flex items-end gap-3 px-5 py-4 transition-all duration-200"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5DDD1",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(44, 41, 38, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)"
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here..."
            disabled={disabled}
            className="flex-1 bg-transparent text-sm outline-none resize-none max-h-32 disabled:opacity-50"
            style={{ 
              color: "#2C2926",
              lineHeight: "1.6",
              fontFamily: "'Nunito', system-ui, sans-serif"
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || disabled}
            className="shrink-0 w-10 h-10 flex items-center justify-center transition-all duration-200"
            style={{
              background: text.trim() && !disabled ? "#C17A5F" : "#E5DDD1",
              borderRadius: "10px",
              color: text.trim() && !disabled ? "#FFFFFF" : "#8A8580"
            }}
            onMouseEnter={(e) => {
              if (text.trim() && !disabled) {
                e.currentTarget.style.background = "#A5634A";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (text.trim() && !disabled) {
                e.currentTarget.style.background = "#C17A5F";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-xs mt-3" style={{ color: "#8A8580" }}>
          Press Enter to send, Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
};

// --- Main ChatPage Component ---

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setListLoading(true);
    try {
      const res = await getAllChats();
      setChats(res.data);
    } catch (err) {
      console.error("Failed to load chats:", err);
    } finally {
      setListLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const openChat = async (id) => {
    setActiveChatId(id);
    try {
      const res = await getChatById(id);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  };

  const removeChat = async (id) => {
    try {
      await deleteChat(id);
      setChats((prev) => prev.filter((c) => c._id !== id));
      if (activeChatId === id) startNewChat();
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await apiSendMessage({ chatId: activeChatId, message: text });
      const { chatId, reply } = res.data;

      // If this was a new chat, set the returned id and refresh sidebar
      if (!activeChatId) {
        setActiveChatId(chatId);
        await loadChats();
      }

      const aiMsg = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    window.dispatchEvent(new CustomEvent("suggestion", { detail: suggestion }));
  };

  const activeTitle = chats.find((c) => c._id === activeChatId)?.title || "";

  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ 
        background: "#FAF7F2",
        position: "relative"
      }}
    >
      {/* Paper Texture Overlay */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Sidebar */}
      <div className="relative z-10">
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onNewChat={startNewChat}
          onOpenChat={openChat}
          onDeleteChat={removeChat}
          onLogout={handleLogout}
          user={user}
        />
      </div>

      {/* Main Chat Area */}
      <main className="flex flex-col flex-1 min-w-0 relative z-10">
        {/* Header */}
        <header 
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ 
            background: "rgba(250, 247, 242, 0.8)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #E5DDD1"
          }}
        >
          <div className="flex items-center gap-3">
            <PencilIcon className="w-4 h-4" style={{ color: "#C17A5F" }} />
            <h2 
              className="text-base font-medium"
              style={{ 
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#2C2926"
              }}
            >
              {activeTitle || "New Study Session"}
            </h2>
          </div>

          <button
            onClick={startNewChat}
            className="flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200"
            style={{
              background: "transparent",
              border: "1px solid #E5DDD1",
              borderRadius: "8px",
              color: "#5A5652"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#C17A5F";
              e.currentTarget.style.color = "#C17A5F";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5DDD1";
              e.currentTarget.style.color = "#5A5652";
            }}
          >
            <PlusIcon className="w-4 h-4" />
            New Chat
          </button>
        </header>

        {/* Message List */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <MessageList 
            messages={messages} 
            loading={loading} 
            user={user}
            onSuggestion={handleSuggestion}
          />
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={loading} />
      </main>
    </div>
  );
};

export default ChatPage;