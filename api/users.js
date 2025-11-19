import { connectDB, User } from "./_db.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const users = await User.find().select("_id name createdAt");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      const user = await User.create({ name });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
