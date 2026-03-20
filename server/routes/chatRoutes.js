const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllChats,
  getChatById,
  deleteChat,
} = require("../controllers/chatController");
const { authMiddleware } = require("../middleware/authMiddleware");

// All chat routes are protected — user must be logged in
router.use(authMiddleware);

router.post("/", sendMessage);          // send a message
router.get("/", getAllChats);           // get all chats (sidebar list)
router.get("/:id", getChatById);        // get one chat with messages
router.delete("/:id", deleteChat);      // delete a chat

module.exports = router;