// In-browser fake of the Apple Esports ERP API. Plugged into axios as a custom adapter, so the
// real UI code runs unmodified against seeded, in-memory data.
import { AxiosError } from 'axios';
import { db, find, recalcBill, syncPcFromSession, logActivity, logAudit, startSession, gamingChargeFor, newBillNumber } from './db';
import { bus } from './bus';
import { uid, DEMO_USERS } from './seed';

const ok = (data) => ({ success: true, data });
class HttpError extends Error { constructor(status, error, code) { super(error); this.status = status; this.body = { success: false, error, code }; } }
const fail = (status, error, code) => { throw new HttpError(status, error, code); };
const iso = () => new Date().toISOString();
const page = (items, p = 1, ps = 50) => {
  const start = (Number(p) - 1) * Number(ps);
  return { items: items.slice(start, start + Number(ps)), totalCount: items.length, page: Number(p), pageSize: Number(ps), totalPages: Math.max(1, Math.ceil(items.length / Number(ps))) };
};

const currentUser = () => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } };
const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

function branchOf(ctx) {
  const u = currentUser();
  return ctx.query.branchId || ctx.headers['X-Branch-Id'] || u?.branchId || localStorage.getItem('activeBranchId') || null;
}
const inBranch = (rows, ctx) => { const b = branchOf(ctx); return b ? rows.filter((r) => r.branchId === b) : rows; };

const pcEvt = () => {
  bus.emit('/hubs/pc-status', 'PcStatusChanged');
  bus.emit('/hubs/sessions', 'SessionUpdated');
  bus.emit('/hubs/dashboard', 'DashboardRefreshRequired');
};
const billEvt = (id) => { bus.emit('/hubs/billing', 'BillingUpdated', id); bus.emit('/hubs/billing', 'BillUpdated'); };

const planFor = (pc) => {
  const prof = find.profile(pc.profileId);
  const plans = prof.packages.filter((p) => p.isActive).map((p) => ({ id: p.id, name: p.name, duration: p.durationMinutes, price: p.price, isPostpaid: false }));
  plans.push({ id: `${prof.id}-open`, name: 'Open Session (pay after)', duration: 0, price: 0, isPostpaid: true });
  return plans;
};

function toPcDto(pc) {
  const { profileId, ...rest } = pc;
  return { ...rest };
}

function refreshPcs() {
  db.pcs.forEach((pc) => {
    if (pc.activeSessionId) syncPcFromSession(pc);
    const s = pc.activeSessionId && find.session(pc.activeSessionId);
    // Prepaid time ran out → flag, like the real clock-expiry warning.
    if (s && s.status === 'Active' && s.endTime && Date.now() > new Date(s.endTime).getTime()) {
      pc.hasOverrunWarning = true; pc.overrunWarningMessage = 'Time is up — extend or stop the session.';
    } else { pc.hasOverrunWarning = false; pc.overrunWarningMessage = null; }
  });
}

function dashboardSummary(branchId) {
  refreshPcs();
  const pcs = db.pcs.filter((p) => !branchId || p.branchId === branchId);
  const bills = db.bills.filter((b) => (!branchId || b.branchId === branchId) && b.status === 'Completed' && isToday(b.createdAt));
  const pays = bills.flatMap((b) => b.payments);
  return {
    totalActiveSessions: pcs.filter((p) => p.state === 'Active').length,
    totalActivePcs: pcs.filter((p) => p.state === 'Active').length,
    reservedPcs: 0,
    pcsUnderMaintenance: pcs.filter((p) => p.state === 'UnderMaintenance').length,
    awaitingBillingPcs: pcs.filter((p) => p.state === 'AwaitingBilling').length,
    activeFoodOrders: db.foodOrders.filter((o) => (!branchId || o.branchId === branchId) && ['Pending', 'Preparing', 'Ready'].includes(o.status)).length,
    activeOperators: 1, lowStockAlerts: db.menu.filter((m) => m.currentStock <= m.minStockLimit).length,
    todayBillsCount: bills.length,
    totalRevenueToday: bills.reduce((s, b) => s + b.totalAmount, 0),
    gamingRevenueToday: bills.reduce((s, b) => s + b.gamingAmount, 0),
    foodRevenueToday: bills.reduce((s, b) => s + b.foodAmount, 0),
    cashTotals: pays.reduce((s, p) => s + p.cashAmount, 0),
    onlineTotals: pays.reduce((s, p) => s + p.onlineAmount, 0),
    walletTotals: pays.reduce((s, p) => s + p.walletAmount, 0),
  };
}

