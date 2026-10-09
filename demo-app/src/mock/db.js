import { BRANCHES, PCS, PROFILES, MENU, MEMBERS, OPERATORS, uid } from './seed';

const iso = (d = new Date()) => new Date(d).toISOString();
const ago = (m) => new Date(Date.now() - m * 60000).toISOString();

export const db = {
  branches: structuredClone(BRANCHES),
  pcs: structuredClone(PCS),
  profiles: structuredClone(PROFILES),
  menu: structuredClone(MENU),
  members: structuredClone(MEMBERS),
  operators: structuredClone(OPERATORS),
  sessions: [],
  bills: [],
  foodOrders: [],
  walletTx: [],
  cashTx: {},      // branchId -> []
  registers: {},   // branchId -> register
  activities: [],  // session activity log
  reservations: [],
  credits: [],
  audit: [],
  maintenance: [],
  counters: { bill: 1000, order: 500, session: 0 },
};

export const find = {
  pc: (id) => db.pcs.find((p) => p.id === id),
  session: (id) => db.sessions.find((s) => s.id === id),
  bill: (id) => db.bills.find((b) => b.id === id),
  member: (id) => db.members.find((m) => m.id === id),
  profile: (id) => db.profiles.find((p) => p.id === id),
};

export function logAudit(branchId, action, description, actor = 'Demo User') {
  db.audit.unshift({ id: uid('aud'), branchId, action, description, userName: actor, timestamp: iso(), entityType: 'System' });
}

export function logActivity(branchId, type, description, extra = {}) {
  db.activities.unshift({ id: uid('act'), branchId, type, description, timestamp: iso(), ...extra });
  if (db.activities.length > 300) db.activities.length = 300;
}

// ── Money helpers ────────────────────────────────────────────────────────────
export const round = (n) => Math.round(n);

export function gamingChargeFor(session, pc, now = Date.now()) {
  // Prepaid package → flat price; open-ended → hourly after the free buffer.
  if (session.durationMinutes > 0) return session.expectedAmount;
  const elapsedMin = (now - new Date(session.startTime).getTime()) / 60000;
  if (elapsedMin <= (pc?.bufferMinutes ?? 10)) return 0;
  return Math.max(1, Math.ceil((elapsedMin / 60) * (pc?.ratePerHour ?? 60)));
}

export function recalcBill(bill) {
  const session = bill.sessionId ? find.session(bill.sessionId) : null;
  const pc = bill.pcId ? find.pc(bill.pcId) : null;
  bill.foodAmount = bill.items.filter((i) => i.itemType === 'Food').reduce((s, i) => s + i.totalPrice, 0);
  if (session && bill.status === 'Pending') bill.gamingAmount = gamingChargeFor(session, pc, session.endTime ? new Date(session.endTime).getTime() : Date.now());
  bill.subtotal = bill.gamingAmount + bill.foodAmount;
  let discount = 0;
  if (bill.discountType === 'Percentage') discount = (bill.subtotal * bill.discountValue) / 100;
  else if (bill.discountType === 'Fixed') discount = bill.discountValue;
  bill.discountAmount = Math.min(Math.round(discount), bill.subtotal);
  bill.totalAmount = Math.max(0, bill.subtotal - bill.discountAmount);
  return bill;
}

export function syncPcFromSession(pc) {
  const s = pc.activeSessionId ? find.session(pc.activeSessionId) : null;
  if (!s) return;
  const bill = find.bill(s.billId);
  if (bill) recalcBill(bill);
  pc.totalAmount = bill?.totalAmount ?? 0;
  pc.foodAmount = bill?.foodAmount ?? 0;
}

export function newBillNumber(branchId) {
  const code = (db.branches.find((b) => b.id === branchId)?.name || 'XXX').slice(0, 3).toUpperCase();
  return `${code}-${++db.counters.bill}`;
}

export function startSession({ pcId, customerName, memberId, durationMinutes, packageName, expectedAmount, operatorId, startOffsetMin = 0 }) {
  const pc = find.pc(pcId);
  const start = new Date(Date.now() - startOffsetMin * 60000);
  const sessionId = uid('ses');
  const billId = uid('bill');
  const session = {
    id: sessionId, pcId, pcName: pc.name, branchId: pc.branchId, operatorId: operatorId || 'op-1', shiftId: 'shift-demo-1',
    customerName, memberId: memberId || null, startTime: iso(start),
    endTime: durationMinutes > 0 ? iso(new Date(start.getTime() + durationMinutes * 60000)) : null,
    durationMinutes: durationMinutes || 0, expectedAmount: expectedAmount || 0, packageName: packageName || 'Open Session',
    status: 'Active', billId,
  };
  const bill = {
    id: billId, billNumber: newBillNumber(pc.branchId), sessionId, pcId, pcNumber: pc.name, branchId: pc.branchId,
    operatorId: session.operatorId, shiftId: session.shiftId, customerName, memberId: memberId || null,
    gamingAmount: expectedAmount || 0, foodAmount: 0, subtotal: 0, discountType: null, discountValue: 0, discountAmount: 0,
    discountReason: null, totalAmount: 0, status: 'Pending', isDeferred: false, createdAt: iso(start), sessionEndTime: null,
    items: [], payments: [],
  };
  db.sessions.unshift(session);
  db.bills.unshift(bill);
  recalcBill(bill);
  Object.assign(pc, {
    state: 'Active', activeSessionId: sessionId, activeBillId: billId, sessionStartTime: session.startTime,
    sessionEndTime: session.endTime, customerName, customerType: memberId ? 'Member' : 'Walk-in',
    totalAmount: bill.totalAmount, foodAmount: 0,
  });
  logActivity(pc.branchId, 'SessionStarted', `${pc.name}: Session started for ${customerName}`, { pcId });
  return { session, bill };
}

