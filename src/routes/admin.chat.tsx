import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Loader2,
  RefreshCw,
  Circle,
  Clock,
  User,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { db } from "@/lib/db";
import { z } from "zod";

// ── Server Functions ────────────────────────────────────────────────────────
const getAllSessions = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sessions = await db.chatMessage.groupBy({
      by: ["sessionId"],
      _count: { sessionId: true },
      _max: { createdAt: true },
    });
    const details = await Promise.all(
      sessions.map(async (s) => {
        const lastMsg = await db.chatMessage.findFirst({
          where: { sessionId: s.sessionId },
          orderBy: { createdAt: "desc" },
        });
        const unread = await db.chatMessage.count({
          where: { sessionId: s.sessionId, isUser: true, isAdmin: false },
        });
        return {
          sessionId: s.sessionId,
          lastMessage: lastMsg?.content ?? "",
          lastIsUser: lastMsg?.isUser ?? true,
          updatedAt: s._max.createdAt?.toISOString() ?? "",
          count: s._count.sessionId,
          unread,
        };
      }),
    );
    return {
      success: true,
      sessions: details.sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1)),
    };
  } catch (err) {
    return { success: false, sessions: [] };
  }
});

const getSessionMessages = createServerFn({ method: "GET" }).handler(
  async ({ data }: { data: any }) => {
    try {
      const { sessionId } = z.object({ sessionId: z.string() }).parse(data);
      const messages = await db.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
      });
      return { success: true, messages };
    } catch (err) {
      return { success: false, messages: [] };
    }
  },
);

const replyAsAdmin = createServerFn({ method: "POST" }).handler(async ({ data }: { data: any }) => {
  try {
    const { sessionId, content } = z
      .object({ sessionId: z.string(), content: z.string() })
      .parse(data);
    const msg = await db.chatMessage.create({
      data: { sessionId, content, isAdmin: true, isUser: false },
    });
    return { success: true, message: msg };
  } catch (err) {
    return { success: false };
  }
});

// ── Route ───────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/admin/chat")({
  loader: () => getAllSessions(),
  component: AdminChat,
});

interface Session {
  sessionId: string;
  lastMessage: string;
  lastIsUser: boolean;
  updatedAt: string;
  count: number;
  unread: number;
}

interface Message {
  id: string;
  sessionId: string;
  content: string;
  isUser: boolean;
  isAdmin: boolean;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

function AdminChat() {
  const initial = Route.useLoaderData();
  const [sessions, setSessions] = useState<Session[]>((initial?.sessions as Session[]) ?? []);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSessions, setShowSessions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshSessions = useCallback(async () => {
    setRefreshing(true);
    try {
      // @ts-ignore
      const res = await getAllSessions();
      if (res?.success) setSessions(res.sessions as Session[]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadMessages = useCallback(async (sid: string) => {
    setLoadingMsgs(true);
    try {
      // @ts-ignore
      const res = await getSessionMessages({ data: { sessionId: sid } });
      if (res?.success) setMessages(res.messages as Message[]);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  // Poll active session messages every 4s
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (activeSession) {
      pollRef.current = setInterval(() => loadMessages(activeSession), 4000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeSession, loadMessages]);

  // Auto-refresh session list every 10s
  useEffect(() => {
    const t = setInterval(refreshSessions, 10000);
    return () => clearInterval(t);
  }, [refreshSessions]);

  const selectSession = async (sid: string) => {
    setActiveSession(sid);
    setMessages([]);
    setShowSessions(false);
    await loadMessages(sid);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!reply.trim() || !activeSession || sending) return;
    const text = reply.trim();
    setReply("");
    setSending(true);

    // Optimistic
    const temp: Message = {
      id: "tmp_" + Date.now(),
      sessionId: activeSession,
      content: text,
      isUser: false,
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, temp]);

    try {
      // @ts-ignore
      await replyAsAdmin({ data: { sessionId: activeSession, content: text } });
      await loadMessages(activeSession);
    } finally {
      setSending(false);
    }
  };

  const activeSessionData = sessions.find((s) => s.sessionId === activeSession);

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* ── Sessions Sidebar ── */}
      <aside className={`w-80 flex-shrink-0 border-r border-white/[0.06] flex flex-col ${showSessions ? "flex" : "hidden"} md:flex`}>
        <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white">Live Chat</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {sessions.length} conversation{sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={refreshSessions}
            className="h-8 w-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] grid place-items-center transition-colors"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-gray-400 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Customers will appear here when they start chatting</p>
            </div>
          ) : (
            sessions.map((s) => (
              <button
                key={s.sessionId}
                onClick={() => selectSession(s.sessionId)}
                className={`w-full text-left px-5 py-4 border-b border-white/[0.04] transition-all hover:bg-white/[0.04] ${
                  activeSession === s.sessionId ? "bg-blue-500/10 border-l-2 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 grid place-items-center text-xs font-bold flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white/80 truncate">
                        Customer #{s.sessionId.slice(-6)}
                      </p>
                      <p
                        className={`text-xs truncate mt-0.5 ${s.lastIsUser ? "text-white/50" : "text-blue-400/80"}`}
                      >
                        {s.lastIsUser ? "" : "You: "}
                        {s.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] text-gray-600">{timeAgo(s.updatedAt)}</span>
                    {s.unread > 0 && (
                      <span className="h-4.5 min-w-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                        {s.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ── Mobile chat toggle ── */}
      {!activeSession && !showSessions && (
        <div className="md:hidden fixed bottom-6 right-6 z-30">
          <button
            onClick={() => setShowSessions(true)}
            className="w-12 h-12 rounded-full bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ── Chat Area ── */}
      <div className={`flex-1 flex flex-col min-w-0 ${activeSession && !showSessions ? "flex" : "hidden"} md:flex`}>
        {!activeSession ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center px-8">
            <div className="h-16 w-16 rounded-2xl bg-white/[0.04] grid place-items-center mb-2">
              <MessageCircle className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-white">Select a conversation</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Choose a customer conversation from the sidebar to view messages and reply.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex-shrink-0 px-4 md:px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-gray-950/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSessions(true)}
                  className="md:hidden w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 grid place-items-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Customer #{activeSession.slice(-6)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                    <p className="text-[11px] text-gray-500">
                      Active session · {messages.length} messages
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {loadingMsgs && messages.length === 0 ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-[70%] ${msg.isAdmin ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`h-6 w-6 rounded-full flex-shrink-0 grid place-items-center text-[10px] font-bold ${msg.isAdmin ? "bg-blue-600" : "bg-gray-700"}`}
                        >
                          {msg.isAdmin ? "A" : "C"}
                        </div>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.isAdmin
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-white/[0.07] text-white/90 rounded-bl-sm"
                          }`}
                        >
                          {msg.content}
                          <div
                            className={`text-[10px] mt-1 ${msg.isAdmin ? "text-white/50" : "text-gray-600"}`}
                          >
                            {timeAgo(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Reply Input */}
            <div className="flex-shrink-0 px-4 py-4 border-t border-white/[0.06]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-3"
              >
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply…"
                  className="flex-1 h-11 px-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!reply.trim() || sending}
                  className="h-11 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
              <p className="text-[10px] text-gray-700 mt-2 text-center">
                Customer will see your reply in real time
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
