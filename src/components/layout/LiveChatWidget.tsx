import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "@/lib/chat";
import { getChatMessages } from "@/lib/chat";

// Generate or retrieve a persistent session ID for this browser
function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem("aq_chat_session");
  if (!id) {
    id = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("aq_chat_session", id);
  }
  return id;
}

interface Message {
  id: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
}

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId] = useState(getSessionId);
  const [unread, setUnread] = useState(0);

  if (typeof window !== "undefined") {
    const now = performance.now();
    console.log(`[AQ-DEBUG] LiveChatWidget Rendered at: ${now.toFixed(2)}ms`);
  }

  useEffect(() => {
    const now = performance.now();
    console.log(`[AQ-DEBUG] LiveChatWidget Mounted at: ${now.toFixed(2)}ms`);
  }, []);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    // BUG 2 FIX: Prevent background scrolls if window is already at top or widget is hidden
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const fetchMessages = useCallback(async () => {
    try {
      // @ts-ignore
      const res = await getChatMessages({ data: { sessionId } });
      if (res?.success && res.messages) {
        // @ts-ignore - Handle date to string conversion if needed
        const newMsgs = res.messages as any[];
        setMessages((prev) => {
          const prevLen = prev.length;
          const adminNewMsgs = newMsgs.slice(prevLen).filter((m) => m.isAdmin);
          if (!open && adminNewMsgs.length > 0) {
            setUnread((u) => u + adminNewMsgs.length);
          }
          return newMsgs;
        });
      }
    } catch (_) {}
  }, [sessionId, open]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(scrollToBottom, 100);
    }
  }, [open, messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);

    // Optimistic update
    const tempMsg: Message = {
      id: "temp_" + Date.now(),
      content: text,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(scrollToBottom, 50);

    try {
      // @ts-ignore
      await sendChatMessage({ data: { sessionId, content: text, isAdmin: false } });
      await fetchMessages();
    } catch (_) {}
    setSending(false);
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chat-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(true)}
            aria-label="Open live chat"
            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 h-14 w-14 rounded-full bg-brand text-white shadow-[0_8px_32px_rgba(11,60,93,0.45)] flex items-center justify-center"
          >
            <MessageCircle className="h-6 w-6" />
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                {unread}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-[380px] rounded-3xl overflow-hidden shadow-2xl shadow-black/30 flex flex-col"
            style={{
              height: "520px",
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-brand text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/20 grid place-items-center font-black text-sm">
                  AQ
                </div>
                <div>
                  <p className="font-bold text-sm leading-none">AQ Beds Support</p>
                  <p className="text-[11px] text-white/70 mt-0.5">We usually reply in minutes</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="min-h-[44px] min-w-[44px] rounded-full bg-white/10 hover:bg-white/20 transition-colors grid place-items-center"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
              {isEmpty && (
                <div className="text-center pt-8 pb-4">
                  <div className="h-14 w-14 rounded-full bg-brand/10 grid place-items-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-brand" />
                  </div>
                  <p className="font-bold text-sm">Chat with us!</p>
                  <p className="text-muted-foreground text-xs mt-1 max-w-[200px] mx-auto">
                    Ask us anything about our beds, sizes, delivery, or orders.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.isAdmin
                        ? "bg-muted text-foreground rounded-tl-sm"
                        : "bg-brand text-white rounded-tr-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-3 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 h-10 px-4 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="min-h-[44px] min-w-[44px] rounded-full bg-brand text-white grid place-items-center disabled:opacity-40 hover:bg-brand/90 active:scale-90 transition-all flex-shrink-0"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
