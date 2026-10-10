// Public demo: only the sections covered by the guided tour are open. Everything else is shown in
// the sidebar with a lock and is never loaded. The pages are lazy chunks, and a locked page's
// chunk is only requested once the gate below lets that role through.
//
// This is a product-showcase gate, not a security boundary: nothing shipped to a browser can be
// fully hidden. What it does is keep the locked modules out of what a visitor can download.
export const DEMO_OPEN = {
  operator: ['sessions', 'billing', 'food-orders'],
  admin: ['dashboard', 'members', 'reports'],
  super_admin: ['dashboard', 'audit-trail', 'settings'],
};

export const PAGE_LABELS = {
  sessions: 'Sessions', billing: 'Billing Counter', members: 'Members', reservations: 'Reservations',
  'food-orders': 'Food Orders', 'cash-desk': 'Cash Desk', 'cash-register': 'Cash Register',
  'online-desk': 'Online Desk', 'wallet-desk': 'Member Amount Desk', credits: 'Credits', eod: 'End of Day',
  'menu-editor': 'Menu Editor', dashboard: 'Dashboard', 'pc-status': 'PC Status', reports: 'Reports',
  settings: 'Settings', updates: 'Updates', 'audit-trail': 'Audit Trail', 'employee-forms': 'Employee Forms',
};

export const isOpenInDemo = (role, key) => (DEMO_OPEN[role] || []).includes(key);
export const firstOpenRoute = (role) => `/app/${(DEMO_OPEN[role] || DEMO_OPEN.operator)[0]}`;
