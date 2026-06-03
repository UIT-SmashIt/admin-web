import { useState, useMemo } from 'react';
import type { IMaintenance, MaintenanceStatus } from '../../../../types/maintenance.type';
import { MaintenanceStatusBadge, STATUS_CONFIG } from './MaintenanceStatusBadge';

interface MaintenanceListViewProps {
  maintenances: IMaintenance[];
  onSelectItem: (item: IMaintenance) => void;
}

export function MaintenanceListView({
  maintenances,
  onSelectItem,
}: MaintenanceListViewProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return maintenances.filter(m =>
      (m.detail.toLowerCase().includes(q) ||
        m.categoryName.toLowerCase().includes(q) ||
        m.facilityName.toLowerCase().includes(q) ||
        m.courtIndex.toString().includes(q)) &&
      (filterStatus === 'all' || m.status === filterStatus)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [maintenances, search, filterStatus]);

  const counts = useMemo(() => ({
    all: maintenances.length,
    'Pending': maintenances.filter(m => m.status === 'Pending').length,
    'In Progress': maintenances.filter(m => m.status === 'In Progress').length,
    'Completed': maintenances.filter(m => m.status === 'Completed').length,
  }), [maintenances]) as Record<MaintenanceStatus | 'all', number>;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #f0f0f0', flexShrink: 0 }}>
        {/* Status filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <button onClick={() => setFilterStatus('all')} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1.5px solid ${filterStatus === 'all' ? '#D4840A' : '#e0e0e0'}`, background: filterStatus === 'all' ? '#FFF3E0' : '#fff', color: filterStatus === 'all' ? '#D4840A' : '#666', fontWeight: filterStatus === 'all' ? 700 : 400, fontFamily: 'inherit', transition: 'all 0.12s' }}>
            Tất cả ({counts.all})
          </button>
          {(Object.entries(STATUS_CONFIG) as [MaintenanceStatus, typeof STATUS_CONFIG[MaintenanceStatus]][]).map(([s, cfg]) => (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1.5px solid ${filterStatus === s ? cfg.color : '#e0e0e0'}`, background: filterStatus === s ? cfg.bg : '#fff', color: filterStatus === s ? cfg.color : '#666', fontWeight: filterStatus === s ? 700 : 400, fontFamily: 'inherit', transition: 'all 0.12s' }}>
              {cfg.icon} {cfg.label} ({counts[s]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo nội dung, danh mục, cơ sở..." style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e8e8e8', borderRadius: 9, padding: '9px 12px 9px 34px', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1a1a1a', background: '#fff' }} onFocus={e => (e.target.style.borderColor = '#D4840A')} onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden', margin: '0 20px 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 140px 140px 120px', padding: '10px 16px', background: '#fafafa', borderBottom: '0.5px solid #ebebeb', position: 'sticky', top: 0 }}>
            {['STT', 'Nội dung', 'Danh mục / Cơ sở', 'Sân', 'Trạng thái'].map((h, i) => (
              <div key={i} style={{ fontSize: 11.5, fontWeight: 600, color: '#999', letterSpacing: '0.04em', textAlign: 'left' }}>{h}</div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔧</div>Không có phiếu bảo trì nào
            </div>
          ) : filtered.map((m, idx) => (
            <div key={m.maintainId}
              style={{ display: 'grid', gridTemplateColumns: '48px 1fr 140px 140px 120px', padding: '13px 16px', borderBottom: '0.5px solid #f5f5f3', cursor: 'pointer', transition: 'background 0.1s', alignItems: 'center' }}
              onClick={() => onSelectItem(m)}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#fafaf8'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
            >
              <div style={{ fontSize: 13, color: '#bbb' }}>{idx + 1}</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.detail}</div>
                <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>{formatDate(m.createdAt)}</div>
              </div>
              <div style={{ fontSize: 12.5, color: '#555' }}>
                <div>{m.categoryName}</div>
                <div style={{ fontSize: 11, color: '#bbb' }}>{m.facilityName}</div>
              </div>
              <div style={{ fontSize: 12.5, color: '#555' }}>{m.courtIndex}</div>
              <div><MaintenanceStatusBadge status={m.status} small /></div>
            </div>
          ))}
        </div>

        {filtered.length > 0 && (
          <div style={{ fontSize: 12, color: '#bbb', textAlign: 'center', paddingBottom: 20 }}>
            Hiển thị {filtered.length} / {maintenances.length} phiếu bảo trì
          </div>
        )}
      </div>
    </div>
  );
}
