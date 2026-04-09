import { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

interface NavItem {
  key: string;
  label: string;
  path?: string;
  children?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'overview',
    label: 'Tổng quan',
    children: [
      { key: 'dashboard', label: 'Dashboard', path: '/' },
    ],
  },
  {
    key: 'operations',
    label: 'Vận hành',
    children: [
      { key: 'court-status', label: 'Trạng thái sân', path: '/trang-thai-san' },
      { key: 'sales', label: 'Bán hàng', path: '/ban-hang' },
      { key: 'inventory', label: 'Kho & dịch vụ', path: '/kho-dich-vu' },
      { key: 'staff', label: 'Quản lý nhân sự', path: '/nhan-su' },
      { key: 'revenue', label: 'Doanh thu', path: '/doanh-thu' },
      { key: 'customers', label: 'Quản lý khách hàng', path: '/khach-hang' },
      { key: 'vouchers', label: 'Quản lý voucher', path: '/voucher' },
      { key: 'maintenance', label: 'Bảo trì', path: '/bao-tri' },
    ],
  },
  {
    key: 'management',
    label: 'Quản lý',
    children: [
      { key: 'schedule', label: 'Lịch đặt', path: '/lich-dat' },
      { key: 'approvals', label: 'Duyệt đơn', path: '/duyet-don' },
      { key: 'community', label: 'Cộng đồng', path: '/cong-dong' },
      { key: 'profile', label: 'Thông tin cá nhân', path: '/thong-tin' },
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
        gap: 9,
        padding: isChild ? '8px 16px 8px 32px' : '8px 16px',
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