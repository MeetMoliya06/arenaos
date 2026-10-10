import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isOpenInDemo, firstOpenRoute, PAGE_LABELS } from '../../config/demoAccess';

export function DemoLockedPage({ route }) {
  const { user } = useAuth();
  const label = PAGE_LABELS[route] || 'This section';
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-full border border-accent/40 bg-accent/10 flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-accent" />
      </div>
      <h2 className="font-heading text-2xl font-bold text-text mb-2">{label} is locked in the demo</h2>
      <p className="text-text-2 text-base max-w-md leading-relaxed mb-7">
        The live demo opens only the guided sections. Get ArenaOS to unlock every module for your café.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to={firstOpenRoute(user?.role)}
          className="px-5 py-2.5 rounded-lg border border-border text-text-2 hover:text-text text-sm font-semibold uppercase tracking-wider"
        >
          Back to demo
        </Link>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-accent text-black text-sm font-bold uppercase tracking-wider hover:opacity-90"
        >
          Get ArenaOS <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

const Loading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
  </div>
);

// Wraps a lazily imported page. The page is only rendered (and so only downloaded) for roles the
// demo opens it to.
export default function DemoGate({ route, children }) {
  const { user } = useAuth();
  if (!isOpenInDemo(user?.role, route)) return <DemoLockedPage route={route} />;
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
