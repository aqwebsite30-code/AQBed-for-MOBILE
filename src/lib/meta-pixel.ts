declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

const VISITOR_ID_KEY = "aqbeds_vid";

/**
 * Get or create a stable visitor ID (UUID v4) stored in localStorage.
 * Used as external_id for cross-session user matching in CAPI.
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch {
    return "";
  }
}

/**
 * Read the _fbp cookie (Facebook Browser ID).
 * Set by the Meta Pixel base script on first visit.
 */
export function getFbp(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/_fbp=([^;]+)/);
  return match ? match[1] : "";
}

/**
 * Read the _fbc cookie (Facebook Click ID).
 * Set when a user arrives from a Facebook ad click.
 */
export function getFbc(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/_fbc=([^;]+)/);
  return match ? match[1] : "";
}

/**
 * Generate a unique event_id (UUID v4).
 */
export function generateEventId(): string {
  return crypto.randomUUID();
}

/**
 * Fire a Meta Pixel browser event WITHOUT deduplication (e.g. PageView, ViewContent).
 */
export function trackPixel(event: string, params?: Record<string, any>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

/**
 * Fire a Meta Pixel browser event WITH event_id for CAPI deduplication.
 * Returns the generated event_id so the caller can pass it to the server CAPI function.
 */
export function trackPixelWithId(event: string, params?: Record<string, any>): string {
  const event_id = generateEventId();
  if (typeof window === "undefined" || typeof window.fbq !== "function") return event_id;
  // Always pass an object (not undefined) so fbq reliably reads { eventID }.
  window.fbq("track", event, params ?? {}, { eventID: event_id });
  return event_id;
}

/**
 * Convenience: get all client-side tracking identifiers in one object.
 * Pass these to every CAPI server function for maximum EMQ.
 */
export function getClientTrackingData() {
  return {
    external_id: getVisitorId(),
    fbp: getFbp(),
    fbc: getFbc(),
  };
}
