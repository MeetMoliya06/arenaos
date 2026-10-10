// Guided-tour scripts, one per role. Opt-in only: nothing here runs unless the visitor asked for it.
//
// Step fields
//   target   CSS selector to spotlight (omit for a centred card)
//   route    page the step belongs to; the tour navigates there if the visitor isn't on it
//   advance  'next'  : visitor presses Next
//            'click' : visitor clicks the highlighted element (their click still does its normal job)
//            'route' : visitor clicks a link and the tour moves on once the URL matches `route` of the next step
//   hint     small italic line telling the visitor which action is expected

const welcome = (who) => ({
  title: 'Welcome to ArenaOS',
  body: `A 1-minute walkthrough of the ${who} view. You'll do the real actions yourself, I'll just point.`,
});

const operator = [
  { route: '/app/sessions', ...welcome('operator') },
  {
    route: '/app/sessions', target: '[data-tour="pc-grid"]', placement: 'bottom', advance: 'next',
    title: 'Your floor, live',
    body: 'Every tile is a PC or console. Blue is free, green is in use, white is waiting to be billed, yellow is under maintenance, red is shut down.',
  },
  {
    route: '/app/sessions', target: '[data-pc-state="Idle"]', placement: 'right', advance: 'click',
    title: 'Pick a free PC',
    body: 'Click this free PC to open its panel.',
    hint: 'Click the highlighted tile',
  },
  {
    route: '/app/sessions', target: '[data-tour="start-name"]', placement: 'right', advance: 'next',
    title: 'Who is playing?',
    body: 'Type a customer name (or a token number). Members can be searched by mobile number above this field.',
  },
  {
    route: '/app/sessions', target: '[data-tour="start-plan"]', placement: 'right', advance: 'next',
    title: 'Choose a plan',
    body: 'Hourly, packs or pay-as-you-go. Rates come from the branch pricing set by the owner.',
  },
  {
    route: '/app/sessions', target: '[data-tour="start-submit"]', placement: 'right', advance: 'click',
    title: 'Start the session',
    body: 'Fill in a name and a plan, then press Start. The PC unlocks and the clock begins.',
    hint: 'Click Start Session',
  },
  {
    route: '/app/sessions', target: '[data-tour="pc-grid"]', placement: 'bottom', advance: 'next',
    title: 'That PC is now live',
    body: 'The tile turned green and shows time running. Click it any time to extend, add food, transfer, or stop and bill.',
  },
  {
    route: '/app/sessions', target: '[data-tour="nav-billing"]', placement: 'right', advance: 'route', nextRoute: '/app/billing',
    title: 'Taking payment',
    body: 'Stopped sessions land in the Billing Counter. Open it.',
    hint: 'Click Billing Counter',
  },
  {
    route: '/app/billing', target: '[data-tour="main"]', placement: 'center', advance: 'next',
    title: 'Bills waiting to be paid',
    body: 'Pick a bill, apply a discount, and split payment across cash, UPI and wallet.',
  },
  {
    route: '/app/billing', target: '[data-tour="nav-food-orders"]', placement: 'right', advance: 'route', nextRoute: '/app/food-orders',
    title: 'Food & drinks',
    body: 'Orders from the café menu move across a kitchen board. Open it.',
    hint: 'Click Food Orders',
  },
  {
    route: '/app/food-orders', target: '[data-tour="main"]', placement: 'center', advance: 'next',
    title: 'Kitchen board',
    body: 'New → Preparing → Ready → Served. Orders can be attached to a PC session or paid on the spot.',
  },
  {
    route: '/app/food-orders', title: "That's the counter",
    body: 'Use the bar at the bottom to switch role and see the owner view, or restart this tour any time.',
  },
];

const admin = [
  { route: '/app/dashboard', ...welcome('branch admin') },
  {
    route: '/app/dashboard', target: '[data-tour="main"]', placement: 'center', advance: 'next',
    title: 'Operational dashboard',
    body: "Today's revenue, active sessions, food sales and payment mix for your branch, updating live.",
  },
  {
    route: '/app/dashboard', target: '[data-tour="nav-members"]', placement: 'right', advance: 'route', nextRoute: '/app/members',
    title: 'Members & wallets',
    body: 'Regulars get wallets, top-ups and perks. Open Members.',
    hint: 'Click Members',
  },
  {
    route: '/app/members', target: '[data-tour="main"]', placement: 'center', advance: 'next',
    title: 'Member list',
    body: 'Search by name or mobile, view balances, recharge wallets and see play history.',
  },
  {
    route: '/app/members', target: '[data-tour="nav-reports"]', placement: 'right', advance: 'route', nextRoute: '/app/reports',
    title: 'Reports',
    body: 'Revenue, utilisation and shift reports with PDF export. Open Reports.',
    hint: 'Click Reports',
  },
  {
    route: '/app/reports', target: '[data-tour="main"]', placement: 'center', advance: 'next',
    title: 'Numbers you can act on',
    body: 'Pick a date range and drill into sessions, food and payments.',
  },
  { route: '/app/reports', title: "That's the admin view", body: 'Switch role from the bar below to see the owner view across all branches.' },
];

const superadmin = [
  { route: '/app/dashboard', ...welcome('owner') },
  {
    route: '/app/dashboard', target: '[data-tour="branch-switcher"]', placement: 'bottom', advance: 'next',
    title: 'All your branches in one place',
    body: 'Switch between the 4 branches (or see them combined). Real switches ask for a PIN; the demo skips it.',
  },
  {
    route: '/app/dashboard', target: '[data-tour="main"]', placement: 'center', advance: 'next',
    title: 'Owner dashboard',
    body: 'Revenue and activity for the selected branch, so you can spot a slow shift or a busy night from anywhere.',
  },
  {
    route: '/app/dashboard', target: '[data-tour="nav-audit-trail"]', placement: 'right', advance: 'route', nextRoute: '/app/audit-trail',
    title: 'Every action is recorded',
    body: 'Discounts, voids, price changes: who did what and when. Open Audit Trail.',
    hint: 'Click Audit Trail',
  },
  {
    route: '/app/audit-trail', target: '[data-tour="main"]', placement: 'center', advance: 'next',
    title: 'Audit trail',
    body: 'Filter by user, action and date. Nothing here can be edited.',
  },
  {
    route: '/app/audit-trail', target: '[data-tour="nav-settings"]', placement: 'right', advance: 'route', nextRoute: '/app/settings',
    title: 'Pricing and settings',
    body: 'Plans, rates, PCs and staff are all configured here. Open Settings.',
    hint: 'Click Settings',
  },
  { route: '/app/settings', title: "That's the owner view", body: 'Switch role from the bar below to try the counter as an operator.' },
];

export function stepsFor({ isOperator, isSuperAdmin }) {
  if (isOperator) return operator;
  return isSuperAdmin && !isOperator ? superadmin : admin;
}
