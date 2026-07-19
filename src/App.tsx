import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import SpaceFeedPage from './pages/SpaceFeedPage'
import ThreadDetailsPage from './pages/ThreadDetailsPage'
import UserProfilePage from './pages/UserProfilePage'
import { useAuth } from './context/AuthContext'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  // const { isAuthenticated } = useAuth();
  
  // Temporarily bypassed for UI testing
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes (Wrapped in Layout) */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SpaceFeedPage />} />
          <Route path="space/:id" element={<SpaceFeedPage />} />
          <Route path="thread/:id" element={<ThreadDetailsPage />} />
          <Route path="profile/:username" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
