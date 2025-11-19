import { connectDB, Message } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { user, chat, message } = req.body;

  if (!message) return res.status(400).json({ error: "Message required" });
  if (!chat) return res.status(400).json({ error: "Chat required" });
  if (!user) return res.status(400).json({ error: "User required" });

  await connectDB();
  const msg = await Message.create({ chat, user, message });

  res.status(201).json(msg);
}
