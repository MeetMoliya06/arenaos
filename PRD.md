# PRD: ArenaOS Website Revision 1

Product: Apple Esports ERP marketing website (React 19 + Vite)
Status: Draft, waiting for approval
Date: 2026-09-25

## 1. Goal
Make the site simpler and more honest. It should use plain words, show the real Surat branches, and show no prices. Pricing is discussed in the deal.

## 2. Requirements

| # | Change | Details | Files |
|---|--------|---------|-------|
| R1 | Simpler button names | "Book a fleet audit" becomes **"Get a demo"**. "Calculate leakage" becomes **"See features"** and scrolls to the product section. Footer "Review financial audit" becomes "See problems we solve". | Hero, Footer |
| R2 | Replace the word "rigs" | Use **"PCs"** everywhere ("Rig 09" becomes "PC 09"; "Sim Rigs" becomes "Sim PCs"). | Hero, DeploymentCTA, FnB, MultiBranch, Footer, ProblemFraming |
| R3 | Remove all prices | No ₹ amounts and no rates anywhere. This covers wallet top-up packs, menu prices, hourly rates, receipts, EOD cash totals, branch revenue, and monthly volume. The interactive demos stay, but show items, status and counts instead of money. | CashRegister, EODAudit, FnB, Wallet, MultiBranch, ProductWalkthrough |
| R4 | Remove the live revenue leakage calculator | Delete the calculator panel. Keep the 3 "Leak 01/02/03" pain-point cards, laid out full width. Remove the "18% of revenue" claim, since it is a figure with no source. | ProblemFraming |
| R5 | Real branches | Show **Adajan, Katargam, Citylight and Varachha, Surat** in the hero ticker, footer and multi-branch demo. This replaces the fake Bengaluru, Mumbai and Delhi branches. | Hero, Footer, MultiBranch |
| R6 | Remove "Live network proof" | Delete the whole section, its counters, and the "Telemetry" nav link. | LiveProof (deleted), App, Navbar |
| R7 | Role rename | In the Zero-Trust Permission Scopes section, "Branch manager" becomes **"Admin"**. | RbacMatrix |
| R8 | Simpler submit button plus notification | "Dispatch deployment application" becomes **"Send request"**. Clicking it shows an on-screen success notification (toast) and the existing confirmation panel. | DeploymentCTA |
| R9 | Fix the "AI-generated" look | See section 3a. | All components, tailwind config |

### 3a. Design fix (R9)
Why it reads as AI-made today: every section has the same layout (small tag, big headline, grey paragraph, rounded card grid); everything is dark grey with one lime accent and thin borders; there is one font (Inter) and no real photos; the copy is buzzword-heavy ("zero-trust", "sub-millisecond", "ring-0 kernel lock"); and the numbers are fake-precise.

Proposed fixes:
- **Real content:** use real photos of your branches and gaming floors, real screenshots of the software, and your logo. This is the biggest fix. I can't create these, so you need to send them.
- **Plain, human copy:** short sentences written for a café owner, with no jargon. The overview you sent is the source.
- **Varied layout:** alternate full-width screenshots, side-by-side sections, one big statement and a simple branch list, instead of the same card grid.
- **Typography:** a distinctive heading font (for example Space Grotesk or Sora) with Inter for body text. Drop the mono and "terminal" labels.
- **Colour:** keep the lime from your logo, but use it sparingly. Add a lighter section for contrast instead of an all-black page.
- **Less decoration:** fewer glowing dots, pills and tiny caps labels, plus fewer hover effects and sounds.
- **Fewer sections:** cut the tech strip and trim the 6-tab walkthrough to the modules that matter.

## 3. Notification (R8)
The site has no backend, so a website can't notify you by itself. There are two levels:
- **Included in this revision:** a visible in-page toast and sound for the visitor. Nothing reaches you yet.
- **Needs your choice:** a real alert to you. Options are a WhatsApp or Telegram message, an email, or a Google Sheet row. Each needs a small service, for example a Telegram bot with a Vercel/Netlify function. I recommend Telegram, because it is free and instant.

## 4. Open questions
1. **Prices (R3):** should I also remove the cash-count amounts in the shift-close demo, or keep those as "demo data"? My recommendation is to remove them, so the site shows no ₹ at all.
2. **Branch numbers:** how many PCs does each branch have? The overview says about 100+ in total. I'll show only "100+ PCs" until you confirm.
3. **Stats:** the hero claims like "0.00% leakage" and "<12ms lock latency" aren't in your overview. Keep them, or replace them with facts from it (4 branches, offline-first, live since Aug 2026)?
4. **Contact details:** the footer has a placeholder email and phone number (ops@arenaos.network, +91 80…). What are the real ones?
5. **Notification (R8):** do you want the real alert now, and through which channel?
6. **Design (R9):** can you send real branch photos and software screenshots? Do you have any websites you like as a reference? Should the 3D hero stay?

## 5. Out of scope
Nothing beyond the sections above. The 3D hero scene stays unless you want it replaced with a real photo.

## 6. Acceptance
- Searching the site for "₹", "rig", "leakage calculator", "Bengaluru", "Mumbai" and "Delhi" finds nothing.
- Only Surat branches appear.
- `npm run build` passes.
- Checked in the browser at localhost:5173.
