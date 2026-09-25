export function getTrackingToken(): string {
  try {
    const ls = localStorage.getItem("aq_tracking_token");
    if (ls) return ls;
  } catch {
    /* storage unavailable — fall back to cookie */
  }
  try {
    const match = document.cookie.match(/(?:^|;\s*)aq_t=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  } catch {
    /* malformed cookie */
  }
  return "";
}

export function clearTracking(): void {
  try {
    localStorage.removeItem("aq_tracking_token");
  } catch {
    /* storage unavailable */
  }
  try {
    document.cookie = "aq_t=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  } catch {
    /* cookie unavailable */
  }
}
