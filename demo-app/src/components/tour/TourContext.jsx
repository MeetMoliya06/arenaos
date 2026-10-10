import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { stepsFor } from './tourSteps';
import TourOverlay from './TourOverlay';

// Guided tour is strictly opt-in: it only runs when the visitor ticked the option on the landing
// page or pressed "Tour" in the demo bar. State lives in sessionStorage so it survives the
// full-page navigation from the landing page into /app, and is gone when the tab closes.
const KEY = 'arenaos_tour';

const TourContext = createContext(null);
export const useTour = () => useContext(TourContext);

const read = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { return null; }
};
const write = (v) => {
  try { v ? sessionStorage.setItem(KEY, JSON.stringify(v)) : sessionStorage.removeItem(KEY); } catch { /* storage blocked */ }
};

// Used by the landing page, which sits outside the provider.
export const armTour = () => write({ step: 0 });

export function TourProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [state, setState] = useState(read); // { step } | null

  const steps = useMemo(() => stepsFor(user?.role), [user?.role]);
  const step = state ? steps[state.step] : null;
  const active = !!(user && step && pathname.startsWith('/app'));

  const goTo = useCallback((i) => {
    if (i >= steps.length) { write(null); setState(null); return; }
    write({ step: i });
    setState({ step: i });
    const route = steps[i].route;
    if (route) navigate(route);
  }, [steps, navigate]);

  const start = useCallback(() => goTo(0), [goTo]);
  const stop = useCallback(() => { write(null); setState(null); }, []);
  const next = useCallback(() => state && goTo(state.step + 1), [state, goTo]);
  const back = useCallback(() => state && state.step > 0 && goTo(state.step - 1), [state, goTo]);

  // A 'route' step finishes when the visitor lands on the page it points at.
  useEffect(() => {
    if (state && step?.advance === 'route' && pathname === step.nextRoute) goTo(state.step + 1);
  }, [pathname, state, step, goTo]);

  const value = useMemo(
    () => ({ active, enabled: !!state, start, stop, next, back, index: state?.step ?? 0, total: steps.length, step }),
    [active, state, start, stop, next, back, steps.length, step],
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {active && <TourOverlay />}
    </TourContext.Provider>
  );
}
