export function logEvent(eventType: string, payload?: Record<string, unknown>) {
  console.log(`[EVENT] ${eventType}`, payload);
}
