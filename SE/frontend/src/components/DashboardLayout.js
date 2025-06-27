import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const stored = localStorage.getItem('currentUser');
  const currentUser = stored ? JSON.parse(stored) : null;

  const tabs = [
    { path: 'calendar', label: 'Calendar' },
    { path: 'ordersection', label: 'Order Section' },
    { path: 'clientdatabase', label: 'Client Database' },
    { path: 'settings', label: 'Settings' },
    { path: 'notes', label: 'Notes' },
    { path: 'tools', label: 'Tools' },
    { path: 'warranties', label: 'Warranties' },
    { path: 'documentation', label: 'Documentation' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/signin');
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="user-info">
          {currentUser
            ? `Logged in as ${currentUser.username} (${currentUser.email})`
            : 'Not signed in'}
        </div>
        <h2 className="logo">MyApp</h2>
        <nav className="nav-links">
          {tabs.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className="sidebar-link"
              activeClassName="active"
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}