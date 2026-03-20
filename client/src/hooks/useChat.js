import { useState, useCallback } from "react";
import { sendMessage, getAllChats, getChatById, deleteChat } from "../interceptor/chat";

export const useChat = () => {
  const [chats, setChats]           = useState([]);   // sidebar list
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages]     = useState([]);   // current chat messages
  const [loading, setLoading]       = useState(false); // AI is thinking
  const [listLoading, setListLoading] = useState(false);

  // Load sidebar list
  const loadChats = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await getAllChats();
      setChats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  }, []);

  // Open an existing chat
  const openChat = useCallback(async (id) => {
    setActiveChatId(id);
    try {
      const res = await getChatById(id);
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Start a brand-new chat
  const startNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
  }, []);

  // Send a message — optimistically add user bubble then wait for AI
  const send = useCallback(
    async (text) => {
      if (!text.trim()) return;

      const userMsg = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const res = await sendMessage({ chatId: activeChatId, message: text });
        const { chatId, reply } = res.data;

        // If this was a new chat, set the returned id
        if (!activeChatId) {
          setActiveChatId(chatId);
          await loadChats(); // refresh sidebar so the new title appears
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
    },
    [activeChatId, loadChats]
  );

  // Delete a chat from the sidebar
  const removeChat = useCallback(
    async (id) => {
      try {
        await deleteChat(id);
        setChats((prev) => prev.filter((c) => c._id !== id));
        if (activeChatId === id) startNewChat();
      } catch (err) {
        console.error(err);
      }
    },
    [activeChatId, startNewChat]
  );

  return {
    chats, activeChatId, messages, loading, listLoading,
    loadChats, openChat, startNewChat, send, removeChat,
  };
};