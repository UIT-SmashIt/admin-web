import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockVariant {
  id: number;
  qty: number;
  unit: string;
  price?: number;
  saleType: 'Sỉ' | 'Lẻ';
}

interface StockItem {
  id: number;
  name: string;
  category: string;
  capacity?: string;
  variants: StockVariant[];
}

interface ImportHistory {
  id: number;
  date: string;
  itemName: string;
  qty: number;
  unit: string;
  note?: string;
}

type View = 'list' | 'import';

// ─── Mock data ────────────────────────────────────────────────────────────────

const STOCK_ITEMS: StockItem[] = [
  {
    id: 1, name: 'Coca Cola', category: 'Nước',
    variants: [{ id: 11, qty: 20, unit: '', price: undefined, saleType: 'Sỉ' }],
  },
  {
    id: 2, name: 'Pepsi', category: 'Nước',
    variants: [{ id: 21, qty: 20, unit: '', price: undefined, saleType: 'Sỉ' }],
  },
  {
    id: 3, name: 'Aquafina', category: 'Nước',
    variants: [{ id: 31, qty: 20, unit: '', price: undefined, saleType: 'Sỉ' }],
  },
  {
    id: 4, name: 'Loại 1', category: 'Cầu',
    variants: [
      { id: 41, qty: 50, unit: 'Hộp', price: 250000, saleType: 'Sỉ' },
      { id: 42, qty: 20, unit: 'Trái', price: 25000, saleType: 'Lẻ' },
    ],
  },
  {
    id: 5, name: 'Loại 2', category: 'Cầu',
    variants: [
      { id: 51, qty: 40, unit: 'Hộp', price: 200000, saleType: 'Sỉ' },
      { id: 52, qty: 10, unit: 'Trái', price: 20000, saleType: 'Lẻ' },
    ],
  },
  {
    id: 6, name: 'Vợt Victor JS-12', category: 'Vợt',
    variants: [{ id: 61, qty: 8, unit: 'Cái', price: 350000, saleType: 'Lẻ' }],
  },
  {
    id: 7, name: 'Quấn cán Li-Ning', category: 'Phụ kiện',
    variants: [
      { id: 71, qty: 30, unit: 'Cuộn', price: 35000, saleType: 'Lẻ' },
    ],
  },
];

const IMPORT_HISTORY: ImportHistory[] = [
  { id: 1, date: '09/04/2026', itemName: 'Coca Cola', qty: 50, unit: 'Chai', note: 'Nhập kho sáng' },
  { id: 2, date: '08/04/2026', itemName: 'Cầu Loại 1', qty: 20, unit: 'Hộp', note: '' },
  { id: 3, date: '07/04/2026', itemName: 'Aquafina', qty: 100, unit: 'Chai', note: 'Đợt 2' },
  { id: 4, date: '06/04/2026', itemName: 'Vợt Victor JS-12', qty: 5, unit: 'Cái', note: '' },
];

const CATEGORIES_COLOR: Record<string, string> = {
  'Nước': '#E6F1FB',
  'Cầu': '#FFF3E0',
  'Vợt': '#F0FBF0',
  'Phụ kiện': '#F9F0FB',
};
const CATEGORIES_TEXT: Record<string, string> = {
  'Nước': '#1565C0',
  'Cầu': '#D4840A',
  'Vợt': '#2E7D32',
  'Phụ kiện': '#7B1FA2',
};

const fmt = (n: number) => n.toLocaleString('vi-VN');

// ─── Import Form View ─────────────────────────────────────────────────────────

