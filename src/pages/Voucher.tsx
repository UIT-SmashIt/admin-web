import { useState, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Voucher {
  id: number;
  code: string;
  service: string;
  content: string;
  type: 'gift' | 'discount' | 'rental';
  discount?: number;
  usageLimit: number;
  usedCount: number;
  expiry: string;
  active: boolean;
}

type ModalMode = 'add' | 'edit' | 'view' | null;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL: Voucher[] = [
  { id: 1, code: 'COCA5T1', service: 'CocaCola', content: 'Mua 5 tặng 1', type: 'gift', usageLimit: 100, usedCount: 34, expiry: '31/12/2026', active: true },
  { id: 2, code: 'VOT5H', service: 'Vợt', content: 'Thuê 5h tặng 1h', type: 'rental', usageLimit: 50, usedCount: 18, expiry: '30/06/2026', active: true },
  { id: 3, code: 'CAU1H2T', service: 'Cầu', content: 'Mua 1 hộp tặng 2 trái', type: 'gift', usageLimit: 200, usedCount: 67, expiry: '31/03/2026', active: true },
  { id: 4, code: 'GIAM20', service: 'Đặt sân', content: 'Giảm 20% tổng bill', type: 'discount', discount: 20, usageLimit: 30, usedCount: 30, expiry: '15/04/2026', active: false },
  { id: 5, code: 'NUOC3T1', service: 'Nước suối', content: 'Mua 3 tặng 1', type: 'gift', usageLimit: 80, usedCount: 12, expiry: '31/12/2026', active: true },
];

const SERVICES = ['CocaCola', 'Vợt', 'Cầu', 'Đặt sân', 'Nước suối', 'Snack', 'Phụ kiện', 'Tất cả dịch vụ'];
const TYPES = [
  { value: 'gift', label: 'Tặng kèm', color: '#22863a', bg: '#F0FDF4' },
  { value: 'discount', label: 'Giảm giá', color: '#D4840A', bg: '#FFF7ED' },
  { value: 'rental', label: 'Thuê thêm', color: '#378ADD', bg: '#EFF6FF' },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: Voucher['type'] }) {
  const cfg = TYPES.find(t => t.value === type)!;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 12,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 600,
    }}>{cfg.label}</span>
  );
}

function UsageBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, (used / limit) * 100);
  const color = pct >= 100 ? '#A32D2D' : pct >= 80 ? '#D4840A' : '#22863a';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: '#f0f0ee', borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: 4, background: color, borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 10.5, color, fontWeight: 600, whiteSpace: 'nowrap' }}>{used}/{limit}</span>
    </div>
  );
}

// ─── Voucher Modal ────────────────────────────────────────────────────────────

