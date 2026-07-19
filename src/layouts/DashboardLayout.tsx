import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar Placeholder */}
      <aside style={{ width: '250px', borderRight: '1px solid #333', padding: '1rem' }}>
        <h3>Tractus Spaces</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="/" style={{ color: 'lightblue' }}>General Discussion</a></li>
          <li><a href="/space/2" style={{ color: 'lightblue' }}>Tech</a></li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
