import { useState, useMemo } from 'react';

const globalStyles = `
  html, body {
    color-scheme: light;
  }
  * {
    color-scheme: light;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Rank = 'Vàng' | 'Bạc' | 'Đồng' | 'Thành viên';

interface Customer {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  rank: Rank;
  visits: number;
  totalSpent: number;
  joinDate: string;
  note: string;
}

type SortField = 'name' | 'rank' | 'visits' | 'totalSpent';
type SortDir = 'asc' | 'desc';
type ModalMode = 'add' | 'edit' | 'view' | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const RANKS: Rank[] = ['Vàng', 'Bạc', 'Đồng', 'Thành viên'];

const RANK_CONFIG: Record<Rank, { bg: string; text: string; border: string; emoji: string }> = {
  'Vàng':      { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A', emoji: '🥇' },
  'Bạc':       { bg: '#F8FAFC', text: '#475569', border: '#CBD5E1', emoji: '🥈' },
  'Đồng':      { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA', emoji: '🥉' },
  'Thành viên':{ bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', emoji: '👤' },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL: Customer[] = [
  { id: 1, code: 'NDT', name: 'Nguyễn Đức Thịnh', phone: '0901 234 567', email: 'thinh@gmail.com', rank: 'Vàng', visits: 48, totalSpent: 8640000, joinDate: '12/01/2024', note: 'KH thân thiết, hay đặt sân sáng sớm' },
  { id: 2, code: 'LNKT', name: 'Lê Nguyễn Kim Thoa', phone: '0912 345 678', email: 'kimthoa@gmail.com', rank: 'Đồng', visits: 21, totalSpent: 3150000, joinDate: '05/03/2024', note: '' },
  { id: 3, code: 'LD', name: 'Lý Dương', phone: '0923 456 789', email: 'lyduong@gmail.com', rank: 'Thành viên', visits: 7, totalSpent: 980000, joinDate: '18/06/2024', note: '' },
  { id: 4, code: 'PTH', name: 'Phạm Thị Hương', phone: '0934 567 890', email: 'huong@gmail.com', rank: 'Vàng', visits: 62, totalSpent: 11200000, joinDate: '03/11/2023', note: 'VIP, ưu tiên đặt sân cuối tuần' },
  { id: 5, code: 'BVN', name: 'Bùi Văn Nam', phone: '0945 678 901', email: 'buinam@gmail.com', rank: 'Bạc', visits: 34, totalSpent: 5100000, joinDate: '22/02/2024', note: '' },
  { id: 6, code: 'TVL', name: 'Trần Văn Long', phone: '0956 789 012', email: 'tvlong@gmail.com', rank: 'Thành viên', visits: 4, totalSpent: 560000, joinDate: '01/09/2024', note: '' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('vi-VN');
const RANK_ORDER: Record<Rank, number> = { 'Vàng': 0, 'Bạc': 1, 'Đồng': 2, 'Thành viên': 3 };

function initials(name: string) {
  return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
}

function avatarColor(rank: Rank) {
  return { 'Vàng': '#B45309', 'Bạc': '#475569', 'Đồng': '#C2410C', 'Thành viên': '#166534' }[rank];
}

// ─── RankBadge ────────────────────────────────────────────────────────────────

function RankBadge({ rank, small }: { rank: Rank; small?: boolean }) {
  const cfg = RANK_CONFIG[rank];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: small ? '2px 8px' : '4px 10px',
      borderRadius: 20,
      background: cfg.bg, color: cfg.text,
      border: `1px solid ${cfg.border}`,
      fontSize: small ? 11 : 12, fontWeight: 600,
    }}>
      <span style={{ fontSize: small ? 10 : 11 }}>{cfg.emoji}</span>
      {rank}
    </span>
  );
}

// ─── Customer Modal ───────────────────────────────────────────────────────────

function CustomerModal({
  mode,
  customer,
  onSave,
  onClose,
}: {
  mode: ModalMode;
  customer: Customer | null;
  onSave: (c: Customer) => void;
  onClose: () => void;
}) {
  const isView = mode === 'view';
  const isAdd = mode === 'add';

  const [form, setForm] = useState<Omit<Customer, 'id'>>({
    code: customer?.code ?? '',
    name: customer?.name ?? '',
    phone: customer?.phone ?? '',
    email: customer?.email ?? '',
    rank: customer?.rank ?? 'Thành viên',
    visits: customer?.visits ?? 0,
    totalSpent: customer?.totalSpent ?? 0,
    joinDate: customer?.joinDate ?? new Date().toLocaleDateString('vi-VN'),
    note: customer?.note ?? '',
  });

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({ id: customer?.id ?? Date.now(), ...form });
    onClose();
  };

  const inputStyle = (disabled?: boolean): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box',
    border: `1.5px solid ${disabled ? '#f0f0ee' : '#e8e8e8'}`,
    borderRadius: 9, padding: '10px 13px',
    fontSize: 13.5, fontFamily: 'inherit',
    color: disabled ? '#aaa' : '#1a1a1a',
    background: disabled ? '#fafafa' : '#fff',
    outline: 'none', transition: 'border-color 0.15s',
    cursor: disabled ? 'default' : 'text',
  });

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600, letterSpacing: '0.04em' }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 18, width: 520,
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        maxHeight: '88vh', display: 'flex', flexDirection: 'column',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '0.5px solid #f0f0ee', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            {isView && customer ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: avatarColor(customer.rank) + '18',
                  border: `2px solid ${avatarColor(customer.rank)}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, color: avatarColor(customer.rank),
                }}>{initials(customer.name)}</div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>{customer.name}</div>
                  <div style={{ marginTop: 4 }}><RankBadge rank={customer.rank} small /></div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
                {isAdd ? '+ Thêm khách hàng' : 'Chỉnh sửa thông tin'}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: '50%', border: 'none',
            background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
          {isView && customer ? (
            // View mode: stats + info
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: 'Lượt đặt sân', value: `${customer.visits} lần`, color: '#378ADD' },
                  { label: 'Tổng chi tiêu', value: `${fmt(customer.totalSpent)}đ`, color: '#D4840A' },
                  { label: 'Ngày tham gia', value: customer.joinDate, color: '#22863a' },
                ].map(s => (
                  <div key={s.label} style={{
                    flex: 1, padding: '12px', borderRadius: 10,
                    background: '#fafafa', border: '1px solid #f0f0ee',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Mã khách hàng', value: customer.code },
                  { label: 'Số điện thoại', value: customer.phone },
                  { label: 'Email', value: customer.email || '—' },
                  { label: 'Xếp hạng', value: <RankBadge rank={customer.rank} /> },
                ].map(f => (
                  <div key={f.label} style={{
                    padding: '12px 14px', borderRadius: 10,
                    background: '#fafafa', border: '1px solid #f0f0ee',
                  }}>
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 5, fontWeight: 500 }}>{f.label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {customer.note && (
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: '#FFFBEB', border: '1px solid #FDE68A',
                }}>
                  <div style={{ fontSize: 11, color: '#B45309', marginBottom: 4, fontWeight: 600 }}>📝 GHI CHÚ</div>
                  <div style={{ fontSize: 13, color: '#92400E' }}>{customer.note}</div>
                </div>
              )}
            </div>
          ) : (
            // Edit / Add mode
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Row label="HỌ VÀ TÊN *">
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Nguyễn Văn A" style={inputStyle()}
                    onFocus={e => (e.target.style.borderColor = '#D4840A')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                </Row>
                <Row label="MÃ KHÁCH HÀNG">
                  <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}
                    placeholder="VD: NDT" style={inputStyle()}
                    onFocus={e => (e.target.style.borderColor = '#D4840A')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                </Row>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Row label="SỐ ĐIỆN THOẠI">
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="09xx xxx xxx" style={inputStyle()}
                    onFocus={e => (e.target.style.borderColor = '#D4840A')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                </Row>
                <Row label="EMAIL">
                  <input value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="email@gmail.com" style={inputStyle()}
                    onFocus={e => (e.target.style.borderColor = '#D4840A')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                </Row>
              </div>
              <Row label="XẾP HẠNG">
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {RANKS.map(r => (
                    <button key={r} onClick={() => set('rank', r)} style={{
                      padding: '7px 14px', borderRadius: 20,
                      border: `1.5px solid ${form.rank === r ? RANK_CONFIG[r].border : '#e8e8e8'}`,
                      background: form.rank === r ? RANK_CONFIG[r].bg : '#fafafa',
                      color: form.rank === r ? RANK_CONFIG[r].text : '#666',
                      fontWeight: form.rank === r ? 700 : 400,
                      fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.12s',
                    }}>
                      {RANK_CONFIG[r].emoji} {r}
                    </button>
                  ))}
                </div>
              </Row>
              <Row label="GHI CHÚ">
                <textarea value={form.note} onChange={e => set('note', e.target.value)}
                  placeholder="Ghi chú về khách hàng..."
                  rows={2}
                  style={{
                    ...inputStyle(), resize: 'none' as const,
                    lineHeight: 1.6,
                  }}
                  onFocus={e => (e.target.style.borderColor = '#D4840A')}
                  onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
                />
              </Row>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isView && (
          <div style={{
            padding: '16px 24px', borderTop: '0.5px solid #f0f0ee',
            display: 'flex', gap: 10, flexShrink: 0,
          }}>
            <button onClick={handleSave} disabled={!form.name.trim()} style={{
              flex: 1, padding: '12px', borderRadius: 10, border: 'none',
              background: form.name.trim() ? '#D4840A' : '#e0e0e0',
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: form.name.trim() ? 'pointer' : 'default', fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}>
              {isAdd ? '+ Thêm khách hàng' : '✓ Lưu thay đổi'}
            </button>
            <button onClick={onClose} style={{
              flex: 1, padding: '12px', borderRadius: 10,
              border: '1.5px solid #e0e0e0', background: '#fff',
              color: '#666', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Hủy</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onCancel}>
      <div style={{
        background: '#fff', borderRadius: 16, width: 360, padding: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        fontFamily: "'Be Vietnam Pro', sans-serif", textAlign: 'center',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Xóa khách hàng?</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
          Bạn chắc chắn muốn xóa <strong style={{ color: '#1a1a1a' }}>{name}</strong>?<br />Hành động này không thể hoàn tác.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '11px', borderRadius: 10, border: 'none',
            background: '#A32D2D', color: '#fff', fontWeight: 700, fontSize: 13.5,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Xóa</button>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: 10,
            border: '1.5px solid #e0e0e0', background: '#fff',
            color: '#555', fontWeight: 600, fontSize: 13.5,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KhachHang() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [rankFilter, setRankFilter] = useState<Rank | 'all'>('all');
  const [modal, setModal] = useState<{ mode: ModalMode; customer: Customer | null }>({ mode: null, customer: null });
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let list = customers.filter(c => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.phone.includes(q)
      ) && (rankFilter === 'all' || c.rank === rankFilter);
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name, 'vi');
      else if (sortField === 'rank') cmp = RANK_ORDER[a.rank] - RANK_ORDER[b.rank];
      else if (sortField === 'visits') cmp = a.visits - b.visits;
      else if (sortField === 'totalSpent') cmp = a.totalSpent - b.totalSpent;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [customers, search, sortField, sortDir, rankFilter]);

  const handleSave = (c: Customer) => {
    setCustomers(prev => prev.some(x => x.id === c.id)
      ? prev.map(x => x.id === c.id ? c : x)
      : [...prev, c]
    );
  };

  const handleDelete = (id: number) => setCustomers(prev => prev.filter(x => x.id !== id));

  const SortIcon = ({ field }: { field: SortField }) => (
    <span style={{ fontSize: 10, color: sortField === field ? '#D4840A' : '#ccc', marginLeft: 3 }}>
      {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  // Summary by rank
  const rankCounts = useMemo(() =>
    RANKS.reduce((acc, r) => ({ ...acc, [r]: customers.filter(c => c.rank === r).length }), {} as Record<Rank, number>)
  , [customers]);

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px 24px',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        background: '#f7f7f5',
      }}>
      {/* Modals */}
      {modal.mode && (
        <CustomerModal
          mode={modal.mode}
          customer={modal.customer}
          onSave={handleSave}
          onClose={() => setModal({ mode: null, customer: null })}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={() => { handleDelete(deleteTarget.id); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Khách hàng</div>
          <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 2 }}>{customers.length} khách hàng đã đăng ký</div>
        </div>
        <button
          onClick={() => setModal({ mode: 'add', customer: null })}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', borderRadius: 10, border: 'none',
            background: '#D4840A', color: '#fff',
            fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
            fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(212,132,10,0.3)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Thêm khách hàng
        </button>
      </div>

      {/* Rank filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          onClick={() => setRankFilter('all')}
          style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer',
            border: `1.5px solid ${rankFilter === 'all' ? '#D4840A' : '#e0e0e0'}`,
            background: rankFilter === 'all' ? '#FFF3E0' : '#fff',
            color: rankFilter === 'all' ? '#D4840A' : '#666',
            fontWeight: rankFilter === 'all' ? 700 : 400, fontFamily: 'inherit',
            transition: 'all 0.12s',
          }}
        >
          Tất cả ({customers.length})
        </button>
        {RANKS.map(r => (
          <button key={r} onClick={() => setRankFilter(rankFilter === r ? 'all' : r)} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12.5, cursor: 'pointer',
            border: `1.5px solid ${rankFilter === r ? RANK_CONFIG[r].border : '#e0e0e0'}`,
            background: rankFilter === r ? RANK_CONFIG[r].bg : '#fff',
            color: rankFilter === r ? RANK_CONFIG[r].text : '#666',
            fontWeight: rankFilter === r ? 700 : 400, fontFamily: 'inherit',
            transition: 'all 0.12s',
          }}>
            {RANK_CONFIG[r].emoji} {r} ({rankCounts[r]})
          </button>
        ))}
      </div>

      {/* Search + sort bar */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 340 }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm tên, mã, số điện thoại..."
            style={{
              width: '100%', boxSizing: 'border-box',
              border: '1px solid #e8e8e8', borderRadius: 9,
              padding: '9px 12px 9px 34px', fontSize: 13,
              fontFamily: 'inherit', outline: 'none',
              color: '#1a1a1a', background: '#fff',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.target.style.borderColor = '#D4840A')}
            onBlur={e => (e.target.style.borderColor = '#e8e8e8')}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#aaa' }}>Sắp xếp:</span>
          {([
            { field: 'name' as SortField, label: 'Tên' },
            { field: 'rank' as SortField, label: 'Hạng' },
            { field: 'visits' as SortField, label: 'Lượt đặt' },
            { field: 'totalSpent' as SortField, label: 'Chi tiêu' },
          ]).map(s => (
            <button key={s.field} onClick={() => toggleSort(s.field)} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 12,
              border: `1px solid ${sortField === s.field ? '#D4840A' : '#e8e8e8'}`,
              background: sortField === s.field ? '#FFF3E0' : '#fff',
              color: sortField === s.field ? '#D4840A' : '#666',
              fontWeight: sortField === s.field ? 600 : 400,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
            }}>
              {s.label}<SortIcon field={s.field} />
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 14,
        border: '0.5px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '48px 1fr 1fr 100px 80px 90px 80px',
          padding: '10px 16px', background: '#fafafa',
          borderBottom: '0.5px solid #ebebeb',
        }}>
          {['STT', 'Tên', 'Liên hệ', 'Xếp hạng', 'Lượt đặt', 'Chi tiêu', ''].map((h, i) => (
            <div key={i} style={{
              fontSize: 11.5, fontWeight: 600, color: '#999',
              letterSpacing: '0.04em',
              textAlign: i >= 4 && i <= 5 ? 'right' : i === 6 ? 'center' : 'left',
            }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{
            padding: '48px 24px', textAlign: 'center',
            color: '#bbb', fontSize: 13,
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            Không tìm thấy khách hàng nào
          </div>
        ) : (
          filtered.map((c, idx) => (
            <div
              key={c.id}
              style={{
                display: 'grid', gridTemplateColumns: '48px 1fr 1fr 100px 80px 90px 80px',
                padding: '13px 16px', borderBottom: '0.5px solid #f5f5f3',
                transition: 'background 0.1s', cursor: 'pointer',
                alignItems: 'center',
              }}
              onClick={() => setModal({ mode: 'view', customer: c })}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#fafaf8'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
            >
              {/* STT */}
              <div style={{ fontSize: 13, color: '#bbb', fontWeight: 500 }}>{idx + 1}</div>

              {/* Tên */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: avatarColor(c.rank) + '18',
                  border: `1.5px solid ${avatarColor(c.rank)}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11.5, fontWeight: 700, color: avatarColor(c.rank),
                }}>{initials(c.name)}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a1a' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#bbb', marginTop: 1 }}>{c.code}</div>
                </div>
              </div>

              {/* Liên hệ */}
              <div>
                <div style={{ fontSize: 13, color: '#555' }}>{c.phone}</div>
                <div style={{ fontSize: 11, color: '#bbb', marginTop: 1 }}>{c.email || '—'}</div>
              </div>

              {/* Xếp hạng */}
              <div><RankBadge rank={c.rank} small /></div>

              {/* Lượt đặt */}
              <div style={{ textAlign: 'right', fontSize: 13.5, fontWeight: 600, color: '#378ADD' }}>
                {c.visits}
              </div>

              {/* Chi tiêu */}
              <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                {fmt(c.totalSpent)}
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex', gap: 6, justifyContent: 'center',
              }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setModal({ mode: 'edit', customer: c })}
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    border: '1px solid #e8e8e8', background: '#fff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#555', transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4840A';
                    (e.currentTarget as HTMLButtonElement).style.color = '#D4840A';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8';
                    (e.currentTarget as HTMLButtonElement).style.color = '#555';
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteTarget(c)}
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    border: '1px solid #e8e8e8', background: '#fff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#bbb', transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#FECDD3';
                    (e.currentTarget as HTMLButtonElement).style.color = '#A32D2D';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8';
                    (e.currentTarget as HTMLButtonElement).style.color = '#bbb';
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer count */}
      {filtered.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
          Hiển thị {filtered.length} / {customers.length} khách hàng
        </div>
      )}
    </div>
    </>
  );
}