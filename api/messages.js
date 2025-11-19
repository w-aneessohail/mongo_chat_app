import { connectDB, User, Message, Chat } from "./_db.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { userId, chatName } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      if (!chatName) {
        return res.status(400).json({ error: "Chat name is required" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const chat = await Chat.create({ name: chatName });
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const { chatId } = req.query;

      if (!chatId) {
        return res.status(400).json({ error: "Chat ID is required" });
      }

      const messages = await Message.find({ chat: chatId })
        .populate("user", "name")
        .sort({ createdAt: 1 });

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
