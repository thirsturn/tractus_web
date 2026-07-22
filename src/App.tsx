import { BrowserRouter, Routes, Route } from 'react-router-dom'
import type { ReactNode } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import SpaceFeedPage from './pages/SpaceFeedPage/SpaceFeedPage'
import ThreadDetailsPage from './pages/ThreadDetailsPage/ThreadDetailsPage'
import UserProfilePage from './pages/UserProfilePage/UserProfilePage'
import SettingsPage from './pages/SettingsPage/SettingsPage'
import ExplorePage from './pages/ExplorePage/ExplorePage'
function ProtectedRoute({ children }: { children: ReactNode }) {
  // Temporarily bypassed for UI testing
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
          <Route path="settings" element={<SettingsPage />} />
          <Route path="explore" element={<ExplorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