function VoucherModal({ mode, voucher, onSave, onClose }: {
  mode: ModalMode; voucher: Voucher | null; onSave: (v: Voucher) => void; onClose: () => void;
}) {
  const isView = mode === 'view';
  const [form, setForm] = useState({
    code: voucher?.code ?? '',
    service: voucher?.service ?? SERVICES[0],
    content: voucher?.content ?? '',
    type: voucher?.type ?? ('gift' as Voucher['type']),
    discount: voucher?.discount ?? 10,
    usageLimit: voucher?.usageLimit ?? 100,
    expiry: voucher?.expiry ?? '',
    active: voucher?.active ?? true,
  });

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.code.trim() || !form.content.trim()) return;
    onSave({
      id: voucher?.id ?? Date.now(),
      usedCount: voucher?.usedCount ?? 0,
      ...form,
    });
    onClose();
  };

  const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1.5px solid #e8e8e8', borderRadius: 9,
    padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', background: '#fff', outline: 'none',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: 500, boxShadow: '0 24px 80px rgba(0,0,0,0.18)', maxHeight: '88vh', display: 'flex', flexDirection: 'column', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
            {mode === 'add' ? '🎟️ Tạo voucher mới' : mode === 'edit' ? '✏️ Chỉnh sửa voucher' : '🎟️ Chi tiết voucher'}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
          {isView && voucher ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '16px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #FFF7ED, #FFF3E0)', border: '1px solid #FDE68A', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#B45309', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 4 }}>MÃ VOUCHER</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#D4840A', letterSpacing: '0.08em' }}>{voucher.code}</div>
                <div style={{ marginTop: 8 }}><TypeBadge type={voucher.type} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Dịch vụ', value: voucher.service },
                  { label: 'Hết hạn', value: voucher.expiry },
                  { label: 'Nội dung', value: voucher.content },
                  { label: 'Trạng thái', value: voucher.active ? '✅ Đang hoạt động' : '⛔ Đã tắt' },
                ].map(f => (
                  <div key={f.label} style={{ padding: '12px 14px', borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0ee' }}>
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4, fontWeight: 500 }}>{f.label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Mức sử dụng</div>
                <UsageBar used={voucher.usedCount} limit={voucher.usageLimit} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>MÃ VOUCHER *</label>
                  <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="VD: COCA5T1" style={inp} onFocus={e => (e.target.style.borderColor = '#D4840A')} onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>DỊCH VỤ</label>
                  <select value={form.service} onChange={e => set('service', e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>NỘI DUNG *</label>
                <input value={form.content} onChange={e => set('content', e.target.value)} placeholder="Mua 5 tặng 1, Giảm 20%..." style={inp} onFocus={e => (e.target.style.borderColor = '#D4840A')} onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
              </div>

              <div>
                <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 8, fontWeight: 600 }}>LOẠI VOUCHER</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {TYPES.map(t => (
                    <button key={t.value} onClick={() => set('type', t.value)} style={{
                      flex: 1, padding: '8px 10px', borderRadius: 9,
                      border: `1.5px solid ${form.type === t.value ? t.color : '#e0e0e0'}`,
                      background: form.type === t.value ? t.bg : '#fafafa',
                      color: form.type === t.value ? t.color : '#666',
                      fontWeight: form.type === t.value ? 700 : 400,
                      fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
                    }}>{t.label}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GIỚI HẠN SỬ DỤNG</label>
                  <input type="number" min={1} value={form.usageLimit} onChange={e => set('usageLimit', +e.target.value)} style={inp} onFocus={e => (e.target.style.borderColor = '#D4840A')} onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>NGÀY HẾT HẠN</label>
                  <input type="date" value={form.expiry} onChange={e => set('expiry', e.target.value)} style={inp} onFocus={e => (e.target.style.borderColor = '#D4840A')} onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => set('active', !form.active)} style={{
                  width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                  background: form.active ? '#D4840A' : '#e0e0e0', position: 'relative', transition: 'background 0.2s',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 2, left: form.active ? 20 : 2, transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
                <span style={{ fontSize: 13, color: form.active ? '#22863a' : '#888' }}>
                  {form.active ? 'Đang hoạt động' : 'Tắt voucher'}
                </span>
              </div>
            </div>
          )}
        </div>

        {!isView && (
          <div style={{ padding: '16px 24px', borderTop: '0.5px solid #f0f0ee', display: 'flex', gap: 10 }}>
            <button onClick={handleSave} disabled={!form.code.trim() || !form.content.trim()} style={{
              flex: 1, padding: '12px', borderRadius: 10, border: 'none',
              background: (form.code && form.content) ? '#D4840A' : '#e0e0e0',
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: (form.code && form.content) ? 'pointer' : 'default', fontFamily: 'inherit',
            }}>
              {mode === 'add' ? '🎟️ Tạo voucher' : '✓ Lưu thay đổi'}
            </button>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ mode: ModalMode; voucher: Voucher | null }>({ mode: null, voucher: null });
  const [deleteTarget, setDeleteTarget] = useState<Voucher | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return [...vouchers]
      .filter(v => v.code.toLowerCase().includes(q) || v.service.toLowerCase().includes(q) || v.content.toLowerCase().includes(q))
      .sort((a, b) => sortDir === 'asc' ? a.service.localeCompare(b.service, 'vi') : b.service.localeCompare(a.service, 'vi'));
  }, [vouchers, search, sortDir]);

  const handleSave = (v: Voucher) => setVouchers(prev => prev.some(x => x.id === v.id) ? prev.map(x => x.id === v.id ? v : x) : [...prev, v]);
  const handleDelete = (id: number) => setVouchers(prev => prev.filter(x => x.id !== id));

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", background: '#f7f7f5' }}>
      {modal.mode && <VoucherModal mode={modal.mode} voucher={modal.voucher} onSave={handleSave} onClose={() => setModal({ mode: null, voucher: null })} />}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDeleteTarget(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 340, padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: "'Be Vietnam Pro', sans-serif", textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🗑️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Xóa voucher?</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Voucher <strong style={{ color: '#D4840A' }}>{deleteTarget.code}</strong> sẽ bị xóa vĩnh viễn.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { handleDelete(deleteTarget.id); setDeleteTarget(null); }} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: '#A32D2D', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Voucher</div>
          <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 2 }}>{vouchers.filter(v => v.active).length} đang hoạt động · {vouchers.length} tổng cộng</div>
        </div>
        <button onClick={() => setModal({ mode: 'add', voucher: null })} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, border: 'none', background: '#D4840A', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(212,132,10,0.3)' }}>
          🎟️ Tạo voucher
        </button>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã, dịch vụ, nội dung..." style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e8e8e8', borderRadius: 9, padding: '9px 12px 9px 34px', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1a1a1a', background: '#fff' }} onFocus={e => (e.target.style.borderColor = '#D4840A')} onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>
        <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} style={{ padding: '9px 14px', borderRadius: 9, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#666', fontFamily: 'inherit' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2" /></svg>
          {sortDir === 'asc' ? 'A→Z' : 'Z→A'}
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '48px 90px 1fr 110px 130px 90px 80px', padding: '10px 16px', background: '#fafafa', borderBottom: '0.5px solid #ebebeb' }}>
          {['STT', 'Mã', 'Nội dung', 'Dịch vụ', 'Sử dụng', 'Hết hạn', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 11.5, fontWeight: 600, color: '#999', letterSpacing: '0.04em', textAlign: i === 6 ? 'center' : 'left' }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎟️</div>Không tìm thấy voucher nào
          </div>
        ) : filtered.map((v, idx) => (
          <div key={v.id}
            style={{ display: 'grid', gridTemplateColumns: '48px 90px 1fr 110px 130px 90px 80px', padding: '13px 16px', borderBottom: '0.5px solid #f5f5f3', cursor: 'pointer', transition: 'background 0.1s', alignItems: 'center', opacity: v.active ? 1 : 0.6 }}
            onClick={() => setModal({ mode: 'view', voucher: v })}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#fafaf8'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = ''}
          >
            <div style={{ fontSize: 13, color: '#bbb' }}>{idx + 1}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#D4840A', letterSpacing: '0.04em', background: '#FFF7ED', padding: '3px 8px', borderRadius: 6, display: 'inline-block' }}>{v.code}</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{v.content}</div>
              <div style={{ marginTop: 3 }}><TypeBadge type={v.type} /></div>
            </div>
            <div style={{ fontSize: 13, color: '#555' }}>{v.service}</div>
            <div style={{ paddingRight: 12 }}><UsageBar used={v.usedCount} limit={v.usageLimit} /></div>
            <div style={{ fontSize: 12, color: '#888' }}>{v.expiry}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setModal({ mode: 'edit', voucher: v })} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', transition: 'all 0.12s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0'; (e.currentTarget as HTMLButtonElement).style.color = '#D4840A'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#666'; }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </button>
              <button onClick={() => setDeleteTarget(v)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', transition: 'all 0.12s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5'; (e.currentTarget as HTMLButtonElement).style.color = '#A32D2D'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#bbb'; }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
          Hiển thị {filtered.length} / {vouchers.length} voucher
        </div>
      )}
    </div>
  );
}