function ImportView({ onBack }: { onBack: () => void }) {
  const [itemName, setItemName] = useState('');
  const [service, setService] = useState('');
  const [capacity, setCapacity] = useState('');
  const [unit, setUnit] = useState('');
  const [qty, setQty] = useState('');
  const [saleType, setSaleType] = useState<'Sỉ' | 'Lẻ' | ''>('');
  const [price, setPrice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!itemName || !qty || !unit) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setItemName(''); setService(''); setCapacity('');
      setUnit(''); setQty(''); setSaleType(''); setPrice('');
    }, 1800);
  };

  const inputStyle = (filled: boolean): React.CSSProperties => ({
    width: '100%', boxSizing: 'border-box' as const,
    border: `1.5px solid ${filled ? '#D4840A' : '#e8e8e8'}`,
    borderRadius: 9, padding: '11px 14px',
    fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', background: filled ? '#FFFBF5' : '#fafafa',
    outline: 'none', transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left: form */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '22px 28px',
        background: '#fff',
        borderRight: '0.5px solid rgba(0,0,0,0.08)',
      }}>
        {/* Back */}
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#D4840A', fontWeight: 600, fontSize: 14.5,
            fontFamily: 'inherit', padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Nhập hàng
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 500 }}>
              TÊN MẶT HÀNG <span style={{ color: '#D4840A' }}>*</span>
            </label>
            <input
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="Nhập tên mặt hàng"
              style={inputStyle(!!itemName)}
              onFocus={e => (e.target.style.borderColor = '#D4840A')}
              onBlur={e => (e.target.style.borderColor = itemName ? '#D4840A' : '#e8e8e8')}
            />
          </div>

          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 500 }}>
              CHỌN DỊCH VỤ / DANH MỤC
            </label>
            <select
              value={service}
              onChange={e => setService(e.target.value)}
              style={{ ...inputStyle(!!service), appearance: 'none' as const }}
            >
              <option value="">-- Chọn danh mục --</option>
              {['Nước', 'Cầu', 'Vợt', 'Phụ kiện', 'Snack'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 500 }}>
              DUNG TÍCH / QUY CÁCH (nếu có)
            </label>
            <input
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              placeholder="VD: 500ml, 12 chai/thùng..."
              style={inputStyle(!!capacity)}
              onFocus={e => (e.target.style.borderColor = '#D4840A')}
              onBlur={e => (e.target.style.borderColor = capacity ? '#D4840A' : '#e8e8e8')}
            />
          </div>
        </div>
      </div>

      {/* Right: details */}
      <div style={{
        width: 300, padding: '22px 22px', background: '#f7f7f5',
        display: 'flex', flexDirection: 'column', gap: 14,
        overflowY: 'auto',
      }}>
        <div style={{
          fontSize: 11.5, fontWeight: 600, color: '#aaa',
          textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2,
        }}>
          Thông tin nhập
        </div>

        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 500 }}>
            ĐƠN VỊ <span style={{ color: '#D4840A' }}>*</span>
          </label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            style={{ ...inputStyle(!!unit), background: !!unit ? '#FFFBF5' : '#fff', appearance: 'none' as const }}
          >
            <option value="">-- Chọn đơn vị --</option>
            {['Chai', 'Lon', 'Thùng', 'Hộp', 'Trái', 'Cái', 'Cuộn', 'Gói', 'Đôi'].map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 500 }}>
            SỐ LƯỢNG <span style={{ color: '#D4840A' }}>*</span>
          </label>
          <input
            type="number" min={1}
            value={qty}
            onChange={e => setQty(e.target.value)}
            placeholder="0"
            style={{ ...inputStyle(!!qty), background: !!qty ? '#FFFBF5' : '#fff' }}
            onFocus={e => (e.target.style.borderColor = '#D4840A')}
            onBlur={e => (e.target.style.borderColor = qty ? '#D4840A' : '#e8e8e8')}
          />
        </div>

        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 500 }}>
            SỈ / LẺ
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['Sỉ', 'Lẻ'] as const).map(t => (
              <button
                key={t}
                onClick={() => setSaleType(saleType === t ? '' : t)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 9,
                  border: `1.5px solid ${saleType === t ? '#D4840A' : '#e0e0e0'}`,
                  background: saleType === t ? '#FFF3E0' : '#fff',
                  color: saleType === t ? '#D4840A' : '#666',
                  fontWeight: saleType === t ? 600 : 400,
                  fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 500 }}>
            GIÁ NHẬP (đ)
          </label>
          <input
            value={price}
            onChange={e => setPrice(e.target.value.replace(/\D/g, ''))}
            placeholder="Nhập giá..."
            style={{ ...inputStyle(!!price), background: !!price ? '#FFFBF5' : '#fff' }}
            onFocus={e => (e.target.style.borderColor = '#D4840A')}
            onBlur={e => (e.target.style.borderColor = price ? '#D4840A' : '#e8e8e8')}
          />
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleSubmit}
          disabled={!itemName || !qty || !unit}
          style={{
            padding: '13px', borderRadius: 10, border: 'none',
            background: submitted ? '#22863a' : (itemName && qty && unit ? '#D4840A' : '#e0e0e0'),
            color: '#fff', fontWeight: 700, fontSize: 14,
            cursor: (itemName && qty && unit) ? 'pointer' : 'default',
            fontFamily: 'inherit', transition: 'background 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {submitted ? '✓ Đã nhập hàng!' : 'Nhập hàng'}
        </button>
      </div>
    </div>
  );
}