// ── Seed live state ──────────────────────────────────────────────────────────
function seedBranchState(branch) {
  const pcs = db.pcs.filter((p) => p.branchId === branch.id);
  const names = ['Aarav P.', 'Rohan S.', 'Kabir D.', 'Ishaan M.', 'Dev J.', 'Walk-in', 'Yash G.', 'Harsh V.', 'Karan T.'];
  // ~45% occupied
  pcs.slice(0, Math.max(4, Math.round(pcs.length * 0.45))).forEach((pc, i) => {
    const openEnded = i % 3 === 0;
    const member = i % 2 === 0 ? db.members[(i + 3) % db.members.length] : null;
    const rate = pc.ratePerHour;
    const dur = openEnded ? 0 : [60, 180, 60, 30][i % 4];
    startSession({
      pcId: pc.id, customerName: member?.fullName || names[i % names.length], memberId: member?.id,
      durationMinutes: dur, packageName: openEnded ? 'Open Session' : dur === 30 ? '30 Minutes' : dur === 60 ? '1 Hour' : '3 Hours',
      expectedAmount: dur === 30 ? rate / 2 : dur === 60 ? rate : dur === 180 ? Math.round(rate * 2.7) : 0,
      startOffsetMin: 8 + ((i * 17) % Math.max(20, dur - 10 || 70)),
    });
  });
  // One awaiting-billing PC and one under maintenance
  const free = pcs.filter((p) => p.state === 'Idle');
  if (free[0]) {
    const { session, bill } = startSession({ pcId: free[0].id, customerName: 'Meet P.', durationMinutes: 60, packageName: '1 Hour', expectedAmount: free[0].ratePerHour, startOffsetMin: 75 });
    session.status = 'AwaitingBilling'; session.endTime = iso();
    free[0].state = 'AwaitingBilling'; bill.sessionEndTime = session.endTime;
  }
  if (free[1]) free[1].state = 'UnderMaintenance';
}

function seedHistory() {
  // Completed bills earlier today so dashboards / EOD / cash register have real numbers.
  for (const b of db.branches) {
    const pcs = db.pcs.filter((p) => p.branchId === b.id);
    const n = 9 + (b.id.length % 5);
    for (let i = 0; i < n; i++) {
      const pc = pcs[(i * 3) % pcs.length];
      const gaming = [60, 120, 50, 180, 90, 240, 100, 60, 150, 80, 200][i % 11];
      const food = i % 3 === 0 ? [60, 110, 90, 250][i % 4] : 0;
      const method = ['Cash', 'Online', 'Cash', 'Wallet', 'Split'][i % 5];
      const total = gaming + food;
      const cash = method === 'Cash' ? total : method === 'Split' ? Math.round(total / 2) : 0;
      const online = method === 'Online' ? total : method === 'Split' ? total - cash : 0;
      const wallet = method === 'Wallet' ? total : 0;
      const createdAt = ago(30 + i * 35);
      db.bills.push({
        id: uid('bill'), billNumber: newBillNumber(b.id), sessionId: null, pcId: pc.id, pcNumber: pc.name, branchId: b.id,
        operatorId: 'op-1', shiftId: 'shift-demo-1', customerName: db.members[(i * 5) % 30].fullName, memberId: null,
        gamingAmount: gaming, foodAmount: food, subtotal: total, discountType: null, discountValue: 0, discountAmount: 0, discountReason: null,
        totalAmount: total, status: 'Completed', isDeferred: false, createdAt, sessionEndTime: createdAt,
        items: food ? [{ id: uid('bi'), itemType: 'Food', itemName: db.menu[i % db.menu.length].itemName, quantity: 1, unitPrice: food, totalPrice: food }] : [],
        payments: [{ id: uid('pay'), paymentType: method, totalAmount: total, cashAmount: cash, onlineAmount: online, walletAmount: wallet, cashReceived: cash, changeReturned: 0, actualCashCollected: cash, createdAt }],
      });
    }
  }
}

function seedMisc() {
  for (const b of db.branches) {
    db.cashTx[b.id] = [];
    db.registers[b.id] = null;
  }
  db.credits.push(
    { id: uid('cr'), branchId: 'br-adajan', customerName: 'Harsh V.', customerPhone: '9876501122', amount: 340, status: 'Pending', createdAt: ago(60 * 26), billId: null, notes: 'Will pay tomorrow' },
    { id: uid('cr'), branchId: 'br-adajan', customerName: 'Dhruv M.', customerPhone: '9812300045', amount: 120, status: 'Pending', createdAt: ago(60 * 5), billId: null, notes: '' },
  );
  const m = db.members;
  for (let i = 0; i < 24; i++) {
    const mem = m[i % m.length];
    const topup = [500, 1000, 300, 2000, 200][i % 5];
    db.walletTx.unshift({
      id: uid('wt'), memberId: mem.id, action: i % 6 === 5 ? 'Deduct' : 'TopUp', targetWallet: 'Gaming', amount: topup,
      bonusAmount: i % 6 === 5 ? 0 : Math.round(topup * 0.1), balanceBefore: 0, balanceAfter: mem.gamingBalance,
      paymentType: i % 2 ? 'Cash' : 'Online', reason: null, createdAt: ago(40 + i * 53), branchId: mem.homeBranchId,
    });
  }
}

export function resetDb() {
  db.sessions.length = 0; db.bills.length = 0; db.foodOrders.length = 0; db.walletTx.length = 0; db.activities.length = 0;
  db.pcs = structuredClone(PCS); db.members = structuredClone(MEMBERS); db.menu = structuredClone(MENU);
  db.branches.forEach((b) => seedBranchState(b));
  seedHistory();
  seedMisc();
}

resetDb();
