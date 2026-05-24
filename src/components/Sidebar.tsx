import { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

interface NavItem {
  key: string;
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function Icon({ d, viewBox = '0 0 24 24' }: { d: string | React.ReactNode; viewBox?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
  );
}

const Icons = {
  dashboard: <Icon d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />,
  courtStatus: (
    <Icon
      d={
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </>
      }
    />
  ),
  sales: <Icon d="M3 3h18v4H3zM3 10h12v4H3zM3 17h8v4H3z" />,
  inventory: <Icon d="M20 7H4a1 1 0 00-1 1v11a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1zM16 3H8L6 7h12l-2-4z" />,
  staff: (
    <Icon
      d={
        <>
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          <path d="M19 8v6M16 11h6" />
        </>
      }
    />
  ),
  revenue: (
    <Icon
      d={
        <>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </>
      }
    />
  ),
  customers: (
    <Icon
      d={
        <>
          <circle cx="8" cy="7" r="4" />
          <path d="M2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
          <circle cx="17" cy="9" r="3" />
          <path d="M22 21v-1.5a3 3 0 00-3-3h-1" />
        </>
      }
    />
  ),
  vouchers: (
    <Icon
      d={
        <>
          <path d="M20 12V6a2 2 0 00-2-2H6a2 2 0 00-2 2v6c1.1 0 2 .9 2 2s-.9 2-2 2v2a2 2 0 002 2h12a2 2 0 002-2v-2c-1.1 0-2-.9-2-2s.9-2 2-2z" />
          <line x1="9" y1="12" x2="15" y2="12" />
        </>
      }
    />
  ),
  maintenance: (
    <Icon
      d={
        <>
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        </>
      }
    />
  ),
  schedule: (
    <Icon
      d={
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      }
    />
  ),
  approvals: (
    <Icon
      d={
        <>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </>
      }
    />
  ),
  community: (
    <Icon
      d={
        <>
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </>
      }
    />
  ),
  profile: (
    <Icon
      d={
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </>
      }
    />
  ),
};

const NAV_ITEMS: NavItem[] = [
  {
    key: 'overview',
    label: 'Tổng quan',
    children: [
      { key: 'dashboard', label: 'Dashboard', path: '/', icon: Icons.dashboard },
    ],
  },
  {
    key: 'operations',
    label: 'Vận hành',
    children: [
      { key: 'court-status', label: 'Trạng thái CSVC', path: '/trang-thai-san', icon: Icons.courtStatus },
      { key: 'inventory', label: 'Kho & dịch vụ', path: '/kho-dich-vu', icon: Icons.inventory },
      { key: 'staff', label: 'Quản lý nhân sự', path: '/nhan-su', icon: Icons.staff },
      { key: 'revenue', label: 'Doanh thu', path: '/doanh-thu', icon: Icons.revenue },
      { key: 'customers', label: 'Quản lý khách hàng', path: '/khach-hang', icon: Icons.customers },
      { key: 'vouchers', label: 'Quản lý voucher', path: '/voucher', icon: Icons.vouchers },
      { key: 'maintenance', label: 'Bảo trì', path: '/bao-tri', icon: Icons.maintenance },
    ],
  },
  {
    key: 'management',
    label: 'Quản lý',
    children: [
      { key: 'schedule', label: 'Lịch đặt', path: '/lich-dat', icon: Icons.schedule },
      { key: 'community', label: 'Cộng đồng', path: '/cong-dong', icon: Icons.community },
      { key: 'profile', label: 'Thông tin cá nhân', path: '/thong-tin', icon: Icons.profile },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState<string>('dashboard');

  const handleNavClick = (item: NavItem) => {
    setActiveKey(item.key);
    if (item.path) navigate({ to: item.path });
  };

  const isActive = (item: NavItem) => {
    if (item.path) return location.pathname === item.path || activeKey === item.key;
    return false;
  };

  return (
    <aside
      style={{
        width: 220,
        minWidth: 0,
        overflow: 'hidden',
        background: '#ffffff',
        borderRight: '0.5px solid rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* Profile */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 16px 16px',
          borderBottom: '0.5px solid rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E6F1FB, #B5D4F4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 500,
            color: '#185FA5',
            marginBottom: 10,
            flexShrink: 0,
          }}
        >
          A
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap' }}>
          NAT
        </div>
        <div style={{ fontSize: 12, color: '#888', marginTop: 2, whiteSpace: 'nowrap' }}>
          Quản trị viên
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {NAV_ITEMS.map((section) => (
          <div key={section.key}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#bbb',
                padding: '8px 16px 4px',
                whiteSpace: 'nowrap',
              }}
            >
              {section.label}
            </div>
            {section.children?.map((item) => (
              <NavItemRow
                key={item.key}
                item={item}
                active={isActive(item)}
                isChild
                onClick={() => handleNavClick(item)}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px 16px',
          borderTop: '0.5px solid rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: '#888',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            width: '100%',
            transition: 'color 0.15s',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#A32D2D')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
        >
          <LogoutIcon />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

function NavItemRow({
  item,
  active,
  isChild,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  isChild?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: isChild ? '7px 16px 7px 16px' : '8px 16px',
        fontSize: isChild ? 12.5 : 13,
        color: active ? '#D4840A' : '#666',
        fontWeight: active ? 500 : 400,
        background: active ? 'rgba(250,238,218,0.4)' : 'transparent',
        borderLeft: `2px solid ${active ? '#D4840A' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLDivElement).style.background = '#f5f5f5';
          (e.currentTarget as HTMLDivElement).style.color = '#1a1a1a';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLDivElement).style.background = 'transparent';
          (e.currentTarget as HTMLDivElement).style.color = '#666';
        }
      }}
    >
      {item.icon && (
        <span style={{ display: 'flex', alignItems: 'center', opacity: active ? 1 : 0.65 }}>
          {item.icon}
        </span>
      )}
      {item.label}
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 5l4 3-4 3M14 8H6" />
    </svg>
  );
}