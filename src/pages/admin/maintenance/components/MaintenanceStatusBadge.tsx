import type { MaintenanceStatus } from '../../../../types/maintenance.type';

const STATUS_CONFIG: Record<MaintenanceStatus, { label: string; color: string; bg: string; icon: string }> = {
  'Pending':      { label: 'Chờ xử lý', color: '#D4840A', bg: '#FFF7ED', icon: '⏳' },
  'In Progress':  { label: 'Đang xử lý', color: '#378ADD', bg: '#EFF6FF', icon: '🔧' },
  'Completed':    { label: 'Hoàn thành', color: '#22863a', bg: '#F0FDF4', icon: '✅' },
};

export function MaintenanceStatusBadge({ status, small }: { status: MaintenanceStatus; small?: boolean }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: small ? '2px 8px' : '4px 10px', borderRadius: 12,
      background: cfg.bg, color: cfg.color,
      fontSize: small ? 11 : 12, fontWeight: 600,
      border: `1px solid ${cfg.color}33`,
    }}>
      <span style={{ fontSize: small ? 9 : 11 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

export { STATUS_CONFIG };
