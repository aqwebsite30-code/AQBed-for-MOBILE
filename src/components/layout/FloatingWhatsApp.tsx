import { buildWhatsAppUrl } from "@/lib/utils/format";

export function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppUrl("Hello AQ Beds, I have a question.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="floating-wa-btn fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-30 h-14 w-14 rounded-full bg-whatsapp text-whatsapp-foreground grid place-items-center shadow-luxury hover:scale-105 transition"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M20.52 3.48A11.93 11.93 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.86 11.86 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44ZM12.05 21.5h-.01a9.66 9.66 0 0 1-4.93-1.35l-.35-.21-3.8 1 1.01-3.7-.23-.38a9.65 9.65 0 1 1 17.94-5.02 9.66 9.66 0 0 1-9.63 9.66Zm5.52-7.23c-.3-.15-1.79-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.36.22-.66.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.36.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.53.07-.81.38-.28.3-1.07 1.05-1.07 2.55s1.1 2.97 1.25 3.17c.15.2 2.16 3.3 5.23 4.62.73.31 1.3.5 1.74.64.73.23 1.4.2 1.92.12.59-.09 1.79-.73 2.05-1.43.26-.7.26-1.3.18-1.42-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
