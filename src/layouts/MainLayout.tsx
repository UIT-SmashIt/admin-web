import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TopbarProps {
  courtName?: string;
}

// ─── Topbar ──────────────────────────────────────────────────────────────────

function Topbar({ courtName = 'Sân Cầu Lông Thắng Lợi' }: TopbarProps) {
  return (
    <header
      style={{
        height: 56,
        background: '#fff',
        borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 14,
        flexShrink: 0,
        fontFamily: "'Be Vietnam Pro', sans-serif",
        zIndex: 10,
      }}
    >

      {/* Court logo */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E6F1FB, #B5D4F4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        🏸
      </div>

      {/* Court name */}
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: '#1a1a1a',
          textTransform: 'uppercase',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {courtName}
      </span>

    </header>
  );
}


// ─── MainLayout ───────────────────────────────────────────────────────────────

/**
 * MainLayout wraps all authenticated pages.
 * Place this as a parent route in your router, with child routes rendered via <Outlet />.
 *
 * Example usage in App.tsx / router:
 *
 *   <Route element={<MainLayout />}>
 *     <Route path="/" element={<Dashboard />} />
 *     <Route path="/trang-thai-san" element={<CourtStatus />} />
 *     ...
 *   </Route>
 */
export default function MainLayout() {
  const [sidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Replace with your actual logout logic (clear tokens, redirect, etc.)
    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#f7f7f5',
      }}
    >
      {/* Sidebar */}
      <Sidebar
        collapsed={!sidebarOpen}
        onLogout={handleLogout}
      />

      {/* Right column: Topbar + page content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <Topbar/>

        {/* Page content rendered by child routes */}
        <main
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}