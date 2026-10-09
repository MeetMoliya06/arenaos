// Tiny in-browser stand-in for the SignalR hubs: the fake backend emits, pages subscribe.
const handlers = new Map(); // `${hub}:${event}` -> Set<fn>

export const bus = {
  on(hub, event, fn) {
    const k = `${hub}:${event}`;
    if (!handlers.has(k)) handlers.set(k, new Set());
    handlers.get(k).add(fn);
    return () => handlers.get(k)?.delete(fn);
  },
  emit(hub, event, payload = {}) {
    const args = [payload];
    // Async, like a real push — avoids re-entering a React render that triggered the write.
    setTimeout(() => handlers.get(`${hub}:${event}`)?.forEach((fn) => { try { fn(...args); } catch (e) { console.error(e); } }), 50);
  },
};
