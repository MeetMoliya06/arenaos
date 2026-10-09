// Demo seed data — fictional café chain modelled on the Apple Esports deployment.
// Everything lives in memory; a page refresh restores this baseline.

let n = 0;
export const uid = (p = 'id') => `${p}-${(++n).toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const mins = (m) => new Date(Date.now() - m * 60000).toISOString();

export const BRANCHES = [
  { id: 'br-adajan', name: 'Adajan', address: 'Opp. Honey Park, Adajan, Surat', status: 'Active', openingTime: '10:00', closingTime: '02:00' },
  { id: 'br-citylight', name: 'Citylight', address: 'Citylight, Surat', status: 'Active', openingTime: '10:00', closingTime: '02:00' },
  { id: 'br-katargam', name: 'Katargam', address: 'Opp. Gajera School, Katargam, Surat', status: 'Active', openingTime: '10:00', closingTime: '02:00' },
  { id: 'br-varachha', name: 'Varachha', address: 'Elita Square, Mota Varachha, Surat', status: 'Active', openingTime: '10:00', closingTime: '02:00' },
];

const ZONES = {
  'br-adajan': [['Pro Combat Desk', 'PC', 16, 60]],
  'br-citylight': [['Champion Zone', 'PC', 20, 50], ['Elite War Zone', 'PC', 15, 60]],
  'br-katargam': [['Recruit Deck', 'PC', 14, 60], ['Veteran Stand', 'PC', 10, 70], ['VIP Elite Hub', 'PC', 8, 80]],
  'br-varachha': [['Titan Desk', 'PC', 10, 80], ['God-Tier Arena', 'PC', 9, 100], ['Sofa Club (PS5)', 'Console', 4, 100]],
};

export const PROFILES = [];
export const PCS = [];

for (const b of BRANCHES) {
  let i = 1;
  for (const [zoneName, kind, count, rate] of ZONES[b.id]) {
    const prof = {
      id: `pp-${b.id}-${zoneName.replace(/\W+/g, '').toLowerCase()}`,
      name: zoneName, baseHourlyRate: rate, bufferMinutes: 10, branchId: b.id, isActive: true,
      createdAt: mins(60 * 24 * 90), updatedAt: mins(60 * 24 * 7),
      refreshRate: rate >= 80 ? '240Hz' : '165Hz',
      systemSpecs: rate >= 80 ? 'RTX 4070 · i7-13700F · 32GB' : 'RTX 3060 · i5-12400F · 16GB',
      packages: [
        { name: '30 Minutes', d: 30, p: Math.round(rate * 0.5) },
        { name: '1 Hour', d: 60, p: rate },
        { name: '3 Hours', d: 180, p: Math.round(rate * 2.7) },
        { name: 'Night Pass (6h)', d: 360, p: Math.round(rate * 4.5) },
      ].map((x, k) => ({
        id: `pk-${b.id}-${zoneName.length}-${k}`, pricingProfileId: `pp-${b.id}-${zoneName.replace(/\W+/g, '').toLowerCase()}`,
        name: x.name, durationMinutes: x.d, price: x.p, sortOrder: k, isActive: true,
      })),
    };
    PROFILES.push(prof);
    for (let k = 0; k < count; k++, i++) {
      const prefix = kind === 'Console' ? 'PS5' : b.name.slice(0, 3).toUpperCase();
      PCS.push({
        id: `pc-${b.id}-${i}`,
        name: `${prefix}-${String(i).padStart(2, '0')}`,
        ipAddress: `192.168.${BRANCHES.indexOf(b) + 1}.${100 + i}`,
        state: 'Idle', branchId: b.id,
        isAgentOnline: kind !== 'Console', connectionMode: 'Local', agentVersion: '2.8.4', appVersion: '2.8.4',
        poweredOff: false,
        activeSessionId: null, activeBillId: null, sessionStartTime: null, sessionEndTime: null,
        customerName: null, customerType: null,
        ratePerHour: rate, bufferMinutes: 10, totalAmount: 0, foodAmount: 0,
        zone: kind === 'Console' ? 'Console' : zoneName, monitorHz: prof.refreshRate,
        lastCustomerName: null, lastMemberId: null,
        nextReservationId: null, nextReservationTime: null,
        hasOverrunWarning: false, overrunWarningMessage: null,
        profileId: prof.id,
      });
    }
  }
}

export const MENU = [
  ['Masala Maggi', 'Snacks', 60, 40], ['Cheese Sandwich', 'Snacks', 80, 30], ['Peri Peri Fries', 'Snacks', 90, 35],
  ['Veg Burger', 'Snacks', 110, 25], ['Chicken Burger', 'Snacks', 140, 20], ['Samosa (2 pcs)', 'Snacks', 40, 50],
  ['Cold Coffee', 'Beverages', 90, 40], ['Iced Tea', 'Beverages', 70, 45], ['Cola 250ml', 'Beverages', 30, 80],
  ['Energy Drink', 'Beverages', 125, 30], ['Mineral Water', 'Beverages', 20, 100], ['Chocolate Shake', 'Beverages', 110, 25],
  ['Lays Classic', 'Packaged', 20, 60], ['KitKat', 'Packaged', 30, 4], ['Oreo', 'Packaged', 30, 50],
].map(([itemName, category, price, currentStock], k) => ({
  id: `inv-${k}`, branchId: null, itemName, category, price, currentStock, soldQty: 5 + k * 3,
  minStockLimit: 5, status: currentStock > 0 ? 'Available' : 'OutOfStock', imageUrl: null,
  createdAt: mins(60 * 24 * 60), updatedAt: mins(60 * 24),
}));

const FIRST = ['Aarav', 'Vivaan', 'Rohan', 'Kabir', 'Ishaan', 'Dev', 'Arjun', 'Yash', 'Karan', 'Nikhil', 'Meet', 'Harsh', 'Jay', 'Om', 'Dhruv', 'Priya', 'Ananya', 'Riya', 'Sneha', 'Kriti'];
const LAST = ['Patel', 'Shah', 'Desai', 'Mehta', 'Joshi', 'Modi', 'Gandhi', 'Parekh', 'Trivedi', 'Vora'];
export const MEMBERS = Array.from({ length: 30 }, (_, k) => {
  const fullName = `${FIRST[k % FIRST.length]} ${LAST[(k * 3) % LAST.length]}`;
  const topups = 500 + ((k * 370) % 4500);
  return {
    id: `mem-${k + 1}`, memberNumber: `AE-${String(1001 + k)}`, fullName,
    mobileNumber: `98${String(76540000 + k * 1379).slice(0, 8)}`,
    email: `${fullName.toLowerCase().replace(' ', '.')}@example.com`, username: fullName.split(' ')[0].toLowerCase() + (k + 1),
    hasPassword: true, status: 'Active',
    gamingBalance: 100 + ((k * 137) % 1400), foodBalance: (k * 23) % 300,
    totalGamingTopUps: topups, totalGamingBonusEarned: Math.round(topups * 0.1), totalGamingSpend: Math.round(topups * 0.8),
    totalFoodSpend: (k * 41) % 900, gamingPoints: (k * 17) % 400, foodPoints: (k * 7) % 120, totalPoints: ((k * 17) % 400) + ((k * 7) % 120),
    joinDate: mins(60 * 24 * (20 + k * 9)), lastVisit: mins(60 * (k + 2)), homeBranchName: BRANCHES[k % 4].name,
    homeBranchId: BRANCHES[k % 4].id,
  };
});

export const OPERATORS = [
  ['Rahul Solanki', 'rahul', 'br-adajan'], ['Neha Patel', 'neha', 'br-adajan'], ['Imran Khan', 'imran', 'br-citylight'],
  ['Pooja Rathod', 'pooja', 'br-citylight'], ['Vikas Dave', 'vikas', 'br-katargam'], ['Mitesh Shah', 'mitesh', 'br-katargam'],
  ['Sagar Jain', 'sagar', 'br-varachha'], ['Hetal Gohil', 'hetal', 'br-varachha'],
].map(([fullName, username, branchId], k) => ({ id: `op-${k + 1}`, fullName, username, branchId, status: 'Active', role: 'operator' }));

export const DEMO_USERS = {
  operator: {
    id: 'op-1', fullName: 'Rahul Solanki', username: 'rahul', email: null, role: 'operator',
    branchId: 'br-adajan', branchName: 'Adajan', shiftId: 'shift-demo-1', status: 'Active',
    dashboardPermissions: Object.fromEntries(['billing_counter','sessions','reservations','food_orders','cash_register','cash_desk','online_desk','wallet_desk','credits','eod','members','menu_editor','main_dashboard','updates'].map((k) => [k, true])),
    lastLogin: mins(120), activeShift: { id: 'shift-demo-1', loginTime: mins(120) },
  },
  admin: {
    id: 'ad-1', fullName: 'Demo Admin', username: 'admin', email: 'admin@demo.arenaos.app', role: 'admin',
    branchId: 'br-adajan', branchName: 'Adajan', shiftId: null, status: 'Active',
    dashboardPermissions: { main_dashboard: true, reports: true, pc_status: true, settings: true, members: true, menu_editor: true, discount: true },
    lastLogin: mins(300), activeShift: null,
  },
  superadmin: {
    id: 'sa-1', fullName: 'Owner (Super Admin)', username: 'owner', email: 'owner@demo.arenaos.app', role: 'super_admin',
    branchId: null, branchName: null, shiftId: null, status: 'Active', dashboardPermissions: {}, lastLogin: mins(600), activeShift: null,
  },
};
