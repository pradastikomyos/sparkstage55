import { useEffect, useRef, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '@/pages/Home';
import ProductList from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import EntranceTicket from '@/pages/EntranceTicket';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Cart from '@/pages/Cart';
import StageTicket from '@/pages/StageTicket';
import Checkout from '@/pages/Checkout';
import EventPage from '@/pages/Event';
import FashionPage from '@/pages/Fashion';
import BeautyPage from '@/pages/Beauty';
import SparkClubPage from '@/pages/SparkClub';
import RootLayout from '@/components/layout/RootLayout';
import PaymentPage from '@/pages/PaymentPage';
import BookingSuccessPage from '@/pages/BookingSuccessPage';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionRefresh } from '@/hooks/useSessionRefresh';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';

const TAB_RETURN_EVENT = 'tab-returned-from-idle';
const TAB_IDLE_THRESHOLD_MS = 2 * 60 * 1000;

function AppLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-500 mx-auto"></div>
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const { initialized } = useAuth();
  if (!initialized) return <AppLoadingScreen />;
  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();
  const wrap = (node: ReactNode) => node;
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/login" element={wrap(<Login />)} />
      <Route path="/register" element={wrap(<Register />)} />
      <Route path="/checkout" element={wrap(<ProtectedRoute><Checkout /></ProtectedRoute>)} />
      <Route path="/payment/:id" element={wrap(<ProtectedRoute><PaymentPage /></ProtectedRoute>)} />
      <Route path="/booking-success" element={wrap(<ProtectedRoute><BookingSuccessPage /></ProtectedRoute>)} />
      <Route path="/" element={wrap(<Home />)} />
      <Route path="/products" element={wrap(<ProductList />)} />
      <Route path="/products/:slug" element={wrap(<ProductDetail />)} />
      <Route path="/tickets/entrance" element={wrap(<EntranceTicket />)} />
      <Route path="/cart" element={wrap(<Cart />)} />
      <Route path="/tickets/stage/:slug" element={wrap(<StageTicket />)} />
      <Route path="/event" element={wrap(<EventPage />)} />
      <Route path="/fashion" element={wrap(<FashionPage />)} />
      <Route path="/beauty" element={wrap(<BeautyPage />)} />
      <Route path="/spark-club" element={wrap(<SparkClubPage />)} />
    </Routes>
  );
}

function AppContent() {
  const hiddenAtRef = useRef<number | null>(null);
  const refreshInFlightRef = useRef(false);
  const lastActiveAtRef = useRef(Date.now());

  useSessionRefresh();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleIdleReturn = async (hiddenAt: number) => {
      const idleDuration = Date.now() - hiddenAt;
      if (idleDuration < TAB_IDLE_THRESHOLD_MS) return;
      if (refreshInFlightRef.current) return;

      refreshInFlightRef.current = true;
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        refreshInFlightRef.current = false;
        return;
      }

      const { error } = await supabase.auth.refreshSession();
      if (error) {
        refreshInFlightRef.current = false;
        return;
      }
      window.dispatchEvent(
        new CustomEvent(TAB_RETURN_EVENT, {
          detail: { idleDuration },
        })
      );
      refreshInFlightRef.current = false;
    };

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
        return;
      }

      const hiddenAt = hiddenAtRef.current;
      hiddenAtRef.current = null;
      if (!hiddenAt) return;

      await handleIdleReturn(hiddenAt);
      lastActiveAtRef.current = Date.now();
    };

    const handleFocus = async () => {
      const now = Date.now();
      const idleDuration = now - lastActiveAtRef.current;
      lastActiveAtRef.current = now;
      if (idleDuration < TAB_IDLE_THRESHOLD_MS) return;
      await handleIdleReturn(now - idleDuration);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <Router>
      <RootLayout>
        <AppRoutes />
      </RootLayout>
    </Router>
  );
}

function App() {
  return (
    <AuthGate>
      <AppContent />
    </AuthGate>
  );
}

export default App;