function payBill(bill, body) {
  if (bill.status === 'Completed') fail(409, 'This bill is already paid.');
  recalcBill(bill);
  const total = bill.totalAmount;
  const type = body.paymentType;
  let cash = 0, online = 0, wallet = 0;
  if (type === 'Cash') cash = total;
  else if (type === 'Online') online = total;
  else if (type === 'Wallet') wallet = total;
  else { cash = Number(body.cashAmount || 0); online = Number(body.onlineAmount || 0); wallet = Number(body.walletAmount || 0); }
  if (wallet > 0) {
    const m = find.member(body.memberId || bill.memberId);
    if (!m) fail(400, 'Select a member to pay from wallet.');
    if (m.gamingBalance < wallet) fail(400, `Insufficient wallet balance (₹${m.gamingBalance}).`);
    const before = m.gamingBalance; m.gamingBalance -= wallet; m.totalGamingSpend += wallet;
    db.walletTx.unshift({ id: uid('wt'), memberId: m.id, action: 'Deduct', targetWallet: 'Gaming', amount: wallet, bonusAmount: 0, balanceBefore: before, balanceAfter: m.gamingBalance, paymentType: 'Wallet', reason: `Bill ${bill.billNumber}`, createdAt: iso(), branchId: bill.branchId });
  }
  const received = Number(body.cashReceived || cash);
  bill.payments.push({ id: uid('pay'), paymentType: type, totalAmount: total, cashAmount: cash, onlineAmount: online, walletAmount: wallet, cashReceived: received, changeReturned: Math.max(0, received - cash), actualCashCollected: cash, createdAt: iso() });
  bill.status = 'Completed'; bill.isDeferred = false;
  if (bill.sessionId) {
    const s = find.session(bill.sessionId);
    if (s) { s.status = 'Completed'; s.endTime = s.endTime && new Date(s.endTime) < new Date() ? s.endTime : iso(); }
    const pc = find.pc(bill.pcId);
    if (pc && pc.activeSessionId === bill.sessionId) {
      Object.assign(pc, { state: 'Idle', activeSessionId: null, activeBillId: null, sessionStartTime: null, sessionEndTime: null, customerName: null, customerType: null, totalAmount: 0, foodAmount: 0, lastCustomerName: bill.customerName, lastMemberId: bill.memberId });
    }
  }
  if (cash > 0) db.cashTx[bill.branchId] = [{ id: uid('ct'), billId: bill.id, pcNumber: bill.pcNumber, cashAmount: cash, cashReceived: received, changeReturned: Math.max(0, received - cash), actualCashCollected: cash, gamingAmount: bill.gamingAmount, foodAmount: bill.foodAmount, transactionType: 'bill_payment', customerName: bill.customerName, createdAt: iso() }, ...(db.cashTx[bill.branchId] || [])];
  logActivity(bill.branchId, 'PaymentCompleted', `${bill.pcNumber || 'Counter'}: ₹${total} received (${type})`, { amount: total, paymentMethod: type });
  pcEvt(); billEvt(bill.id);
  return bill;
}

