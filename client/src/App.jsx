import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Analysis from "./pages/Analysis.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";

import { useAuth } from "./state/AuthContext.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Terms from "./pages/Terms.jsx";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-300">
        Loading Devlens...
      </div>
    );
  }

  // 🔒 Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → allow access
  return children;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* 🔓 Public Route */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Default page */}
          <Route index element={<Home />} />

          {/* Other pages */}
          <Route path="analysis/:id" element={<Analysis />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ❗ Optional fallback (recommended) */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

      </Routes>
    </AnimatePresence>
  );
}