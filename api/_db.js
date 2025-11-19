"use server";
/* global process */

import mongoose from "mongoose";

let conn = null;

export async function connectDB() {
  if (conn) return conn;

  console.log(
    "[v0] Attempting to connect with MONGO_URI:",
    process.env.MONGO_URI ? "loaded" : "undefined"
  );

  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI environment variable is not defined. Check your Vercel environment variables or .env.local file."
    );
  }

  try {
    conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("[v0] MongoDB connected successfully");
    return conn;
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error.message);
    throw error;
  }
}

const UserSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});

const MessageSchema = new mongoose.Schema({
  message: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

export const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
