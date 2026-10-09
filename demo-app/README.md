# ArenaOS Live Demo

The real Apple Esports ERP client (copied from `apple_apple_git/client`) running against an
in-browser fake backend, served at `/live-demo/` on the marketing site.

- `src/mock/seed.js` – branches, PCs, pricing, menu, members, demo users
- `src/mock/db.js` – in-memory store + seeded live state (active sessions, today's bills…)
- `src/mock/server.js` – axios adapter implementing the API routes the UI calls
- `src/contexts/SocketContext.jsx` – SignalR replaced by `src/mock/bus.js`
- `src/pages/public/LandingGatewayPage.jsx` – one-click role picker (no login)

Unmocked endpoints log `[demo] unmocked GET /path` in the console and return an empty result.
All state resets on page refresh.

```bash
npm run dev          # from ArenaOS root: starts the site (5173) and this demo (8081, proxied at /live-demo/)
npm run build        # builds site + demo into dist/live-demo
```
