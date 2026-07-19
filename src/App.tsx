import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import SpaceFeedPage from './pages/SpaceFeedPage'
import ThreadDetailsPage from './pages/ThreadDetailsPage'
import UserProfilePage from './pages/UserProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes (Wrapped in Layout) */}
        <Route path="/" element={<DashboardLayout />}>
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
