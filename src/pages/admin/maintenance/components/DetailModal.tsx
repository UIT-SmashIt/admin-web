import type { IMaintenance, MaintenanceStatus } from '../../../../types/maintenance.type';
import { MaintenanceStatusBadge, STATUS_CONFIG } from './MaintenanceStatusBadge';

interface DetailModalProps {
  maintenance: IMaintenance;
  onStatusChange: (id: number, status: MaintenanceStatus) => void;
  onClose: () => void;
}

export function DetailModal({ maintenance, onStatusChange, onClose }: DetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: 480, boxShadow: '0 24px 80px rgba(0,0,0,0.18)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>🔧 Chi tiết phiếu bảo trì</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>ID: {maintenance.maintainId} · {formatDate(maintenance.createdAt)}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Danh mục', value: maintenance.categoryName },
              { label: 'Cơ sở', value: maintenance.facilityName },
              { label: 'Sân', value: maintenance.courtName },
              { label: 'Trạng thái', value: <MaintenanceStatusBadge status={maintenance.status} small /> },
            ].map(f => (
              <div key={f.label} style={{ padding: '12px 14px', borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0ee' }}>
                <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4, fontWeight: 500 }}>{f.label}</div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>
                  {typeof f.value === 'string' ? f.value : f.value}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px', borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0ee', marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 5, fontWeight: 500 }}>NỘI DUNG CHI TIẾT</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.5 }}>{maintenance.detail}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, color: '#999', marginBottom: 8, fontWeight: 600 }}>CẬP NHẬT TRẠNG THÁI</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(Object.entries(STATUS_CONFIG) as [MaintenanceStatus, typeof STATUS_CONFIG[MaintenanceStatus]][]).map(([s, cfg]) => (
                <button key={s} onClick={() => { onStatusChange(maintenance.maintainId, s); onClose(); }} style={{
                  flex: 1, padding: '9px 8px', borderRadius: 9,
                  border: `1.5px solid ${maintenance.status === s ? cfg.color : '#e0e0e0'}`,
                  background: maintenance.status === s ? cfg.bg : '#fafafa',
                  color: maintenance.status === s ? cfg.color : '#666',
                  fontWeight: maintenance.status === s ? 700 : 400,
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                }}>
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#bbb' }}>
            Cập nhật: {formatDate(maintenance.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
