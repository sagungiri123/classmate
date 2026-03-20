import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import Sidebar from "../components/layout/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const {
    chats, activeChatId, messages, loading, listLoading,
    loadChats, openChat, startNewChat, send, removeChat,
  } = useChat();

  // Load sidebar chat list on mount
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Find the title of the active chat for the header
  const activeTitle = chats.find((c) => c._id === activeChatId)?.title || "";

  return (
    <div className="flex h-screen bg-surface overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        listLoading={listLoading}
        onNewChat={startNewChat}
        onOpenChat={openChat}
        onDeleteChat={removeChat}
        onLogout={handleLogout}
      />

      {/* Main chat area */}
      <main className="flex flex-col flex-1 min-w-0">
        <ChatHeader title={activeTitle} onNewChat={startNewChat} />

        {/* Message list grows to fill space */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <MessageList messages={messages} loading={loading} />
        </div>

        <ChatInput onSend={send} disabled={loading} />
      </main>
    </div>
  );
};

export default ChatPage;