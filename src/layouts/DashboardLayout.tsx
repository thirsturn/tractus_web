import { Outlet } from 'react-router-dom';
import TopNav from '../components/TopNav/TopNav';
import Sidebar from '../components/Sidebar/Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <TopNav />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
