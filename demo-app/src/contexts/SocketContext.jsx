// ═══════════════════════════════════════════════════════════
// Demo build — SignalR replaced by an in-browser event bus.
// Same API surface as the production SocketContext so pages are unchanged.
// ═══════════════════════════════════════════════════════════

import { createContext, useContext, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { bus } from '../mock/bus';

const SocketContext = createContext(null);

export const SIGNALR_HUBS = {
  NOTIFICATIONS: '/hubs/notifications',
  PC_STATUS: '/hubs/pc-status',
  SESSIONS: '/hubs/sessions',
  RESERVATIONS: '/hubs/reservations',
  FOOD_ORDERS: '/hubs/food-orders',
  BILLING: '/hubs/billing',
  CASH: '/hubs/cash',
  DASHBOARD: '/hubs/dashboard',
};

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const connected = isAuthenticated;

  const hubStatus = useMemo(
    () => Object.fromEntries(Object.values(SIGNALR_HUBS).map((h) => [h, isAuthenticated])),
    [isAuthenticated]
  );
  const getHub = useCallback(() => null, []);
  const subscribe = useCallback((hub, event, handler) => bus.on(hub, event, handler), []);
  const emit = useCallback(async () => undefined, []);
  const isHubUp = useCallback((hub) => hubStatus[hub] === true, [hubStatus]);

  const value = { connected, hubStatus, isHubUp, getHub, subscribe, emit, SIGNALR_HUBS };
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
}

export default SocketContext;
