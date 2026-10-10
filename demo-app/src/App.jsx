// ═══════════════════════════════════════════════════════════
// Gaming Café ERP — Main App with Complete Routing
// SOP §5: Role hierarchy → route protection
// SOP §19.2: Dashboard-level permission control
// ═══════════════════════════════════════════════════════════

import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { BranchProvider } from './contexts/BranchContext';
import { ActivityLogProvider } from './contexts/ActivityLogContext';
import { ToastProvider } from './components/ui/Toast';
import { TourProvider } from './components/tour/TourContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import { ROLES, DASHBOARDS } from './config/constants';

import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import LandingGatewayPage from './pages/public/LandingGatewayPage';
import DemoGate, { DemoLockedPage } from './components/layout/DemoGate';
import { firstOpenRoute } from './config/demoAccess';

// ── Pages open in the demo (lazy: each role only downloads what it is allowed to open) ──
const SessionsPage = lazy(() => import('./pages/sessions/SessionsPage'));
const BillingCounterPage = lazy(() => import('./pages/billing/BillingCounterPage'));
const FoodOrdersPage = lazy(() => import('./pages/food/FoodOrdersPage'));
const MembersPage = lazy(() => import('./pages/members/MembersPage'));
const MainDashboardPage = lazy(() => import('./pages/dashboard/MainDashboardPage'));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const AuditTrailPage = lazy(() => import('./pages/admin/AuditTrailPage'));

// Locked in the demo for every role: not imported at all, so none of their code is shipped.
const LOCKED_ROUTES = [
  'reservations', 'cash-register', 'cash-desk', 'online-desk', 'credits', 'wallet-desk', 'eod',
  'menu-editor', 'pc-status', 'updates', 'employee-forms',
];

// ── End of imports ──
function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={firstOpenRoute(user?.role)} replace />;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AuthProvider>
        <ActivityLogProvider>
          <SocketProvider>
            <BranchProvider>
              <ToastProvider>
              <TourProvider>
              <Routes>
                {/* ══════════ Public Routes ══════════ */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* ══════════ Protected App Shell ══════════ */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR]}>
                      <AppShell />
                    </ProtectedRoute>
                  }
                >
                  {/* Default redirect based on role */}
                  <Route index element={<HomeRedirect />} />

                  {/* ── Operations Dashboards ── */}
                  <Route
                    path="billing"
                    element={
                      <ProtectedRoute dashboardKey={DASHBOARDS.BILLING_COUNTER}>
                        <DemoGate route="billing"><BillingCounterPage /></DemoGate>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="sessions"
                    element={
                      <ProtectedRoute dashboardKey={DASHBOARDS.SESSIONS}>
                        <DemoGate route="sessions"><SessionsPage /></DemoGate>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="food-orders"
                    element={
                      <ProtectedRoute dashboardKey={DASHBOARDS.FOOD_ORDERS}>
                        <DemoGate route="food-orders"><FoodOrdersPage /></DemoGate>
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Finance Dashboards ── */}

                  {/* ── Management Dashboards ── */}
                  <Route
                    path="members"
                    element={
                      <ProtectedRoute dashboardKey={DASHBOARDS.MEMBERS}>
                        <DemoGate route="members"><MembersPage /></DemoGate>
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Admin Only Dashboards ── */}
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR]}>
                        <DemoGate route="dashboard"><MainDashboardPage /></DemoGate>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="reports"
                    element={
                      <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} dashboardKey={DASHBOARDS.REPORTS}>
                        <DemoGate route="reports"><ReportsPage /></DemoGate>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} dashboardKey={DASHBOARDS.SETTINGS}>
                        <DemoGate route="settings"><SettingsPage /></DemoGate>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="audit-trail"
                    element={
                      <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} dashboardKey={DASHBOARDS.SETTINGS}>
                        <DemoGate route="audit-trail"><AuditTrailPage /></DemoGate>
                      </ProtectedRoute>
                    }
                  />

                  {LOCKED_ROUTES.map((path) => (
                    <Route key={path} path={path} element={<DemoLockedPage route={path} />} />
                  ))}

                  {/* Catch-all inside /app */}
                  <Route path="*" element={<NotFoundPage />} />

                  {/* ── HR Module ── */}
                </Route>

                {/* ══════════ Root Redirects ══════════ */}
                <Route path="/" element={<LandingGatewayPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </TourProvider>
              </ToastProvider>
            </BranchProvider>
          </SocketProvider>
        </ActivityLogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
