import { connectDB, User, Chat } from "./_db.js";

export default async function handler(req, res) {
  await connectDB();
  const chats = await Chat.find();
  res.status(200).json(chats);
}
