import React, { useEffect } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
// import SignupPage from './pages/SignupPage';
// import Dashboard from './pages/Dashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import Dashboard from "./pages/Dashboard";
import SignupPage from "./pages/SignupPage";

const App: React.FC = () => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <LandingPage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/*<Routes>*/}
      {/*  <Route path="/" element={<LandingPage />} />*/}
      {/*  <Route path="/login" element={<LoginPage />} />*/}
      {/*  <Route path="/signup" element={<SignupPage />} />*/}
      {/*  <Route path="/dashboard" element={<Dashboard />} />*/}
      {/*</Routes>*/}
    </BrowserRouter>
  );
};

export default App;