// ── Routes ───────────────────────────────────────────────────────────────────
const routes = [];
const route = (method, pattern, fn) => {
  const keys = [];
  const rx = new RegExp('^' + pattern.replace(/:([a-zA-Z]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
  routes.push({ method, rx, keys, fn });
};
const GET = (p, f) => route('GET', p, f), POST = (p, f) => route('POST', p, f), PUT = (p, f) => route('PUT', p, f),
  PATCH = (p, f) => route('PATCH', p, f), DEL = (p, f) => route('DELETE', p, f);

// Auth
GET('/auth/me', () => { const u = currentUser(); if (!u) fail(401, 'Not signed in'); return ok(u); });
GET('/auth/branches', () => ok(db.branches));
GET('/auth/check-setup', () => ok({ isSetupComplete: true, hasMaster: true, needsSetup: false }));
GET('/auth/operators/:branchId', (c) => ok(db.operators.filter((o) => o.branchId === c.params.branchId)));
GET('/auth/admin-switch/available', () => ok([]));
POST('/auth/logout', () => ok({}));
POST('/auth/session/clear', () => ok({}));
POST('/auth/refresh', () => ok({ accessToken: 'demo' }));
POST('/auth/admin/login', () => ok({ user: DEMO_USERS.admin, accessToken: 'demo', refreshToken: 'demo' }));
POST('/auth/operator/login', () => ok({ user: DEMO_USERS.operator, accessToken: 'demo', refreshToken: 'demo', resumedShift: true, hasOpenRegister: true }));

// PCs & plans
GET('/pcs', (c) => { refreshPcs(); return ok(inBranch(db.pcs, c).map(toPcDto)); });
GET('/pcs/detail', (c) => { refreshPcs(); return ok(inBranch(db.pcs, c).map(toPcDto)); });
GET('/public/pcs/:id/plans', (c) => ok(planFor(find.pc(c.params.id) || fail(404, 'PC not found'))));
GET('/public/pcs/:id', (c) => ok(toPcDto(find.pc(c.params.id) || db.pcs.find((p) => p.name === c.params.id) || fail(404, 'PC not found'))));
GET('/public/walkin-pending', () => ok([]));
GET('/public/branches', () => ok(db.branches));
GET('/branch-status', () => ok({ status: 'Online', mode: 'Local', isConflict: false }));

// Sessions
GET('/sessions', (c) => { refreshPcs(); return ok(page(inBranch(db.sessions, c), c.query.page, c.query.pageSize || 100)); });
GET('/sessions/interrupted', () => ok([]));
// The UI keeps its own live activity log; serving the server-side one too would show every line twice.
GET('/sessions/activities/recent', () => ok([]));
GET('/sessions/:id/activities', (c) => ok(db.activities.filter((a) => a.sessionId === c.params.id)));
POST('/sessions/start', (c) => {
  const b = c.body; const pc = find.pc(b.pcId) || fail(404, 'PC not found');
  if (pc.state !== 'Idle') fail(409, `${pc.name} is not available.`);
  const { session } = startSession({ ...b, operatorId: currentUser()?.id });
  pcEvt(); return ok(session);
});
POST('/sessions/:id/stop', (c) => {
  const s = find.session(c.params.id) || fail(404, 'Session not found'); const pc = find.pc(s.pcId); const bill = find.bill(s.billId);
  s.endTime = iso(); recalcBill(bill); bill.sessionEndTime = s.endTime;
  if (c.body?.deferPayment) {
    s.status = 'Completed'; bill.isDeferred = true;
    Object.assign(pc, { state: 'Idle', activeSessionId: null, activeBillId: null, sessionStartTime: null, sessionEndTime: null, customerName: null, customerType: null, totalAmount: 0, foodAmount: 0, lastCustomerName: s.customerName, lastMemberId: s.memberId });
  } else { s.status = 'AwaitingBilling'; pc.state = 'AwaitingBilling'; pc.totalAmount = bill.totalAmount; }
  logActivity(pc.branchId, 'SessionStopped', `${pc.name}: Session stopped — ₹${bill.totalAmount}`, { pcId: pc.id, sessionId: s.id });
  pcEvt(); billEvt(bill.id); return ok(s);
});
POST('/sessions/:id/extend', (c) => {
  const s = find.session(c.params.id) || fail(404, 'Session not found'); const pc = find.pc(s.pcId);
  const mins = Number(c.body.additionalMinutes || 0);
  s.durationMinutes += mins; s.expectedAmount += Number(c.body.additionalAmount || 0);
  s.endTime = new Date((s.endTime ? new Date(s.endTime).getTime() : Date.now()) + mins * 60000).toISOString();
  pc.sessionEndTime = s.endTime; recalcBill(find.bill(s.billId)); syncPcFromSession(pc);
  logActivity(pc.branchId, 'SessionExtended', `${pc.name}: Extended by ${mins} min`, { pcId: pc.id });
  pcEvt(); return ok(s);
});
POST('/sessions/:id/resume', (c) => ok(find.session(c.params.id)));
POST('/sessions/:id/transfer', (c) => {
  const s = find.session(c.params.id) || fail(404, 'Session not found'); const from = find.pc(s.pcId); const to = find.pc(c.body.targetPcId) || fail(404, 'Target PC not found');
  if (to.state !== 'Idle') fail(409, `${to.name} is not available.`);
  Object.assign(to, { state: from.state, activeSessionId: from.activeSessionId, activeBillId: from.activeBillId, sessionStartTime: from.sessionStartTime, sessionEndTime: from.sessionEndTime, customerName: from.customerName, customerType: from.customerType });
  Object.assign(from, { state: 'Idle', activeSessionId: null, activeBillId: null, sessionStartTime: null, sessionEndTime: null, customerName: null, customerType: null, totalAmount: 0, foodAmount: 0 });
  s.pcId = to.id; s.pcName = to.name; const bill = find.bill(s.billId); bill.pcId = to.id; bill.pcNumber = to.name;
  syncPcFromSession(to); pcEvt(); return ok(s);
});

// Billing
GET('/bills', (c) => {
  const rows = inBranch(db.bills, c).filter((b) => b.status === 'Pending' && !(b.sessionId && find.session(b.sessionId)?.status === 'Active'));
  rows.forEach(recalcBill); return ok(page(rows, c.query.page, c.query.pageSize || 100));
});
GET('/bills/:id', (c) => { const b = find.bill(c.params.id) || fail(404, 'Bill not found'); return ok(recalcBill(b)); });
POST('/bills/:id/pay', (c) => ok(payBill(find.bill(c.params.id) || fail(404, 'Bill not found'), c.body)));
POST('/bills/:id/discount', (c) => {
  const b = find.bill(c.params.id) || fail(404, 'Bill not found');
  Object.assign(b, { discountType: c.body.discountType, discountValue: Number(c.body.discountValue), discountReason: c.body.reason }); recalcBill(b);
  logAudit(b.branchId, 'DiscountApplied', `${b.billNumber}: ${c.body.discountType} ${c.body.discountValue} — ${c.body.reason}`);
  billEvt(b.id); return ok(b);
});
POST('/bills/:id/request-wallet-approval', () => ok({}));
PATCH('/bills/:id/payment-method', (c) => {
  const b = find.bill(c.params.id) || fail(404, 'Bill not found'); const p = b.payments[0];
  if (p) { p.paymentType = c.body.newPaymentType; p.cashAmount = c.body.newPaymentType === 'Cash' ? b.totalAmount : Number(c.body.cashAmount || 0); p.onlineAmount = c.body.newPaymentType === 'Online' ? b.totalAmount : Number(c.body.onlineAmount || 0); p.walletAmount = 0; }
  return ok(b);
});
DEL('/bills/:id/items/:itemId', (c) => { const b = find.bill(c.params.id) || fail(404, 'Bill not found'); b.items = b.items.filter((i) => i.id !== c.params.itemId); recalcBill(b); billEvt(b.id); return ok(b); });
DEL('/bills/:id', (c) => { const b = find.bill(c.params.id); if (b) b.status = 'Voided'; return ok({}); });

// Inventory & food
GET('/inventory', (c) => ok(db.menu.map((m) => ({ ...m, branchId: branchOf(c) }))));
GET('/inventory/discrepancies', () => ok([]));
PATCH('/inventory/:id/stock', (c) => { const m = db.menu.find((x) => x.id === c.params.id); if (m) { m.currentStock = Number(c.body.currentStock); m.status = m.currentStock > 0 ? 'Available' : 'OutOfStock'; } return ok(m); });
PUT('/inventory/:id', (c) => { const m = db.menu.find((x) => x.id === c.params.id); Object.assign(m, c.body); return ok(m); });
POST('/inventory', (c) => { const m = { id: uid('inv'), soldQty: 0, minStockLimit: 5, status: 'Available', ...c.body }; db.menu.push(m); return ok(m); });
DEL('/inventory/:id', (c) => { db.menu = db.menu.filter((x) => x.id !== c.params.id); return ok({}); });
GET('/food-orders', (c) => ok(page(inBranch(db.foodOrders, c), c.query.page, c.query.pageSize || 50)));
GET('/food-orders/history', (c) => ok(page(inBranch(db.foodOrders, c).filter((o) => ['Delivered', 'Completed', 'Cancelled'].includes(o.status)), 1, 100)));
GET('/food-orders/:id', (c) => ok(db.foodOrders.find((o) => o.id === c.params.id) || fail(404, 'Order not found')));
POST('/food-orders', (c) => {
  const pc = c.body.pcId ? find.pc(c.body.pcId) : null; const session = c.body.sessionId ? find.session(c.body.sessionId) : (pc?.activeSessionId ? find.session(pc.activeSessionId) : null);
  const branchId = pc?.branchId || branchOf(c);
  const items = (c.body.items || []).map((it) => { const m = db.menu.find((x) => x.id === it.inventoryId) || fail(400, 'Unknown item'); m.currentStock = Math.max(0, m.currentStock - it.quantity); m.soldQty += it.quantity; return { id: uid('oi'), inventoryId: m.id, itemName: m.itemName, quantity: it.quantity, unitPrice: m.price, totalPrice: m.price * it.quantity }; });
  const order = { id: uid('ord'), orderNumber: `FO-${++db.counters.order}`, sessionId: session?.id || null, pcId: pc?.id || null, pcNumber: pc?.name || null, billId: session?.billId || null, branchId, operatorId: currentUser()?.id, customerName: c.body.customerName || session?.customerName || 'Walk-in', totalAmount: items.reduce((s, i) => s + i.totalPrice, 0), paymentType: null, status: 'Pending', cancelledReason: null, orderTime: iso(), deliveredAt: null, items };
  db.foodOrders.unshift(order);
  const bill = session && find.bill(session.billId);
  if (bill) { items.forEach((i) => bill.items.push({ id: uid('bi'), itemType: 'Food', itemName: i.itemName, quantity: i.quantity, unitPrice: i.unitPrice, totalPrice: i.totalPrice })); recalcBill(bill); syncPcFromSession(pc); billEvt(bill.id); }
  bus.emit('/hubs/food-orders', 'FoodOrderUpdated', order); pcEvt(); return ok(order);
});
PUT('/food-orders/:id/status', (c) => { const o = db.foodOrders.find((x) => x.id === c.params.id) || fail(404, 'Order not found'); o.status = c.body.status; if (c.body.status === 'Delivered') o.deliveredAt = iso(); if (c.body.reason) o.cancelledReason = c.body.reason; bus.emit('/hubs/food-orders', 'FoodOrderUpdated', o); return ok(o); });
GET('/food-groups', () => ok([]));

// Members & wallets
GET('/members', (c) => {
  const q = (c.query.search || '').toLowerCase();
  const rows = db.members.filter((m) => m.status !== 'Deleted' && (!q || m.fullName.toLowerCase().includes(q) || m.mobileNumber.includes(q) || m.memberNumber.toLowerCase().includes(q)));
  return ok(page(rows, c.query.page, c.query.pageSize));
});
GET('/members/phone/:phone', (c) => ok(db.members.find((m) => m.mobileNumber === c.params.phone) || fail(404, 'Member not found')));
GET('/members/:id/history', (c) => {
  const m = find.member(c.params.id) || fail(404, 'Member not found');
  const sess = db.bills.filter((b) => b.memberId === m.id || b.customerName === m.fullName).slice(0, 8).map((b) => ({ id: b.id, type: 'Session', timestamp: b.createdAt, branchId: b.branchId, branchName: db.branches.find((x) => x.id === b.branchId)?.name, pcName: b.pcNumber, durationMinutes: 60, amount: b.totalAmount, description: `Gaming session on ${b.pcNumber}` }));
  const tx = db.walletTx.filter((t) => t.memberId === m.id).map((t) => ({ id: t.id, type: t.action === 'TopUp' ? 'WalletTopUp' : 'WalletDeduction', timestamp: t.createdAt, branchId: t.branchId, branchName: db.branches.find((x) => x.id === t.branchId)?.name || '', pcName: null, durationMinutes: null, amount: t.amount, description: t.action === 'TopUp' ? `Wallet top-up (${t.paymentType})` : (t.reason || 'Wallet deduction') }));
  return ok([...sess, ...tx].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
});
GET('/members/:id', (c) => ok(find.member(c.params.id) || fail(404, 'Member not found')));
POST('/members', (c) => {
  if (db.members.some((m) => m.mobileNumber === c.body.mobileNumber)) fail(409, 'A member with this mobile number already exists.');
  const m = { id: uid('mem'), memberNumber: `AE-${1001 + db.members.length}`, fullName: c.body.fullName, mobileNumber: c.body.mobileNumber, email: c.body.email, username: c.body.username || null, hasPassword: !!c.body.password, status: 'Active', gamingBalance: 0, foodBalance: 0, totalGamingTopUps: 0, totalGamingBonusEarned: 0, totalGamingSpend: 0, totalFoodSpend: 0, gamingPoints: 0, foodPoints: 0, totalPoints: 0, joinDate: iso(), lastVisit: null, homeBranchName: db.branches.find((b) => b.id === branchOf(c))?.name || 'Adajan', homeBranchId: branchOf(c) };
  db.members.unshift(m); return ok(m);
});
PUT('/members/:id', (c) => ok(Object.assign(find.member(c.params.id) || fail(404, 'Member not found'), c.body)));
PUT('/members/:id/admin-edit', (c) => ok(Object.assign(find.member(c.params.id) || fail(404, 'Member not found'), Object.fromEntries(Object.entries(c.body).filter(([, v]) => v != null)))));
DEL('/members/:id', (c) => { const m = find.member(c.params.id); if (m) m.status = 'Deleted'; return ok({}); });
GET('/wallets/:id', (c) => ok(page(db.walletTx.filter((t) => t.memberId === c.params.id), c.query.page, c.query.pageSize || 30)));
POST('/wallets/:id/topup', (c) => {
  const m = find.member(c.params.id) || fail(404, 'Member not found'); const amt = Number(c.body.amount);
  const bonus = c.body.isBonusOnly ? amt : Math.round((amt * (c.body.bonusPercentOverride ?? 10)) / 100);
  const key = c.body.targetWallet === 'Food' || c.body.targetWallet === 1 ? 'foodBalance' : 'gamingBalance'; const before = m[key];
  m[key] += (c.body.isBonusOnly ? 0 : amt) + (key === 'gamingBalance' ? bonus : 0);
  if (key === 'gamingBalance') { m.totalGamingTopUps += amt; m.totalGamingBonusEarned += bonus; }
  const tx = { id: uid('wt'), memberId: m.id, action: 'TopUp', targetWallet: key === 'gamingBalance' ? 'Gaming' : 'Food', amount: amt, bonusAmount: key === 'gamingBalance' ? bonus : 0, balanceBefore: before, balanceAfter: m[key], paymentType: c.body.paymentType, reason: c.body.reason || null, createdAt: iso(), branchId: branchOf(c) };
  db.walletTx.unshift(tx);
  logActivity(branchOf(c), 'WalletTopUp', `${m.fullName}: wallet top-up ₹${amt}`, { amount: amt, paymentMethod: c.body.paymentType });
  return ok(tx);
});
POST('/wallets/:id/deduct', (c) => {
  const m = find.member(c.params.id) || fail(404, 'Member not found'); const amt = Number(c.body.amount);
  const key = c.body.targetWallet === 'Food' || c.body.targetWallet === 1 ? 'foodBalance' : 'gamingBalance';
  if (m[key] < amt) fail(400, 'Insufficient wallet balance.');
  const before = m[key]; m[key] -= amt;
  const tx = { id: uid('wt'), memberId: m.id, action: 'Deduct', targetWallet: key === 'gamingBalance' ? 'Gaming' : 'Food', amount: amt, bonusAmount: 0, balanceBefore: before, balanceAfter: m[key], paymentType: null, reason: c.body.reason, createdAt: iso(), branchId: branchOf(c) };
  db.walletTx.unshift(tx); return ok(tx);
});

// Dashboard
GET('/dashboard/summary', (c) => ok(dashboardSummary(branchOf(c))));
GET('/dashboard/transactions', (c) => ok(inBranch(db.activities, c).slice(0, 30).map((a) => ({ id: a.id, type: a.type, description: a.description, amount: a.amount ?? null, paymentMethod: a.paymentMethod ?? null, category: a.type.startsWith('Payment') ? 'Financial' : a.type.startsWith('Food') ? 'Food' : 'Gaming', operatorName: 'Rahul Solanki', branchId: a.branchId, branchName: db.branches.find((b) => b.id === a.branchId)?.name, timestamp: a.timestamp }))));
GET('/dashboard/branches-summary', () => ok(db.branches.map((b) => { const s = dashboardSummary(b.id); const pcs = db.pcs.filter((p) => p.branchId === b.id); return { branchId: b.id, branchName: b.name, totalPcs: pcs.length, activePcs: s.totalActivePcs, idlePcs: pcs.filter((p) => p.state === 'Idle').length, activeOperator: db.operators.find((o) => o.branchId === b.id)?.fullName || 'None', assignedOperatorsCount: 2, totalSales: s.totalRevenueToday, gamingSales: s.gamingRevenueToday, foodSales: s.foodRevenueToday, cashInDrawer: s.cashTotals }; })));

// Settings: pricing profiles
GET('/pricing-profiles', (c) => ok(inBranch(db.profiles, c)));

// ── Cash register ────────────────────────────────────────────────────────────
const ymd = (d) => new Date(d).toISOString().slice(0, 10);
function registerFor(branchId) {
  if (!db.registers[branchId]) {
    db.registers[branchId] = { id: uid('reg'), shiftId: 'shift-demo-1', branchId, operatorId: 'op-1', openingBalance: 2000, defaultOpeningFloat: 2000, status: 'Open', openedAt: new Date(Date.now() - 3 * 3600e3).toISOString(), verifiedAt: null, closedAt: null, physicalCashCounted: null, cashDifference: null, mismatchReason: null, coverAmount: null, nextDayOpeningBalance: null, nextDayFloatReason: null };
    const base = db.bills.filter((b) => b.branchId === branchId && b.status === 'Completed' && isToday(b.createdAt));
    base.forEach((b) => { const cash = b.payments.reduce((x, p) => x + p.cashAmount, 0); if (cash > 0) db.cashTx[branchId].push({ id: uid('ct'), billId: b.id, pcNumber: b.pcNumber, cashAmount: cash, cashReceived: cash, changeReturned: 0, actualCashCollected: cash, gamingAmount: b.gamingAmount, foodAmount: b.foodAmount, transactionType: 'bill_payment', customerName: b.customerName, createdAt: b.createdAt }); });
  }
  return db.registers[branchId];
}
const cashTotals = (branchId) => {
  const tx = db.cashTx[branchId] || [];
  const sales = tx.filter((t) => t.transactionType === 'bill_payment').reduce((x, t) => x + t.cashAmount, 0);
  const inward = tx.filter((t) => t.transactionType === 'inward').reduce((x, t) => x + t.cashAmount, 0);
  const out = tx.filter((t) => ['petty_expense', 'withdrawal'].includes(t.transactionType)).reduce((x, t) => x + t.cashAmount, 0);
  return { sales, inward, out };
};
const registerDto = (branchId) => {
  const r = registerFor(branchId); const t = cashTotals(branchId);
  return { ...r, totalCashSales: t.sales, totalSplitCash: 0, expectedDrawerCash: r.openingBalance + t.sales + t.inward - t.out, transactions: [...(db.cashTx[branchId] || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) };
};
const reqBranch = (c) => branchOf(c) || 'br-adajan';
GET('/cash/opening', (c) => { const r = db.registers[reqBranch(c)]; return ok({ isFirstOfDay: r?.status === 'Closed', inheritedBalance: 2000, alreadyOpen: !!r && r.status !== 'Closed', defaultOpeningFloat: 2000 }); });
POST('/cash/open', (c) => { const b = reqBranch(c); db.registers[b] = null; const r = registerFor(b); r.openingBalance = Number(c.body.openingBalance); return ok({ opened: true, register: registerDto(b) }); });
GET('/cash/active', (c) => ok(registerDto(reqBranch(c))));
POST('/cash/transactions', (c) => {
  const b = reqBranch(c); const amt = Number(c.body.amount);
  db.cashTx[b].unshift({ id: uid('ct'), billId: null, pcNumber: null, cashAmount: amt, cashReceived: amt, changeReturned: 0, actualCashCollected: amt, gamingAmount: 0, foodAmount: 0, transactionType: c.body.transactionType, customerName: c.body.reason, createdAt: iso() });
  logAudit(b, 'cash_transaction', `${c.body.transactionType} ₹${amt} — ${c.body.reason}`); bus.emit('/hubs/cash', 'CashRegisterUpdated'); return ok(registerDto(b));
});
POST('/cash-desk/verify-start', (c) => { const r = registerFor(reqBranch(c)); r.status = 'Verifying'; return ok(registerDto(reqBranch(c))); });
POST('/cash-desk/denomination', (c) => {
  const b = reqBranch(c); const r = registerFor(b); const d = c.body;
  const counted = d.notes2000 * 2000 + d.notes500 * 500 + d.notes200 * 200 + d.notes100 * 100 + d.notes50 * 50 + d.notes20 * 20 + d.notes10 * 10 + d.coins5 * 5 + d.coins2 * 2 + d.coins1;
  const dto = registerDto(b); r.status = 'Verified'; r.verifiedAt = iso(); r.physicalCashCounted = counted; r.cashDifference = counted - dto.expectedDrawerCash; r.mismatchReason = d.mismatchReason || null;
  return ok({ ...registerDto(b), countedTotal: counted, expectedTotal: dto.expectedDrawerCash, difference: counted - dto.expectedDrawerCash, isVerified: true });
});
POST('/cash-desk/cancel-verification/:id', (c) => { const r = registerFor(reqBranch(c)); r.status = 'Open'; return ok(registerDto(reqBranch(c))); });
POST('/cash-desk/close/:id', (c) => { const r = registerFor(reqBranch(c)); r.status = 'Closed'; r.closedAt = iso(); Object.assign(r, { coverAmount: c.body?.coverAmount ?? null, nextDayOpeningBalance: c.body?.nextDayOpeningBalance ?? null }); return ok(registerDto(reqBranch(c))); });
POST('/cash-desk/reopen-day', (c) => { const r = registerFor(reqBranch(c)); r.status = 'Open'; r.closedAt = null; return ok(registerDto(reqBranch(c))); });
GET('/reports/cash-reconciliation', (c) => {
  const b = reqBranch(c); const names = ['Rahul Solanki', 'Neha Patel'];
  return ok(Array.from({ length: 6 }, (_, i) => { const exp = 4200 + i * 310; const diff = i === 2 ? -50 : 0; return { shiftId: uid('sh'), cashRegisterId: uid('reg'), operatorName: names[i % 2], status: 'Verified', openedAt: new Date(Date.now() - (i + 1) * 86400e3).toISOString(), closedAt: new Date(Date.now() - (i + 1) * 86400e3 + 9 * 3600e3).toISOString(), expectedDrawerCash: exp, physicalCashCounted: exp + diff, difference: diff, mismatchReason: diff ? 'Short on change' : '', isVerified: true, notes2000: 1, notes500: 4, notes200: 5, notes100: 10, notes50: 6, notes20: 10, notes10: 5, coins5: 4, coins2: 5, coins1: 8, branchId: b }; }));
});

// System desks (ledgers)
GET('/system-desks/cash/active', (c) => { const t = cashTotals(reqBranch(c)); return ok({ shiftId: 'shift-demo-1', fromDate: c.query.fromDate, toDate: c.query.toDate, totalCashSales: t.sales, transactions: [...(db.cashTx[reqBranch(c)] || [])] }); });
GET('/system-desks/online/active', (c) => {
  const b = reqBranch(c); const tx = db.bills.filter((x) => x.branchId === b && x.status === 'Completed').flatMap((x) => x.payments.filter((p) => p.onlineAmount > 0).map((p) => ({ id: p.id, timestamp: p.createdAt, description: `${x.pcNumber || 'Counter'} — ${x.customerName}`, amount: p.onlineAmount, paymentMethod: 'UPI' })));
  return ok({ shiftId: 'shift-demo-1', totalOnlineSales: tx.reduce((x, t) => x + t.amount, 0), transactions: tx.sort((a, b2) => new Date(b2.timestamp) - new Date(a.timestamp)) });
});
GET('/system-desks/wallet/active', (c) => {
  const b = reqBranch(c); const tx = db.walletTx.filter((t) => t.branchId === b).map((t) => ({ id: t.id, timestamp: t.createdAt, description: `${find.member(t.memberId)?.fullName || 'Member'} — ${t.action === 'TopUp' ? 'Wallet top-up' : (t.reason || 'Deduction')}`, amount: t.amount, action: t.action === 'TopUp' ? 'TopUp' : 'Deduction', pcName: null, durationMinutes: null }));
  return ok({ shiftId: 'shift-demo-1', fromDate: c.query.fromDate, toDate: c.query.toDate, totalWalletTopUps: tx.filter((t) => t.action === 'TopUp').reduce((x, t) => x + t.amount, 0), totalWalletDeductions: tx.filter((t) => t.action !== 'TopUp').reduce((x, t) => x + t.amount, 0), transactions: tx });
});

// Credits
GET('/credits', (c) => { const st = c.query.status; const rows = inBranch(db.credits, c).filter((x) => !st || st === 'All' || x.status.toLowerCase() === String(st).toLowerCase()); return ok(page(rows, 1, 100)); });
POST('/credits/:id/clear', (c) => { const cr = db.credits.find((x) => x.id === c.params.id) || fail(404, 'Credit not found'); cr.status = 'Cleared'; cr.clearedAt = iso(); return ok(cr); });

// Reservations
GET('/reservations', (c) => ok(page(db.reservations.filter((r) => r.state === 'Active' || r.state === 'Reserved'), 1, 100)));
GET('/reservations/history', () => ok(db.reservations));
GET('/reservations/:id', (c) => ok(db.reservations.find((r) => r.id === c.params.id) || fail(404, 'Not found')));
POST('/reservations', (c) => { const pc = find.pc(c.body.pcId) || fail(404, 'PC not found'); const r = { id: uid('res'), pcId: pc.id, pcName: pc.name, customerName: c.body.customerName, memberId: c.body.memberId || null, reservationTime: c.body.reservationTime, durationMin: c.body.durationMin || 60, state: 'Active', notes: c.body.notes, advanceDeposit: Number(c.body.advanceDepositCash || 0) + Number(c.body.advanceDepositOnline || 0), gracePeriodMin: c.body.gracePeriodMin || 15, arrived: false, branchId: pc.branchId }; db.reservations.unshift(r); bus.emit('/hubs/reservations', 'ReservationUpdated'); return ok(r); });
POST('/reservations/:id/cancel', (c) => { const r = db.reservations.find((x) => x.id === c.params.id); if (r) r.state = 'Cancelled'; bus.emit('/hubs/reservations', 'ReservationUpdated'); return ok(r); });
PUT('/reservations/:id/arrived', (c) => { const r = db.reservations.find((x) => x.id === c.params.id); if (r) r.arrived = !!c.body.arrived; return ok(r); });
DEL('/reservations/:id', (c) => { db.reservations = db.reservations.filter((x) => x.id !== c.params.id); return ok({}); });

// End of day
function eodFor(branchId) {
  const bills = db.bills.filter((b) => b.branchId === branchId && b.status === 'Completed' && isToday(b.createdAt));
  const pays = bills.flatMap((b) => b.payments);
  const cash = pays.reduce((x, p) => x + p.cashAmount, 0), online = pays.reduce((x, p) => x + p.onlineAmount, 0), wallet = pays.reduce((x, p) => x + p.walletAmount, 0);
  const gaming = bills.reduce((x, b) => x + b.gamingAmount, 0), food = bills.reduce((x, b) => x + b.foodAmount, 0), disc = bills.reduce((x, b) => x + b.discountAmount, 0);
  const ct = cashTotals(branchId); const reg = registerFor(branchId); const topups = db.walletTx.filter((t) => t.branchId === branchId && t.action === 'TopUp' && isToday(t.createdAt));
  return {
    branchId, reportDate: iso(), generatedAt: iso(),
    revenue: { totalGamingRevenue: gaming, totalFoodRevenue: food, totalDiscounts: disc, netRevenue: gaming + food - disc },
    cash: { totalOpeningBalance: reg.openingBalance, totalCashSales: ct.sales, totalCashInwards: ct.inward, totalPettyExpenses: ct.out, totalOwnerWithdrawals: 0, expectedCashInDrawer: reg.openingBalance + ct.sales + ct.inward - ct.out, actualPhysicalCashCounted: reg.physicalCashCounted, totalDiscrepancy: reg.cashDifference, differencesFoundEarlier: 0, coverAmount: reg.coverAmount },
    paymentMethods: { totalCash: cash, totalOnline: online, totalWalletDeductions: wallet, totalWalletTopUps: topups.reduce((x, t) => x + t.amount, 0), totalWalletBonusGiven: topups.reduce((x, t) => x + t.bonusAmount, 0), totalWalletTopUpsCash: topups.filter((t) => t.paymentType === 'Cash').reduce((x, t) => x + t.amount, 0), totalWalletTopUpsOnline: topups.filter((t) => t.paymentType !== 'Cash').reduce((x, t) => x + t.amount, 0), totalCollected: cash + online + wallet },
    reconciliation: { grossBilled: gaming + food, discounts: disc, creditGivenToday: 0, creditClearedToday: 0, shouldHaveBeenCollected: gaming + food - disc, actuallySettled: cash + online + wallet, difference: 0 },
    shifts: { totalShifts: 2, shiftDetails: [{ shiftId: 'shift-demo-1', operatorId: 'op-1', operatorName: 'Rahul Solanki', totalSales: gaming + food - disc, cashDiscrepancy: 0 }] },
    operations: { totalSessions: bills.length + db.sessions.filter((x) => x.branchId === branchId && x.status === 'Active').length, totalReservations: db.reservations.filter((r) => r.branchId === branchId).length, totalFoodOrders: db.foodOrders.filter((o) => o.branchId === branchId).length + 4, newMembersRegistered: 2 },
    creditLogs: db.credits.filter((x) => x.branchId === branchId).map((x) => ({ creditId: x.id, customerName: x.customerName, customerPhone: x.customerPhone, pcNumber: 'ADA-04', originalBillAmount: x.amount, amountPaidInitially: 0, creditAmount: x.amount, status: x.status, createdAt: x.createdAt, clearedAt: x.clearedAt || null })),
  };
}
GET('/eod/preview', (c) => ok(eodFor(reqBranch(c))));
GET('/eod/range-report', (c) => {
  const b = reqBranch(c); const bills = db.bills.filter((x) => x.branchId === b && x.status === 'Completed');
  const allBills = bills.map((x) => { const p = x.payments[0]; return { id: x.id, billId: x.id, realBillId: x.id, date: x.createdAt, pcId: x.pcId, pcName: x.pcNumber, sessionStartTime: new Date(new Date(x.createdAt).getTime() - 3600e3).toISOString(), sessionEndTime: x.createdAt, customer: x.customerName, paymentType: p?.paymentType || 'Cash', gamingRevenue: x.gamingAmount, foodRevenue: x.foodAmount, discount: x.discountAmount, totalRevenue: x.totalAmount, clearedCashAmount: 0, clearedOnlineAmount: 0, operator: 'Rahul Solanki', sessionNotes: '' }; });
  const todayRow = { date: ymd(new Date()), gamingRevenue: allBills.reduce((s, x) => s + x.gamingRevenue, 0), foodRevenue: allBills.reduce((s, x) => s + x.foodRevenue, 0), discountAmount: allBills.reduce((s, x) => s + x.discount, 0), totalRevenue: allBills.reduce((s, x) => s + x.totalRevenue, 0) };
  // Earlier days are synthetic but deterministic, so the trend chart looks like a real week/month.
  const hist = Array.from({ length: 29 }, (_, i) => { const dow = new Date(Date.now() - (i + 1) * 86400e3).getDay(); const lift = dow === 0 || dow === 6 ? 1.45 : 1; const gaming = Math.round((5200 + ((i * 731) % 1900)) * lift); const food = Math.round(gaming * (0.22 + ((i * 7) % 5) / 100)); const disc = (i * 53) % 240; return { date: ymd(Date.now() - (i + 1) * 86400e3), gamingRevenue: gaming, foodRevenue: food, discountAmount: disc, totalRevenue: gaming + food - disc }; });
  const daily = [...hist.reverse(), todayRow];
  const monthly = ['2026-08', '2026-09', '2026-10'].map((m, i) => { const g = 150000 + i * 9000; const f = Math.round(g * 0.25); return { month: m, gamingRevenue: g, foodRevenue: f, totalRevenue: g + f }; });
  const discounts = [{ billId: 'AD-1', date: new Date().toISOString(), discountAmount: 30, discountReason: 'Regular customer', discountType: 'Percentage', discountValue: 10, givenBy: 'Owner (Super Admin)', subtotal: 300 }];
  return ok({ allBills, downtime: [], shifts: [{ id: 'shift-demo-1', operatorName: 'Rahul Solanki', loginTime: new Date(Date.now() - 4 * 3600e3).toISOString(), logoutTime: null }], daily, monthly, discounts, allCredits: db.credits.filter((x) => x.branchId === b).map((x) => ({ creditId: x.id, customerName: x.customerName, customerPhone: x.customerPhone, pcNumber: 'ADA-04', originalBillAmount: x.amount, amountPaidInitially: 0, creditAmount: x.amount, status: x.status, createdAt: x.createdAt })) });
});

// Admin / settings
GET('/audit-logs', (c) => {
  const rows = db.audit.concat([
    { action: 'login', userName: 'Rahul Solanki', userRole: 'operator', details: null }, { action: 'cash_opening', userName: 'Rahul Solanki', userRole: 'operator', details: null },
    { action: 'wallet_recharge', userName: 'Neha Patel', userRole: 'operator', details: JSON.stringify({ Amount: 1000, PaymentType: 'Online' }) },
    { action: 'session_start', userName: 'Rahul Solanki', userRole: 'operator', details: JSON.stringify({ PcNumber: 'ADA-04', DurationMinutes: 60, ExpectedAmount: 60 }) },
    { action: 'discount_apply', userName: 'Demo Admin', userRole: 'admin', details: JSON.stringify({ DiscountType: 'Percentage', Value: 10, Reason: 'Regular customer' }) },
    { action: 'payment_process', userName: 'Rahul Solanki', userRole: 'operator', details: JSON.stringify({ PaymentType: 'Cash', Total: 180 }) },
  ].map((r, i) => ({ id: uid('aud'), success: true, targetType: 'Session', targetId: null, ipAddress: '192.168.1.20', createdAt: new Date(Date.now() - (i + 1) * 17 * 60000).toISOString(), branchName: 'Adajan', ...r })));
  return ok(page(rows.map((r) => ({ success: true, userRole: 'operator', userName: r.userName || 'Demo User', branchName: 'Adajan', details: null, createdAt: r.createdAt || r.timestamp, id: r.id, action: r.action, targetType: r.targetType || null, targetId: null, ipAddress: '192.168.1.20' })), c.query.page, c.query.pageSize));
});
GET('/branches', () => ok(db.branches));
GET('/operators', () => ok(db.operators.map((o) => ({ ...o, branchName: db.branches.find((b) => b.id === o.branchId)?.name, email: `${o.username}@demo.arenaos.app` }))));
GET('/admins', () => ok([{ id: 'ad-1', fullName: 'Demo Admin', email: 'admin@demo.arenaos.app', username: 'admin', status: 'Active', role: 'admin', branchIds: db.branches.map((b) => b.id) }]));
GET('/pcs/details', (c) => ok(inBranch(db.pcs, c).map(toPcDto)));
GET('/system-config', () => ok([]));
GET('/wallet-settings', () => ok({ minGamingTopUp: 100, defaultBonusPercent: 10 }));
GET('/employees', (c) => ok(page([], 1, 100)));
GET('/health', () => ok({ status: 'Healthy', database: 'Connected' }));
GET('/versions/running', () => ok({ version: '2.8.4', isLatest: true }));
GET('/pc-management/maintenance-logs/branch/:id', (c) => ok(db.maintenance.filter((m) => m.branchId === c.params.id)));
POST('/pc-management/maintenance-logs/mark', (c) => { const pc = find.pc(c.body.pcId) || fail(404, 'PC not found'); pc.state = 'UnderMaintenance'; db.maintenance.unshift({ id: uid('ml'), pcId: pc.id, pcName: pc.name, branchId: pc.branchId, reason: c.body.reason, markedAt: iso(), resolvedAt: null }); pcEvt(); return ok({}); });
POST('/pc-management/maintenance-logs/resolve/:id', (c) => { const pc = find.pc(c.params.id); if (pc) pc.state = 'Idle'; db.maintenance.forEach((m) => { if (m.pcId === c.params.id && !m.resolvedAt) m.resolvedAt = iso(); }); pcEvt(); return ok({}); });


// ── Dispatcher ───────────────────────────────────────────────────────────────
export async function demoAdapter(config) {
  const url = new URL(config.url, 'http://demo.local');
  const path = url.pathname.replace(/^\/api/, '');
  const query = { ...Object.fromEntries(url.searchParams), ...(config.params || {}) };
  let body = config.data; if (typeof body === 'string') { try { body = JSON.parse(body); } catch { /* leave */ } }
  const method = (config.method || 'get').toUpperCase();
  const headers = config.headers?.toJSON ? config.headers.toJSON() : { ...(config.headers || {}) };
  const ctx = { query, body: body || {}, headers: { 'X-Branch-Id': headers['X-Branch-Id'] }, params: {} };

  await new Promise((r) => setTimeout(r, 60 + Math.random() * 90)); // feel like a network
  let status = 200, payload;
  try {
    const r = routes.find((x) => x.method === method && x.rx.test(path));
    if (r) { const m = path.match(r.rx); r.keys.forEach((k, i) => { ctx.params[k] = decodeURIComponent(m[i + 1]); }); payload = r.fn(ctx); }
    else {
      console.warn(`[demo] unmocked ${method} ${path}`);
      payload = ok(method === 'GET' ? [] : {});
    }
  } catch (e) {
    if (!(e instanceof HttpError)) { console.error('[demo] handler error', method, path, e); status = 500; payload = { success: false, error: 'Demo handler error' }; }
    else { status = e.status; payload = e.body; }
  }
  const response = { data: payload, status, statusText: String(status), headers: {}, config, request: {} };
  if (status >= 400) throw new AxiosError(payload.error || 'Request failed', 'ERR_BAD_REQUEST', config, {}, response);
  return response;
}
