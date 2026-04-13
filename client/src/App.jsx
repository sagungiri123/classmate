import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider, useAuth} from './context/AuthContext';
import PrivateRoute from './components/layout/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';
import MicButton from './components/chat/MicButton';
import {useState} from 'react';

import './App.css';

// Redirect based on auth status: authenticated -> /chat, unauthenticated -> /login
const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-[#C17A5F]"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/chat" replace /> : <Navigate to="/login" replace />;
};

// Redirect authenticated users away from login/register pages
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-[#C17A5F]"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/chat" replace /> : children;
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public routes - redirect authenticated users to chat */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected routes */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        {/* Default redirect based on auth status */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
 
export default App;
 