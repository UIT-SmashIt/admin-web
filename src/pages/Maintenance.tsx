import { useState, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'pending' | 'done' | 'inprogress';

interface Ticket {
  id: number;
  creator: string;
  location: string;
  reason: string;
  invoice: string;
  time: string;
  date: string;
  status: Status;
  note: string;
}

type View = 'list' | 'create';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LOCATIONS = ['Sân 1', 'Sân 2', 'Sân 3', 'Khu vực chung', 'Nhà vệ sinh', 'Phòng kỹ thuật', 'Kho'];
const REASONS_PRESETS = ['Lưới bị thủng', 'Sàn bị mờ viền', 'Quạt bị hỏng', 'Đèn chiếu sáng hư', 'Vòi nước rò rỉ', 'Cửa bị kẹt', 'Điều hòa không mát'];
const CREATORS = ['Khách', 'Nhân viên', 'Quản lý'];

const INITIAL: Ticket[] = [
  { id: 1, creator: 'Khách', location: 'Sân 3', reason: 'Lưới sân 3 bị thủng', invoice: 'BT-001', time: '08:30', date: '09/04/2026', status: 'done', note: '' },
  { id: 2, creator: 'Khách', location: 'Sân 2', reason: 'Sân 2 bị mờ viền', invoice: 'BT-002', time: '10:15', date: '09/04/2026', status: 'inprogress', note: 'Đang chờ vật liệu' },
  { id: 3, creator: 'Khách', location: 'Sân 2', reason: 'Sân 2 bị hỏng quạt', invoice: 'BT-003', time: '14:00', date: '08/04/2026', status: 'pending', note: '' },
  { id: 4, creator: 'Nhân viên', location: 'Khu vực chung', reason: 'Đèn hành lang hỏng 2 bóng', invoice: 'BT-004', time: '09:00', date: '07/04/2026', status: 'done', note: 'Đã thay bóng mới' },
  { id: 5, creator: 'Quản lý', location: 'Nhà vệ sinh', reason: 'Vòi nước rò rỉ nhẹ', invoice: 'BT-005', time: '16:30', date: '06/04/2026', status: 'pending', note: '' },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; icon: string }> = {
  pending:    { label: 'Chờ xử lý', color: '#D4840A', bg: '#FFF7ED', icon: '⏳' },
  inprogress: { label: 'Đang xử lý', color: '#378ADD', bg: '#EFF6FF', icon: '🔧' },
  done:       { label: 'Hoàn thành', color: '#22863a', bg: '#F0FDF4', icon: '✅' },
};

let ticketCounter = INITIAL.length + 1;

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ status, small }: { status: Status; small?: boolean }) {
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

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ ticket, onStatusChange, onClose }: {
  ticket: Ticket;
  onStatusChange: (id: number, status: Status) => void;
  onClose: () => void;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: 480, boxShadow: '0 24px 80px rgba(0,0,0,0.18)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>🔧 Chi tiết phiếu bảo trì</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{ticket.invoice} · {ticket.date}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Người tạo', value: ticket.creator },
              { label: 'Thời gian', value: `${ticket.time} · ${ticket.date}` },
              { label: 'Vị trí', value: ticket.location },
              { label: 'Số hóa đơn', value: ticket.invoice },
            ].map(f => (
              <div key={f.label} style={{ padding: '12px 14px', borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0ee' }}>
                <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4, fontWeight: 500 }}>{f.label}</div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{f.value}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px', borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0ee', marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 5, fontWeight: 500 }}>LÝ DO</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>{ticket.reason}</div>
          </div>
          {ticket.note && (
            <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FFFBEB', border: '1px solid #FDE68A', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#B45309', marginBottom: 4, fontWeight: 600 }}>📝 GHI CHÚ</div>
              <div style={{ fontSize: 13, color: '#92400E' }}>{ticket.note}</div>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, color: '#999', marginBottom: 8, fontWeight: 600 }}>CẬP NHẬT TRẠNG THÁI</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([s, cfg]) => (
                <button key={s} onClick={() => { onStatusChange(ticket.id, s); onClose(); }} style={{
                  flex: 1, padding: '9px 8px', borderRadius: 9,
                  border: `1.5px solid ${ticket.status === s ? cfg.color : '#e0e0e0'}`,
                  background: ticket.status === s ? cfg.bg : '#fafafa',
                  color: ticket.status === s ? cfg.color : '#666',
                  fontWeight: ticket.status === s ? 700 : 400,
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                }}>
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Create View ──────────────────────────────────────────────────────────────

function CreateView({ onBack, onCreate }: { onBack: () => void; onCreate: (t: Ticket) => void }) {
  const [form, setForm] = useState({
    creator: CREATORS[0],
    service: '',
    location: LOCATIONS[0],
    reason: '',
    reasonPreset: '',
    invoice: `BT-${String(ticketCounter).padStart(3, '0')}`,
    time: new Date().toTimeString().slice(0, 5),
    note: '',
  });

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = () => {
    if (!form.reason.trim()) return;
    const ticket: Ticket = {
      id: Date.now(),
      creator: form.creator,
      location: form.location,
      reason: form.reason,
      invoice: form.invoice,
      time: form.time,
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'pending',
      note: form.note,
    };
    ticketCounter++;
    onCreate(ticket);
    onBack();
  };

  const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e8e8e8', borderRadius: 9,
    padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', background: '#fff', outline: 'none', transition: 'border-color 0.15s',
  };

  const Label = ({ children }: { children: string }) => (
    <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600, letterSpacing: '0.04em' }}>{children}</label>
  );

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Left panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px', background: '#fff', borderRight: '0.5px solid rgba(0,0,0,0.08)' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#D4840A', fontWeight: 600, fontSize: 14.5, fontFamily: 'inherit', padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Tạo phiếu bảo trì
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
          <div>
            <Label>NGƯỜI TẠO *</Label>
            <div style={{ display: 'flex', gap: 8 }}>
              {CREATORS.map(c => (
                <button key={c} onClick={() => set('creator', c)} style={{
                  flex: 1, padding: '9px 8px', borderRadius: 9, fontSize: 13,
                  border: `1.5px solid ${form.creator === c ? '#D4840A' : '#e0e0e0'}`,
                  background: form.creator === c ? '#FFF3E0' : '#fafafa',
                  color: form.creator === c ? '#D4840A' : '#666',
                  fontWeight: form.creator === c ? 700 : 400,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                }}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <Label>VỊ TRÍ *</Label>
            <select value={form.location} onChange={e => set('location', e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <Label>LÝ DO *</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {REASONS_PRESETS.map(r => (
                <button key={r} onClick={() => set('reason', r)} style={{
                  padding: '5px 10px', borderRadius: 16, fontSize: 12,
                  border: `1px solid ${form.reason === r ? '#D4840A' : '#e0e0e0'}`,
                  background: form.reason === r ? '#FFF3E0' : '#fafafa',
                  color: form.reason === r ? '#D4840A' : '#666',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                }}>{r}</button>
              ))}
            </div>
            <input value={form.reason} onChange={e => set('reason', e.target.value)}
              placeholder="Hoặc nhập lý do tùy chỉnh..." style={inp}
              onFocus={e => (e.target.style.borderColor = '#D4840A')}
              onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 280, padding: '22px 22px', background: '#f7f7f5', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Thông tin nhập</div>

        <div>
          <Label>THỜI GIAN</Label>
          <input type="time" value={form.time} onChange={e => set('time', e.target.value)}
            style={{ ...inp, background: '#fff' }}
            onFocus={e => (e.target.style.borderColor = '#D4840A')}
            onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>

        <div>
          <Label>LÝ DO (tóm tắt)</Label>
          <input value={form.reason} readOnly placeholder="Từ trái —"
            style={{ ...inp, background: '#f5f5f3', color: '#888', cursor: 'default' }} />
        </div>

        <div>
          <Label>SỈ / LẺ</Label>
          <input value={form.service} onChange={e => set('service', e.target.value)} placeholder="Dịch vụ liên quan (nếu có)"
            style={{ ...inp, background: '#fff' }}
            onFocus={e => (e.target.style.borderColor = '#D4840A')}
            onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>

        <div>
          <Label>HÓA ĐƠN / MÃ PHIẾU</Label>
          <input value={form.invoice} onChange={e => set('invoice', e.target.value)}
            style={{ ...inp, background: '#fff' }}
            onFocus={e => (e.target.style.borderColor = '#D4840A')}
            onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>

        <div>
          <Label>GHI CHÚ</Label>
          <textarea value={form.note} onChange={e => set('note', e.target.value)}
            placeholder="Ghi chú thêm..." rows={3}
            style={{ ...inp, resize: 'none' as const, background: '#fff', lineHeight: 1.5 }}
            onFocus={e => (e.target.style.borderColor = '#D4840A')}
            onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={handleCreate} disabled={!form.reason.trim()} style={{
          padding: '13px', borderRadius: 10, border: 'none',
          background: form.reason.trim() ? '#D4840A' : '#e0e0e0',
          color: '#fff', fontWeight: 700, fontSize: 14,
          cursor: form.reason.trim() ? 'pointer' : 'default', fontFamily: 'inherit',
          transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          🔧 Tạo phiếu
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BaoTri() {
  const [view, setView] = useState<View>('list');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tickets.filter(t =>
      (t.reason.toLowerCase().includes(q) || t.creator.toLowerCase().includes(q) || t.location.toLowerCase().includes(q) || t.invoice.toLowerCase().includes(q)) &&
      (filterStatus === 'all' || t.status === filterStatus)
    ).sort((a, b) => b.id - a.id);
  }, [tickets, search, filterStatus]);

  const handleStatusChange = (id: number, status: Status) =>
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));

  const handleCreate = (t: Ticket) => setTickets(prev => [t, ...prev]);

  const counts = useMemo(() => ({
    all: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    inprogress: tickets.filter(t => t.status === 'inprogress').length,
    done: tickets.filter(t => t.status === 'done').length,
  }), [tickets]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f7f7f5', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {detailTicket && <DetailModal ticket={detailTicket} onStatusChange={handleStatusChange} onClose={() => setDetailTicket(null)} />}

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Bảo trì</div>
        {view === 'create' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span style={{ fontSize: 14, color: '#D4840A', fontWeight: 500 }}>Tạo phiếu</span>
          </>
        )}
        <div style={{ flex: 1 }} />
        {view === 'list' && (
          <>
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 10px', fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#555' }} />
            <button onClick={() => setView('create')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, border: 'none', background: '#D4840A', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(212,132,10,0.3)' }}>
              🔧 Tạo phiếu bảo trì
            </button>
            <button onClick={() => setShowHistory(!showHistory)} style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid #e8e8e8', background: showHistory ? '#f0f0ee' : '#fff', fontSize: 12.5, color: '#555', cursor: 'pointer', fontFamily: 'inherit' }}>
              Lịch sử
            </button>
          </>
        )}
      </div>

      {view === 'create' ? (
        <CreateView onBack={() => setView('list')} onCreate={handleCreate} />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* Status filter chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <button onClick={() => setFilterStatus('all')} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1.5px solid ${filterStatus === 'all' ? '#D4840A' : '#e0e0e0'}`, background: filterStatus === 'all' ? '#FFF3E0' : '#fff', color: filterStatus === 'all' ? '#D4840A' : '#666', fontWeight: filterStatus === 'all' ? 700 : 400, fontFamily: 'inherit', transition: 'all 0.12s' }}>
              Tất cả ({counts.all})
            </button>
            {(Object.entries(STATUS_CONFIG) as [Status, typeof STATUS_CONFIG[Status]][]).map(([s, cfg]) => (
              <button key={s} onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer', border: `1.5px solid ${filterStatus === s ? cfg.color : '#e0e0e0'}`, background: filterStatus === s ? cfg.bg : '#fff', color: filterStatus === s ? cfg.color : '#666', fontWeight: filterStatus === s ? 700 : 400, fontFamily: 'inherit', transition: 'all 0.12s' }}>
                {cfg.icon} {cfg.label} ({counts[s]})
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 14, maxWidth: 360 }}>
            <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo lý do, vị trí, người tạo..." style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e8e8e8', borderRadius: 9, padding: '9px 12px 9px 34px', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1a1a1a', background: '#fff' }} onFocus={e => (e.target.style.borderColor = '#D4840A')} onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '48px 80px 1fr 110px 90px 120px 110px', padding: '10px 16px', background: '#fafafa', borderBottom: '0.5px solid #ebebeb' }}>
              {['STT', 'Người tạo', 'Nội dung', 'Vị trí', 'Thời gian', 'Trạng thái', ''].map((h, i) => (
                <div key={i} style={{ fontSize: 11.5, fontWeight: 600, color: '#999', letterSpacing: '0.04em', textAlign: i === 6 ? 'center' : 'left' }}>{h}</div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔧</div>Không có phiếu bảo trì nào
              </div>
            ) : filtered.map((t, idx) => (
              <div key={t.id}
                style={{ display: 'grid', gridTemplateColumns: '48px 80px 1fr 110px 90px 120px 110px', padding: '13px 16px', borderBottom: '0.5px solid #f5f5f3', cursor: 'pointer', transition: 'background 0.1s', alignItems: 'center' }}
                onClick={() => setDetailTicket(t)}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#fafaf8'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
              >
                <div style={{ fontSize: 13, color: '#bbb' }}>{idx + 1}</div>
                <div style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{t.creator}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4 }}>{t.reason}</div>
                  <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>{t.invoice}</div>
                </div>
                <div style={{ fontSize: 12.5, color: '#555' }}>{t.location}</div>
                <div>
                  <div style={{ fontSize: 12.5, color: '#555' }}>{t.time}</div>
                  <div style={{ fontSize: 11, color: '#bbb' }}>{t.date}</div>
                </div>
                <div><StatusBadge status={t.status} small /></div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
                  {/* Quick done toggle */}
                  <button
                    onClick={() => handleStatusChange(t.id, t.status === 'done' ? 'pending' : 'done')}
                    title={t.status === 'done' ? 'Đánh dấu chờ xử lý' : 'Đánh dấu hoàn thành'}
                    style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.status === 'done' ? '#BBF7D0' : '#e8e8e8'}`, background: t.status === 'done' ? '#F0FDF4' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, transition: 'all 0.12s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)'}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'}
                  >
                    {t.status === 'done' ? '✅' : '☐'}
                  </button>
                  {/* Copy */}
                  <button
                    onClick={() => {
                      const newT: Ticket = { ...t, id: Date.now(), invoice: `BT-${String(ticketCounter++).padStart(3,'0')}`, status: 'pending', date: new Date().toLocaleDateString('vi-VN') };
                      setTickets(prev => [newT, ...prev]);
                    }}
                    title="Sao chép phiếu"
                    style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all 0.12s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.color = '#378ADD'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#888'; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length > 0 && (
            <div style={{ marginTop: 12, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
              Hiển thị {filtered.length} / {tickets.length} phiếu bảo trì
            </div>
          )}
        </div>
      )}
    </div>
  );
}