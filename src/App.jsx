import { Routes, Route, useLocation, BrowserRouter, matchPath } from "react-router-dom";
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import MatchesPage from "./pages/MatchesPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import AboutPage from "./pages/AboutPage";
// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import NotificationPage from "./components/NotificationPage";
import AdminPanel from "./pages/admin/AdminPanel";
import UserProfilePage from "./pages/UserProfilePage";
import ResetPassword from "./components/ResetPassword";
import ProfileView from "./pages/admin/ProfileView";
import SettingsPage from "./pages/SettingsPage";
// Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import ContactQuery from "./pages/admin/ContactQuery";
import UpdateUserProfile from "./pages/admin/UpdateUserProfile";

const AppContent = () => {
  const { loading: authLoading, checked } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation state
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // For reset-password route, skip auth checks and splash screen
  if (location.pathname === '/reset-password') {
    console.log('🔧 Reset password route detected, bypassing auth checks');
    console.log('🔗 Current location:', location);
    console.log('🎫 Search params:', location.search);
    return <ResetPassword />;
  }

  // Show splash while checking auth or during initial load
  if (authLoading || showSplash || !checked) {
    return <SplashScreen />;
  }

  // Routes that should NOT show navbar (supports dynamic params)
  const noNavbarRoutes = ['/reset-password', '/admin', '/admin/update-user/:id','/profile/:id','/profile-views', '/admin/Suji1972$$', '/admin/Subash@188917', '/contact-query'];
  const showNavbar = !noNavbarRoutes.some(route =>
    matchPath({ path: route, end: true }, location.pathname)
  );

  return (
    <>
      {showNavbar && <Navbar />}
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-200 z-50">
          <div className="h-full bg-red-600 transition-all duration-300 ease-out"></div>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Admin Auth Routes */}
        <Route path="/admin/Suji1972$$" element={<AdminLogin />} />
        <Route path="/admin/Subash@188917" element={<AdminRegister />} />
        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminPanel />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/update-user/:id"
          element={
            <AdminProtectedRoute>
              <UpdateUserProfile />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/profile-views"
          element={
            <AdminProtectedRoute>
              <ProfileView />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/contact-query"
          element={
            <AdminProtectedRoute>
              <ContactQuery />
            </AdminProtectedRoute>
          }
        />

        {/* 🔐 Protected Routes - Redirect to home if not authenticated */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
         />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Standalone route outside auth context */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 📱 Main app with auth context */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;