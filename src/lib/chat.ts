import { createServerFn } from "@tanstack/react-start";
import { db } from "./db";
import { z } from "zod";
import { sendChatNotification } from "./email";

const messageSchema = z.object({
  sessionId: z.string(),
  content: z.string(),
  isAdmin: z.boolean().optional(),
});

// 1. Send Message
export const sendChatMessage = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { sessionId, content, isAdmin = false } = messageSchema.parse(data);

      const msg = await db.chatMessage.create({
        data: {
          sessionId,
          content,
          isAdmin,
          isUser: !isAdmin,
        },
      });

      if (!isAdmin) {
        await sendChatNotification(sessionId, content);
      }

      return { success: true, message: msg };
    } catch (err) {
      console.error("Chat send failed", err);
      return { success: false, error: "Failed to send message" };
    }
  },
);

// 2. Get Messages for a Session
export const getChatMessages = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { sessionId } = z.object({ sessionId: z.string() }).parse(data);
      const messages = await db.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
      });
      return { success: true, messages };
    } catch (err) {
      return { success: false, error: "Failed to fetch messages" };
    }
  },
);

// 3. Get All Active Chat Sessions (Admin only)
export const getAllChatSessions = createServerFn({ method: "GET" }).handler(async () => {
  try {
    // Group by sessionId to get unique chats
    const sessions = await db.chatMessage.groupBy({
      by: ["sessionId"],
      _count: { sessionId: true },
      _max: { createdAt: true },
    });

    // Get the last message for each session to show as snippet
    const sessionsWithDetails = await Promise.all(
      sessions.map(async (s) => {
        const lastMsg = await db.chatMessage.findFirst({
          where: { sessionId: s.sessionId },
          orderBy: { createdAt: "desc" },
        });
        return {
          sessionId: s.sessionId,
          lastMessage: lastMsg?.content || "",
          updatedAt: s._max.createdAt,
          count: s._count.sessionId,
        };
      }),
    );

    return {
      success: true,
      sessions: sessionsWithDetails.sort(
        (a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0),
      ),
    };
  } catch (err) {
    console.error("Failed to get chat sessions", err);
    return { success: false, error: "Failed to fetch sessions" };
  }
});
