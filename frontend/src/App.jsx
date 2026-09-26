import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import MySkills from './pages/MySkills';
import Skills from './pages/Skills';
import FindPeople from './pages/FindPeople';
import PublicUserProfile from './pages/PublicUserProfile';
import Matches from './pages/Matches';
import MatchDetails from './pages/MatchDetails';
import ExchangeRequests from './pages/ExchangeRequests';
import ActiveExchanges from './pages/ActiveExchanges';

import ChatPage from './pages/ChatPage';
import MySessions from './pages/MySessions';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            {/* Public Landing Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Public Routes */}
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-skills"
              element={
                <ProtectedRoute>
                  <MySkills />
                </ProtectedRoute>
              }
            />

            {/* Phase 3 Protected Match & Exchange Routes */}
            <Route
              path="/matches"
              element={
                <ProtectedRoute>
                  <Matches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matches/:userId"
              element={
                <ProtectedRoute>
                  <MatchDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exchange-requests"
              element={
                <ProtectedRoute>
                  <ExchangeRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <ExchangeRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-exchanges"
              element={
                <ProtectedRoute>
                  <ActiveExchanges />
                </ProtectedRoute>
              }
            />

            {/* Phase 4 Protected Communication & Session Routes */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-sessions"
              element={
                <ProtectedRoute>
                  <MySessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <MySessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Skill & Swapper Discovery Routes */}
            <Route path="/skills" element={<Skills />} />
            <Route path="/find-people" element={<FindPeople />} />
            <Route path="/user/:id" element={<PublicUserProfile />} />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
