const Groq = require("groq-sdk");
const Chat = require("../models/chat");

// Groq is free — get your key at console.groq.com (no credit card needed)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// System prompt — shapes the AI's personality as a student tutor
const SYSTEM_PROMPT = `You are a friendly and patient AI student assistant. Your job is to help students understand topics clearly.

Follow these rules:
- Explain things in simple, easy-to-understand language
- Use examples and analogies to explain complex concepts
- If a student seems confused, try a different explanation approach
- Keep answers focused and not too long
- Encourage the student when they get things right
- If asked to solve homework directly, guide them step by step instead of just giving the answer
- Format your responses using markdown where it helps clarity (bullet points, code blocks, bold text)`;


// POST /api/chat  — send a message and get AI reply
const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    let chat;

    if (chatId) {
      // Continue an existing chat
      chat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else {
      // Start a brand-new chat and use the first message as the title
      chat = await Chat.create({
        user: req.user._id,
        title: message.slice(0, 50),
        messages: [],
      });
    }

    // Save the user's message to MongoDB
    chat.messages.push({ role: "user", content: message });

    // Build message history (last 20 messages) so the AI remembers context
    const history = chat.messages.slice(-20).map((msg) => ({
      role: msg.role,      // "user" or "assistant"
      content: msg.content,
    }));

    // Call the Groq API — llama-3.3-70b-versatile is free and very capable
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT }, // tutor personality
        ...history,                                  // full conversation so far
      ],
    });

    // Extract the AI's reply text
    const aiReply = response.choices[0].message.content;

    // Save the AI reply to MongoDB
    chat.messages.push({ role: "assistant", content: aiReply });
    await chat.save();

    res.json({
      chatId: chat._id,
      reply: aiReply,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chat  — get all chats for the logged-in user
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select("title createdAt updatedAt")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/chat/:id  — get one full chat with all messages
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/chat/:id  — delete a chat
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getAllChats, getChatById, deleteChat };