// ─── Stock List View ──────────────────────────────────────────────────────────

function StockListView({
  onImport,
  onShowHistory,
}: {
  onImport: () => void;
  onShowHistory: () => void;
}) {
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Group by category
  const grouped: Record<string, StockItem[]> = {};
  STOCK_ITEMS.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  const filteredGrouped: Record<string, StockItem[]> = {};
  Object.entries(grouped).forEach(([cat, items]) => {
    const filtered = items.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length) filteredGrouped[cat] = filtered;
  });

  const totalItems = STOCK_ITEMS.reduce((s, i) => s + i.variants.reduce((vs, v) => vs + v.qty, 0), 0);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#fff',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        flexShrink: 0, flexWrap: 'wrap',
      }}>
        <button
          onClick={onImport}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: '#D4840A', color: '#fff',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nhập hàng
        </button>

        <button
          onClick={() => {}}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 14px', borderRadius: 8,
            border: '1px dashed #D4840A', background: 'transparent',
            color: '#D4840A', fontWeight: 500, fontSize: 13,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Thêm dịch vụ mới
        </button>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm mặt hàng..."
            style={{
              border: '1px solid #e8e8e8', borderRadius: 8,
              padding: '7px 12px 7px 30px', fontSize: 12.5,
              fontFamily: 'inherit', outline: 'none', width: 180,
              color: '#1a1a1a', background: '#fafafa',
            }}
          />
        </div>

        <button
          onClick={onShowHistory}
          style={{
            padding: '8px 14px', borderRadius: 8,
            border: '1px solid #e8e8e8', background: '#fafafa',
            color: '#555', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          Lịch sử nhập hàng
        </button>
      </div>

      {/* Summary chips */}
      <div style={{
        display: 'flex', gap: 10, padding: '10px 20px',
        borderBottom: '0.5px solid rgba(0,0,0,0.06)',
        flexShrink: 0, flexWrap: 'wrap',
      }}>
        {[
          { label: 'Tổng tồn kho', value: `${fmt(totalItems)} đơn vị`, color: '#1a1a1a' },
          { label: 'Danh mục', value: `${Object.keys(grouped).length}`, color: '#378ADD' },
          { label: 'Mặt hàng', value: `${STOCK_ITEMS.length}`, color: '#D4840A' },
        ].map(chip => (
          <div key={chip.label} style={{
            padding: '5px 14px', borderRadius: 20,
            background: '#f5f5f3', fontSize: 12,
            display: 'flex', gap: 6, alignItems: 'center',
          }}>
            <span style={{ color: '#888' }}>{chip.label}:</span>
            <span style={{ fontWeight: 600, color: chip.color }}>{chip.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr style={{ background: '#f7f7f5' }}>
              {['Mặt hàng', 'SL còn', 'Đơn vị', 'Giá', 'Kiểu bán'].map((h, i) => (
                <th key={h} style={{
                  padding: '10px 16px',
                  textAlign: i === 0 ? 'left' : 'center',
                  color: '#888', fontWeight: 600, fontSize: 12,
                  borderBottom: '1px solid #ebebeb',
                  letterSpacing: '0.03em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredGrouped).map(([cat, items]) => {
              const isExp = expandedCategory !== cat;
              return [
                // Category row
                <tr
                  key={`cat-${cat}`}
                  onClick={() => setExpandedCategory(isExp ? cat : null)}
                  style={{ cursor: 'pointer' }}
                >
                  <td
                    colSpan={5}
                    style={{
                      padding: '8px 16px',
                      background: CATEGORIES_COLOR[cat] ?? '#f0f0ee',
                      borderBottom: '0.5px solid rgba(0,0,0,0.06)',
                      borderTop: '0.5px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 11.5, fontWeight: 700,
                        color: CATEGORIES_TEXT[cat] ?? '#333',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {cat}
                      </span>
                      <span style={{
                        fontSize: 10.5, background: CATEGORIES_TEXT[cat] ?? '#333',
                        color: '#fff', borderRadius: 10, padding: '1px 7px',
                        fontWeight: 500,
                      }}>
                        {items.length}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 10, color: '#aaa' }}>
                        {isExp ? '▼' : '▲'}
                      </span>
                    </div>
                  </td>
                </tr>,

                // Item rows
                ...items.map(item =>
                  item.variants.map((v, vi) => (
                    <tr
                      key={`${item.id}-${v.id}`}
                      style={{ borderBottom: '0.5px solid #f5f5f3' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                    >
                      {/* Name only on first variant row */}
                      <td style={{
                        padding: '10px 16px',
                        color: '#1a1a1a', fontWeight: vi === 0 ? 500 : 400,
                        fontSize: 13,
                        paddingLeft: vi === 0 ? 24 : 36,
                      }}>
                        {vi === 0 ? item.name : ''}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <span style={{
                          fontWeight: 600,
                          color: v.qty < 10 ? '#A32D2D' : v.qty < 30 ? '#D4840A' : '#22863a',
                          fontSize: 13.5,
                        }}>
                          {v.qty}
                        </span>
                      </td>
                      <td style={{
                        padding: '10px 16px', textAlign: 'center',
                        color: '#666', fontSize: 12.5,
                      }}>
                        {v.unit || '—'}
                      </td>
                      <td style={{
                        padding: '10px 16px', textAlign: 'center',
                        fontWeight: 500, color: v.price ? '#1a1a1a' : '#ccc',
                        fontSize: 13,
                      }}>
                        {v.price ? fmt(v.price) : '—'}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                          background: v.saleType === 'Sỉ' ? '#E6F1FB' : '#FFF3E0',
                          color: v.saleType === 'Sỉ' ? '#1565C0' : '#D4840A',
                        }}>
                          {v.saleType}
                        </span>
                      </td>
                    </tr>
                  ))
                ),
              ];
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── History Modal ────────────────────────────────────────────────────────────

function HistoryModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, width: 560,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        overflow: 'hidden', fontFamily: "'Be Vietnam Pro', sans-serif",
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', borderBottom: '0.5px solid #f0f0ee',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Lịch sử nhập hàng</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{IMPORT_HISTORY.length} lần nhập gần đây</div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%', border: 'none',
            background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Ngày', 'Mặt hàng', 'Số lượng', 'Đơn vị', 'Ghi chú'].map(h => (
                  <th key={h} style={{
                    padding: '9px 14px', textAlign: 'left',
                    color: '#888', fontWeight: 500, fontSize: 12,
                    borderBottom: '1px solid #f0f0ee',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {IMPORT_HISTORY.map(h => (
                <tr key={h.id} style={{ borderBottom: '0.5px solid #f5f5f3' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                  <td style={{ padding: '10px 14px', color: '#888', fontSize: 12 }}>{h.date}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500, color: '#1a1a1a' }}>{h.itemName}</td>
                  <td style={{ padding: '10px 14px', color: '#22863a', fontWeight: 600 }}>{h.qty}</td>
                  <td style={{ padding: '10px 14px', color: '#666' }}>{h.unit}</td>
                  <td style={{ padding: '10px 14px', color: '#aaa', fontSize: 12 }}>{h.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KhoDichVu() {
  const [view, setView] = useState<View>('list');
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#f7f7f5', fontFamily: "'Be Vietnam Pro', sans-serif",
    }}>
      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 20px',
        background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Kho & dịch vụ</div>
        {view === 'import' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
            <span style={{ fontSize: 14, color: '#D4840A', fontWeight: 500 }}>Nhập hàng</span>
          </>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {view === 'list' ? (
          <StockListView
            onImport={() => setView('import')}
            onShowHistory={() => setShowHistory(true)}
          />
        ) : (
          <ImportView onBack={() => setView('list')} />
        )}
      </div>
    </div>
  );
}