import { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════
// TYPES  (export để dùng ở các trang khác, VD: BanHang)
// ═══════════════════════════════════════════════════════════════

export interface StockVariant {
  id: number;
  unit: string;
  price: number;
  saleType: 'Sỉ' | 'Lẻ';
  qty: number;
}

export interface StockItem {
  id: number;
  name: string;
  category: string;
  capacity: string;
  variants: StockVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ImportRecord {
  id: number;
  itemId: number;
  itemName: string;
  variantId: number;
  unit: string;
  qty: number;
  note: string;
  importedAt: string;
}

type View = 'list' | 'import';
type ItemModalMode = 'add' | 'edit' | null;

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const UNIT_LIST = ['Chai', 'Lon', 'Thùng', 'Hộp', 'Trái', 'Cái', 'Cuộn', 'Gói', 'Đôi', 'Bộ'];

export interface Category {
  name: string;
  color: string;  // background
  text: string;   // text/border
}

const INITIAL_CATEGORIES: Category[] = [
  { name: 'Nước',     color: '#E6F1FB', text: '#1565C0' },
  { name: 'Cầu',      color: '#FFF3E0', text: '#D4840A' },
  { name: 'Vợt',      color: '#F0FBF0', text: '#2E7D32' },
  { name: 'Phụ kiện', color: '#F9F0FB', text: '#7B1FA2' },
  { name: 'Snack',    color: '#FFF8E1', text: '#F57F17' },
];

// Palette gợi ý khi tạo danh mục mới
const PALETTE: { color: string; text: string }[] = [
  { color: '#E6F1FB', text: '#1565C0' },
  { color: '#FFF3E0', text: '#D4840A' },
  { color: '#F0FBF0', text: '#2E7D32' },
  { color: '#F9F0FB', text: '#7B1FA2' },
  { color: '#FFF8E1', text: '#F57F17' },
  { color: '#FCE4EC', text: '#AD1457' },
  { color: '#E8F5E9', text: '#2E7D32' },
  { color: '#E3F2FD', text: '#0D47A1' },
  { color: '#FBE9E7', text: '#BF360C' },
  { color: '#F3E5F5', text: '#6A1B9A' },
  { color: '#E0F7FA', text: '#006064' },
  { color: '#FFFDE7', text: '#F57F17' },
];

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const INITIAL_ITEMS: StockItem[] = [
  { id: 1, name: 'Coca Cola', category: 'Nước', capacity: '330ml', createdAt: '01/04/2026', updatedAt: '09/04/2026', variants: [{ id: 11, unit: 'Chai', price: 12000, saleType: 'Lẻ', qty: 20 }, { id: 12, unit: 'Thùng', price: 120000, saleType: 'Sỉ', qty: 5 }] },
  { id: 2, name: 'Pepsi', category: 'Nước', capacity: '330ml', createdAt: '01/04/2026', updatedAt: '08/04/2026', variants: [{ id: 21, unit: 'Chai', price: 11000, saleType: 'Lẻ', qty: 20 }] },
  { id: 3, name: 'Aquafina', category: 'Nước', capacity: '500ml', createdAt: '01/04/2026', updatedAt: '07/04/2026', variants: [{ id: 31, unit: 'Chai', price: 8000, saleType: 'Lẻ', qty: 20 }] },
  { id: 4, name: 'Cầu Yonex Loại 1', category: 'Cầu', capacity: '', createdAt: '01/04/2026', updatedAt: '06/04/2026', variants: [{ id: 41, unit: 'Hộp', price: 250000, saleType: 'Sỉ', qty: 50 }, { id: 42, unit: 'Trái', price: 25000, saleType: 'Lẻ', qty: 20 }] },
  { id: 5, name: 'Cầu nhựa RSL', category: 'Cầu', capacity: '', createdAt: '01/04/2026', updatedAt: '06/04/2026', variants: [{ id: 51, unit: 'Hộp', price: 200000, saleType: 'Sỉ', qty: 40 }, { id: 52, unit: 'Trái', price: 20000, saleType: 'Lẻ', qty: 10 }] },
  { id: 6, name: 'Vợt Victor JS-12', category: 'Vợt', capacity: '', createdAt: '02/04/2026', updatedAt: '06/04/2026', variants: [{ id: 61, unit: 'Cái', price: 350000, saleType: 'Lẻ', qty: 8 }] },
  { id: 7, name: 'Quấn cán Li-Ning', category: 'Phụ kiện', capacity: '', createdAt: '03/04/2026', updatedAt: '06/04/2026', variants: [{ id: 71, unit: 'Cuộn', price: 35000, saleType: 'Lẻ', qty: 30 }] },
];

const INITIAL_HISTORY: ImportRecord[] = [
  { id: 1, itemId: 1, itemName: 'Coca Cola', variantId: 11, unit: 'Chai', qty: 50, note: 'Nhập kho sáng', importedAt: '09/04/2026 08:30' },
  { id: 2, itemId: 4, itemName: 'Cầu Yonex Loại 1', variantId: 41, unit: 'Hộp', qty: 20, note: '', importedAt: '08/04/2026 14:00' },
  { id: 3, itemId: 3, itemName: 'Aquafina', variantId: 31, unit: 'Chai', qty: 100, note: 'Đợt 2', importedAt: '07/04/2026 09:00' },
  { id: 4, itemId: 6, itemName: 'Vợt Victor JS-12', variantId: 61, unit: 'Cái', qty: 5, note: '', importedAt: '06/04/2026 16:30' },
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

const fmt = (n: number) => n.toLocaleString('vi-VN');
const nowStr = () => new Date().toLocaleDateString('vi-VN');
let _nextId = 200;
const genId = () => ++_nextId;

const focusOrange = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = '#D4840A');
const blurGray = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => (e.target.style.borderColor = '#e8e8e8');

function getInpStyle(filled = false): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box' as const,
    border: `1.5px solid ${filled ? '#D4840A' : '#e8e8e8'}`,
    borderRadius: 9, padding: '9px 13px', fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', background: filled ? '#FFFBF5' : '#fafafa', outline: 'none', transition: 'all 0.15s',
  };
}

// ═══════════════════════════════════════════════════════════════
// VARIANT EDITOR
// ═══════════════════════════════════════════════════════════════

function VariantEditor({ variants, onChange }: { variants: StockVariant[]; onChange: (v: StockVariant[]) => void }) {
  const addVariant = () => onChange([...variants, { id: genId(), unit: '', price: 0, saleType: 'Lẻ', qty: 0 }]);
  const remove = (id: number) => onChange(variants.filter(v => v.id !== id));
  const setF = <K extends keyof StockVariant>(id: number, k: K, val: StockVariant[K]) =>
    onChange(variants.map(v => v.id === id ? { ...v, [k]: val } : v));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontSize: 11.5, color: '#999', fontWeight: 600, textTransform: 'uppercase' as const }}>Đơn vị & Giá <span style={{ color: '#D4840A' }}>*</span></label>
        <button onClick={addVariant} style={{ fontSize: 12, color: '#D4840A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>Thêm đơn vị
        </button>
      </div>
      {variants.length === 0 && (
        <div style={{ padding: '12px', borderRadius: 9, background: '#fafafa', border: '1px dashed #e0e0e0', textAlign: 'center', fontSize: 12.5, color: '#bbb' }}>Nhấn "+ Thêm đơn vị" để thêm</div>
      )}
      {variants.map(v => (
        <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 1.4fr auto', gap: 7, marginBottom: 7, alignItems: 'center' }}>
          <select value={v.unit} onChange={e => setF(v.id, 'unit', e.target.value)} onFocus={focusOrange} onBlur={blurGray}
            style={{ ...getInpStyle(!!v.unit), appearance: 'none' as const, padding: '9px 10px' }}>
            <option value="">Chọn đơn vị</option>
            {UNIT_LIST.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['Sỉ', 'Lẻ'] as const).map(t => (
              <button key={t} onClick={() => setF(v.id, 'saleType', t)} style={{
                flex: 1, padding: '9px 2px', borderRadius: 8, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
                border: `1.5px solid ${v.saleType === t ? '#D4840A' : '#e0e0e0'}`,
                background: v.saleType === t ? '#FFF3E0' : '#fafafa',
                color: v.saleType === t ? '#D4840A' : '#666', fontWeight: v.saleType === t ? 700 : 400,
              }}>{t}</button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <input type="number" min={0} value={v.price || ''} onChange={e => setF(v.id, 'price', +e.target.value)}
              placeholder="Giá bán" style={{ ...getInpStyle(v.price > 0), paddingRight: 28 }} onFocus={focusOrange} onBlur={blurGray} />
            <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#aaa', pointerEvents: 'none' }}>đ</span>
          </div>
          <button onClick={() => remove(v.id)} disabled={variants.length <= 1} style={{
            width: 30, height: 30, borderRadius: 8, border: 'none', flexShrink: 0,
            background: variants.length <= 1 ? '#f5f5f5' : '#FFF5F5',
            color: variants.length <= 1 ? '#ccc' : '#A32D2D',
            cursor: variants.length <= 1 ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CATEGORY EDIT MODAL  (Thêm / Sửa 1 danh mục)
// ═══════════════════════════════════════════════════════════════

function CategoryEditModal({ cat, existingNames, onSave, onClose }: {
  cat: Category | null; // null = thêm mới
  existingNames: string[];
  onSave: (c: Category) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(cat?.name ?? '');
  const [selPalette, setSelPalette] = useState<{ color: string; text: string }>(
    cat ? { color: cat.color, text: cat.text } : PALETTE[0]
  );

  const isEdit = !!cat;
  const duplicate = name.trim() !== '' && name.trim() !== cat?.name && existingNames.includes(name.trim());
  const canSave = name.trim().length > 0 && !duplicate;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ name: name.trim(), color: selPalette.color, text: selPalette.text });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: 400, boxShadow: '0 24px 80px rgba(0,0,0,0.22)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px 14px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{isEdit ? '✏️ Sửa danh mục' : '➕ Thêm danh mục'}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 13, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>TÊN DANH MỤC <span style={{ color: '#D4840A' }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="VD: Thực phẩm, Dịch vụ..."
              style={{ ...getInpStyle(!!name), borderColor: duplicate ? '#A32D2D' : undefined }}
              onFocus={focusOrange} onBlur={blurGray} />
            {duplicate && <div style={{ fontSize: 11.5, color: '#A32D2D', marginTop: 4 }}>Tên danh mục đã tồn tại</div>}
          </div>
          {/* Preview */}
          {name.trim() && (
            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>XEM TRƯỚC</label>
              <span style={{ display: 'inline-block', padding: '5px 14px', borderRadius: 20, fontSize: 12.5, fontWeight: 700, background: selPalette.color, color: selPalette.text, border: `1.5px solid ${selPalette.text}` }}>{name.trim()}</span>
            </div>
          )}
          {/* Color palette */}
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 8, fontWeight: 600 }}>MÀU SẮC</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              {PALETTE.map((p, i) => (
                <button key={i} onClick={() => setSelPalette(p)} style={{
                  width: 32, height: 32, borderRadius: 8, cursor: 'pointer', transition: 'all 0.12s',
                  background: p.color, border: `2.5px solid ${selPalette === p ? p.text : 'transparent'}`,
                  boxShadow: selPalette === p ? `0 0 0 2px ${p.text}30` : 'none',
                }} title={`Màu ${i + 1}`}>
                  {selPalette === p && <span style={{ fontSize: 13, color: p.text }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 22px', borderTop: '0.5px solid #f0f0ee', display: 'flex', gap: 10 }}>
          <button onClick={handleSave} disabled={!canSave} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: canSave ? '#D4840A' : '#e0e0e0', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit' }}>
            {isEdit ? '✓ Lưu thay đổi' : '➕ Thêm danh mục'}
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CATEGORY MANAGER MODAL  (Danh sách + CRUD danh mục)
// ═══════════════════════════════════════════════════════════════

function CategoryManagerModal({ categories, itemCountByCategory, onAdd, onEdit, onDelete, onClose }: {
  categories: Category[];
  itemCountByCategory: Record<string, number>;
  onAdd: (c: Category) => void;
  onEdit: (oldName: string, c: Category) => void;
  onDelete: (name: string) => void;
  onClose: () => void;
}) {
  const [editModal, setEditModal] = useState<{ open: boolean; cat: Category | null }>({ open: false, cat: null });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleSave = (c: Category) => {
    if (editModal.cat) {
      onEdit(editModal.cat.name, c);
    } else {
      onAdd(c);
    }
    setEditModal({ open: false, cat: null });
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.44)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
        <div style={{ background: '#fff', borderRadius: 18, width: 480, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div style={{ padding: '18px 22px 14px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>🗂️ Quản lý danh mục</div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{categories.length} danh mục</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setEditModal({ open: true, cat: null })}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#D4840A', color: '#fff', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>Thêm mới
              </button>
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
          </div>
          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {categories.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🗂️</div>Chưa có danh mục nào
              </div>
            )}
            {categories.map(cat => {
              const count = itemCountByCategory[cat.name] ?? 0;
              const canDelete = count === 0;
              return (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, border: '1px solid #f0f0ee', background: '#fafafa', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f5f5f3'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#fafafa'}>
                  {/* Color swatch */}
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: cat.color, border: `2px solid ${cat.text}`, flexShrink: 0 }} />
                  {/* Badge */}
                  <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 12.5, fontWeight: 700, background: cat.color, color: cat.text, border: `1px solid ${cat.text}20` }}>{cat.name}</span>
                  {/* Count */}
                  <span style={{ fontSize: 12, color: '#aaa' }}>{count} sản phẩm</span>
                  <div style={{ flex: 1 }} />
                  {/* Actions */}
                  <button onClick={() => setEditModal({ open: true, cat })} title="Sửa"
                    style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, transition: 'all 0.12s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4840A'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8'; }}>✏️</button>
                  <button onClick={() => canDelete ? setDeleteTarget(cat.name) : undefined}
                    title={canDelete ? 'Xóa' : `Không thể xóa: đang có ${count} sản phẩm`}
                    style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e8e8e8', background: canDelete ? '#fff' : '#f5f5f5', cursor: canDelete ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, opacity: canDelete ? 1 : 0.4, transition: 'all 0.12s' }}
                    onMouseEnter={e => { if (canDelete) { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#FECDD3'; } }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = canDelete ? '#fff' : '#f5f5f5'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8'; }}>🗑️</button>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '12px 22px', borderTop: '0.5px solid #f0f0ee', fontSize: 11.5, color: '#bbb', flexShrink: 0 }}>
            💡 Danh mục đang có sản phẩm không thể xóa. Hãy chuyển sản phẩm sang danh mục khác trước.
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      {editModal.open && (
        <CategoryEditModal
          cat={editModal.cat}
          existingNames={categories.map(c => c.name)}
          onSave={handleSave}
          onClose={() => setEditModal({ open: false, cat: null })}
        />
      )}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDeleteTarget(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 320, padding: '24px', textAlign: 'center', fontFamily: "'Be Vietnam Pro', sans-serif", boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🗑️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Xóa danh mục?</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Danh mục <strong style={{ color: '#1a1a1a' }}>{deleteTarget}</strong> sẽ bị xóa vĩnh viễn.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { onDelete(deleteTarget); setDeleteTarget(null); }} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: '#A32D2D', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// ITEM MODAL  (Thêm / Sửa sản phẩm)
// ═══════════════════════════════════════════════════════════════

function ItemModal({ mode, item, categories, onSave, onClose }: {
  mode: ItemModalMode; item: StockItem | null;
  categories: Category[];
  onSave: (item: StockItem) => void; onClose: () => void;
}) {
  const [name, setName] = useState(item?.name ?? '');
  const [category, setCategory] = useState(item?.category ?? (categories[0]?.name ?? ''));
  const [capacity, setCapacity] = useState(item?.capacity ?? '');
  const [variants, setVariants] = useState<StockVariant[]>(
    item?.variants.length ? item.variants.map(v => ({ ...v }))
      : [{ id: genId(), unit: '', price: 0, saleType: 'Lẻ', qty: 0 }]
  );

  const canSave = name.trim().length > 0 && variants.length > 0 && variants.every(v => v.unit);

  const handleSave = () => {
    if (!canSave) return;
    const ts = nowStr();
    onSave({ id: item?.id ?? genId(), name: name.trim(), category, capacity, variants, createdAt: item?.createdAt ?? ts, updatedAt: ts });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: 520, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px 14px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{mode === 'add' ? '➕ Thêm sản phẩm / dịch vụ' : '✏️ Chỉnh sửa sản phẩm'}</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name */}
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>TÊN SẢN PHẨM / DỊCH VỤ <span style={{ color: '#D4840A' }}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="VD: Coca Cola, Thuê vợt..."
              style={getInpStyle(!!name)} onFocus={focusOrange} onBlur={blurGray} />
          </div>
          {/* Category chips */}
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>DANH MỤC <span style={{ color: '#D4840A' }}>*</span></label>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' as const }}>
              {categories.map(c => (
                <button key={c.name} onClick={() => setCategory(c.name)} style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer',
                  border: `1.5px solid ${category === c.name ? c.text : '#e0e0e0'}`,
                  background: category === c.name ? c.color : '#fafafa',
                  color: category === c.name ? c.text : '#666',
                  fontWeight: category === c.name ? 700 : 400, transition: 'all 0.12s',
                }}>{c.name}</button>
              ))}
            </div>
          </div>
          {/* Capacity */}
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>DUNG TÍCH / QUY CÁCH (tùy chọn)</label>
            <input value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="VD: 500ml, 12 chai/thùng..."
              style={getInpStyle(!!capacity)} onFocus={focusOrange} onBlur={blurGray} />
          </div>
          {/* Variants */}
          <VariantEditor variants={variants} onChange={setVariants} />
          {/* Preview */}
          {name && variants.some(v => v.unit && v.price > 0) && (
            <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FFFBF5', border: '1px solid #FAEEDA' }}>
              <div style={{ fontSize: 10.5, color: '#D4840A', fontWeight: 600, marginBottom: 5 }}>XEM TRƯỚC</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a1a', marginBottom: 5 }}>{name}{capacity ? ` (${capacity})` : ''}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                {variants.filter(v => v.unit && v.price > 0).map(v => (
                  <span key={v.id} style={{ fontSize: 11.5, background: '#fff', border: '1px solid #FAEEDA', borderRadius: 6, padding: '2px 8px', color: '#555' }}>
                    {v.unit} · {fmt(v.price)}đ · {v.saleType}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '14px 22px', borderTop: '0.5px solid #f0f0ee', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={handleSave} disabled={!canSave} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: canSave ? '#D4840A' : '#e0e0e0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit' }}>
            {mode === 'add' ? '➕ Thêm sản phẩm' : '✓ Lưu thay đổi'}
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADJUST QTY MODAL
// ═══════════════════════════════════════════════════════════════

function AdjustQtyModal({ item, onSave, onClose }: {
  item: StockItem;
  onSave: (itemId: number, variantId: number, delta: number, note: string) => void;
  onClose: () => void;
}) {
  const [selVariantId, setSelVariantId] = useState(item.variants[0]?.id ?? 0);
  const [mode, setMode] = useState<'+' | '-'>('+');
  const [delta, setDelta] = useState(0);
  const [note, setNote] = useState('');
  const variant = item.variants.find(v => v.id === selVariantId);
  const newQty = variant ? Math.max(0, variant.qty + (mode === '+' ? delta : -delta)) : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(0,0,0,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: 400, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px 14px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Điều chỉnh tồn kho</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{item.name}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Variant select */}
          {item.variants.length > 1 && (
            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>CHỌN ĐƠN VỊ</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {item.variants.map(v => (
                  <button key={v.id} onClick={() => setSelVariantId(v.id)} style={{
                    flex: 1, padding: '8px', borderRadius: 9, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center' as const,
                    border: `1.5px solid ${selVariantId === v.id ? '#D4840A' : '#e0e0e0'}`,
                    background: selVariantId === v.id ? '#FFF3E0' : '#fafafa',
                    color: selVariantId === v.id ? '#D4840A' : '#666', fontWeight: selVariantId === v.id ? 700 : 400,
                  }}>
                    {v.unit}<br /><span style={{ fontSize: 10.5, opacity: 0.8 }}>Tồn: {v.qty}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Before → After display */}
          {variant && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1, padding: '12px', borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0ee', textAlign: 'center' as const }}>
                <div style={{ fontSize: 10.5, color: '#aaa', marginBottom: 3 }}>Hiện tại</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>{variant.qty}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{variant.unit}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              <div style={{ flex: 1, padding: '12px', borderRadius: 10, textAlign: 'center' as const, background: newQty !== variant.qty ? '#FFF3E0' : '#fafafa', border: `1px solid ${newQty !== variant.qty ? '#FAEEDA' : '#f0f0ee'}` }}>
                <div style={{ fontSize: 10.5, color: '#aaa', marginBottom: 3 }}>Sau điều chỉnh</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: newQty < variant.qty ? '#A32D2D' : newQty > variant.qty ? '#22863a' : '#1a1a1a' }}>{newQty}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{variant.unit}</div>
              </div>
            </div>
          )}
          {/* +/- toggle */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(['+', '-'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '10px', borderRadius: 9, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 700,
                border: `1.5px solid ${mode === m ? (m === '+' ? '#22863a' : '#A32D2D') : '#e0e0e0'}`,
                background: mode === m ? (m === '+' ? '#F0FDF4' : '#FFF5F5') : '#fafafa',
                color: mode === m ? (m === '+' ? '#22863a' : '#A32D2D') : '#666',
              }}>
                {m === '+' ? '⬆ Nhập thêm' : '⬇ Xuất / Giảm'}
              </button>
            ))}
          </div>
          {/* Delta input */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setDelta(Math.max(0, delta - 1))} style={{ width: 36, height: 36, borderRadius: 9, border: '1.5px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 18, fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <input type="number" min={0} value={delta || ''} onChange={e => setDelta(Math.max(0, +e.target.value))}
              style={{ flex: 1, ...getInpStyle(delta > 0), textAlign: 'center' as const, fontSize: 18, fontWeight: 700 }}
              onFocus={focusOrange} onBlur={blurGray} placeholder="0" />
            <button onClick={() => setDelta(delta + 1)} style={{ width: 36, height: 36, borderRadius: 9, border: '1.5px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 18, fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
          {/* Note */}
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GHI CHÚ</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="VD: Nhập từ kho, hàng hỏng..."
              style={getInpStyle(!!note)} onFocus={focusOrange} onBlur={blurGray} />
          </div>
          <button onClick={() => { if (delta > 0) { onSave(item.id, selVariantId, mode === '+' ? delta : -delta, note); onClose(); } }}
            disabled={delta === 0}
            style={{ padding: '12px', borderRadius: 10, border: 'none', background: delta > 0 ? '#D4840A' : '#e0e0e0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: delta > 0 ? 'pointer' : 'default', fontFamily: 'inherit' }}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DELETE CONFIRM
// ═══════════════════════════════════════════════════════════════

function DeleteConfirm({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: 340, padding: '24px', textAlign: 'center', fontFamily: "'Be Vietnam Pro', sans-serif", boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>🗑️</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Xóa sản phẩm?</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Sản phẩm <strong style={{ color: '#1a1a1a' }}>{name}</strong> và tất cả đơn vị sẽ bị xóa vĩnh viễn.</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onConfirm} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: '#A32D2D', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// IMPORT VIEW
// ═══════════════════════════════════════════════════════════════

function ImportView({ items, onBack, onImport }: {
  items: StockItem[]; onBack: () => void;
  onImport: (record: ImportRecord) => void;
}) {
  const [selItemId, setSelItemId] = useState<number | null>(null);
  const [selVariantId, setSelVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  const selItem = items.find(i => i.id === selItemId) ?? null;
  const selVariant = selItem?.variants.find(v => v.id === selVariantId) ?? null;
  const canSubmit = !!(selItemId && selVariantId && qty && +qty > 0);

  const handleSubmit = () => {
    if (!canSubmit || !selItem || !selVariant) return;
    onImport({ id: genId(), itemId: selItem.id, itemName: selItem.name, variantId: selVariant.id, unit: selVariant.unit, qty: +qty, note, importedAt: new Date().toLocaleString('vi-VN') });
    setDone(true);
    setTimeout(() => { setDone(false); setSelItemId(null); setSelVariantId(null); setQty(''); setNote(''); }, 1600);
  };

  const grouped = useMemo(() => {
    const m: Record<string, StockItem[]> = {};
    items.forEach(item => { if (!m[item.category]) m[item.category] = []; m[item.category].push(item); });
    return m;
  }, [items]);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left: item picker */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: '#fff', borderRight: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#D4840A', fontWeight: 600, fontSize: 14.5, fontFamily: 'inherit', padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Nhập hàng
        </button>
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 8, fontWeight: 600 }}>CHỌN MẶT HÀNG <span style={{ color: '#D4840A' }}>*</span></label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 340, overflowY: 'auto' }}>
            {Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat}>
                <div style={{ fontSize: 10.5, color: '#888', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', padding: '6px 0 3px' }}>{cat}</div>
                {catItems.map(item => (
                  <button key={item.id} onClick={() => { setSelItemId(item.id); setSelVariantId(item.variants[0]?.id ?? null); }}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 9, marginBottom: 4, cursor: 'pointer', fontFamily: 'inherit',
                      border: `1.5px solid ${selItemId === item.id ? '#D4840A' : '#e8e8e8'}`,
                      background: selItemId === item.id ? '#FFFBF5' : '#fafafa',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.12s',
                    }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: selItemId === item.id ? 600 : 400, color: selItemId === item.id ? '#D4840A' : '#1a1a1a', textAlign: 'left' as const }}>{item.name}</div>
                      {item.capacity && <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{item.capacity}</div>}
                    </div>
                    <div style={{ fontSize: 11, color: '#bbb' }}>{item.variants.map(v => v.unit).join(' / ')}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        {selItem && selItem.variants.length > 1 && (
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>CHỌN ĐƠN VỊ <span style={{ color: '#D4840A' }}>*</span></label>
            <div style={{ display: 'flex', gap: 8 }}>
              {selItem.variants.map(v => (
                <button key={v.id} onClick={() => setSelVariantId(v.id)} style={{
                  flex: 1, padding: '9px', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center' as const,
                  border: `1.5px solid ${selVariantId === v.id ? '#D4840A' : '#e0e0e0'}`,
                  background: selVariantId === v.id ? '#FFF3E0' : '#fafafa',
                  color: selVariantId === v.id ? '#D4840A' : '#666', fontWeight: selVariantId === v.id ? 700 : 400,
                }}>
                  {v.unit}<br /><span style={{ fontSize: 10.5 }}>{fmt(v.price)}đ · Tồn {v.qty}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Right: qty + note */}
      <div style={{ width: 280, padding: '22px', background: '#f7f7f5', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#aaa', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>Thông tin nhập</div>
        {selVariant && (
          <div style={{ padding: '10px 12px', borderRadius: 9, background: '#fff', border: '1px solid #e8e8e8', fontSize: 12.5 }}>
            <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 3 }}>{selItem?.name}</div>
            <div style={{ color: '#666' }}>Đơn vị: <strong>{selVariant.unit}</strong></div>
            <div style={{ color: '#666' }}>Giá: <strong>{fmt(selVariant.price)}đ</strong></div>
            <div style={{ color: '#666' }}>Tồn hiện tại: <strong style={{ color: selVariant.qty < 10 ? '#A32D2D' : '#22863a' }}>{selVariant.qty}</strong></div>
          </div>
        )}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>SỐ LƯỢNG NHẬP <span style={{ color: '#D4840A' }}>*</span></label>
          <input type="number" min={1} value={qty} onChange={e => setQty(e.target.value)} placeholder="0"
            style={getInpStyle(!!qty)} onFocus={focusOrange} onBlur={blurGray} />
        </div>
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GHI CHÚ</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Ghi chú nhập hàng..."
            style={{ ...getInpStyle(!!note), resize: 'none' as const, lineHeight: 1.5 }} onFocus={focusOrange} onBlur={blurGray} />
        </div>
        {selVariant && qty && +qty > 0 && (
          <div style={{ padding: '8px 12px', borderRadius: 9, background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: 12.5, color: '#166534' }}>
            Sau nhập: <strong>{selVariant.qty + +qty} {selVariant.unit}</strong>
          </div>
        )}
        <div style={{ flex: 1 }} />
        <button onClick={handleSubmit} disabled={!canSubmit} style={{
          padding: '13px', borderRadius: 10, border: 'none',
          background: done ? '#22863a' : (canSubmit ? '#D4840A' : '#e0e0e0'),
          color: '#fff', fontWeight: 700, fontSize: 14,
          cursor: canSubmit ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'background 0.2s',
        }}>
          {done ? '✓ Đã nhập hàng!' : 'Nhập hàng'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HISTORY MODAL
// ═══════════════════════════════════════════════════════════════

function HistoryModal({ history, onClose }: { history: ImportRecord[]; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, width: 600, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden', fontFamily: "'Be Vietnam Pro', sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '0.5px solid #f0f0ee' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Lịch sử nhập / xuất kho</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{history.length} lần gần đây</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Thời gian', 'Mặt hàng', 'Đơn vị', 'Số lượng', 'Ghi chú'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', color: '#888', fontWeight: 500, fontSize: 12, borderBottom: '1px solid #f0f0ee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#bbb', fontSize: 13 }}>Chưa có lịch sử</td></tr>
              ) : [...history].reverse().map(h => (
                <tr key={h.id} style={{ borderBottom: '0.5px solid #f5f5f3' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                  <td style={{ padding: '10px 14px', color: '#888', fontSize: 11.5, whiteSpace: 'nowrap' as const }}>{h.importedAt}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 500, color: '#1a1a1a' }}>{h.itemName}</td>
                  <td style={{ padding: '10px 14px', color: '#666' }}>{h.unit}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: h.qty > 0 ? '#22863a' : '#A32D2D' }}>{h.qty > 0 ? '+' : ''}{h.qty}</td>
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

// ═══════════════════════════════════════════════════════════════
// STOCK LIST VIEW
// ═══════════════════════════════════════════════════════════════

function StockListView({ items, categories, onImport, onShowHistory, onAddItem, onEditItem, onDeleteItem, onAdjustQty, onManageCategories }: {
  items: StockItem[]; categories: Category[]; onImport: () => void; onShowHistory: () => void;
  onAddItem: () => void; onEditItem: (i: StockItem) => void;
  onDeleteItem: (i: StockItem) => void; onAdjustQty: (i: StockItem) => void;
  onManageCategories: () => void;
}) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tất cả');

  // Reset filter if deleted category
  const catNames = categories.map(c => c.name);
  const activeCatFilter = catFilter === 'Tất cả' || catNames.includes(catFilter) ? catFilter : 'Tất cả';

  const catMap = useMemo(() => {
    const m: Record<string, Category> = {};
    categories.forEach(c => { m[c.name] = c; });
    return m;
  }, [categories]);

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const m: Record<string, StockItem[]> = {};
    items.filter(i => i.name.toLowerCase().includes(q) && (activeCatFilter === 'Tất cả' || i.category === activeCatFilter))
      .forEach(i => { if (!m[i.category]) m[i.category] = []; m[i.category].push(i); });
    return m;
  }, [items, search, activeCatFilter]);

  const totalUnits = items.reduce((s, i) => s + i.variants.reduce((vs, v) => vs + v.qty, 0), 0);
  const lowStockCount = items.filter(i => i.variants.some(v => v.qty < 5)).length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '0.5px solid rgba(0,0,0,0.08)', flexWrap: 'wrap' as const }}>
        <button onClick={onImport} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#D4840A', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>Nhập hàng
        </button>
        <button onClick={onAddItem} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: '1.5px dashed #D4840A', background: 'transparent', color: '#D4840A', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>Thêm sản phẩm
        </button>
        <button onClick={onManageCategories} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, border: '1px solid #e8e8e8', background: '#fafafa', color: '#555', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f0f0ee'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fafafa'; }}>
          🗂️ Danh mục
        </button>
        {lowStockCount > 0 && (
          <div style={{ fontSize: 11.5, background: '#FFF5F5', color: '#A32D2D', padding: '5px 10px', borderRadius: 8, fontWeight: 500, border: '1px solid #FECDD3' }}>
            ⚠️ {lowStockCount} mặt hàng sắp hết
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mặt hàng..."
            style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 12px 7px 28px', fontSize: 12.5, fontFamily: 'inherit', outline: 'none', width: 190, color: '#1a1a1a', background: '#fafafa' }}
            onFocus={e => (e.target.style.borderColor = '#D4840A')} onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        </div>
        <button onClick={onShowHistory} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e8e8e8', background: '#fafafa', color: '#555', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>Lịch sử
        </button>
      </div>

      {/* Category filter + stats */}
      <div style={{ display: 'flex', gap: 6, padding: '9px 16px', borderBottom: '0.5px solid rgba(0,0,0,0.06)', alignItems: 'center', overflowX: 'auto' as const }}>
        {['Tất cả', ...catNames].map(c => {
          const catObj = catMap[c];
          const isActive = activeCatFilter === c;
          return (
            <button key={c} onClick={() => setCatFilter(c)} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap' as const, flexShrink: 0,
              border: `1px solid ${isActive ? (catObj?.text ?? '#D4840A') : '#e0e0e0'}`,
              background: isActive ? (catObj?.color ?? '#FFF3E0') : '#fff',
              color: isActive ? (catObj?.text ?? '#D4840A') : '#666', fontWeight: isActive ? 600 : 400,
            }}>{c}</button>
          );
        })}
        <div style={{ marginLeft: 'auto', fontSize: 12, color: '#aaa', flexShrink: 0, display: 'flex', gap: 10 }}>
          <span>Tổng tồn: <strong style={{ color: '#D4840A' }}>{totalUnits}</strong></span>
          <span>·</span>
          <span><strong>{items.length}</strong> mặt hàng</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {Object.keys(grouped).length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>Không tìm thấy mặt hàng nào
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr style={{ background: '#f7f7f5' }}>
                {['Mặt hàng', 'SL còn', 'Đơn vị', 'Giá bán', 'Kiểu bán', 'Thao tác'].map((h, i) => (
                  <th key={h} style={{ padding: '9px 12px', textAlign: i === 0 ? 'left' : 'center', color: '#888', fontWeight: 600, fontSize: 11.5, borderBottom: '1px solid #ebebeb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([cat, catItems]) => [
                <tr key={`cat-${cat}`}>
                  <td colSpan={6} style={{ padding: '7px 14px', background: catMap[cat]?.color ?? '#f0f0ee', borderTop: '0.5px solid rgba(0,0,0,0.06)', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: catMap[cat]?.text ?? '#333', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{cat}</span>
                      <span style={{ fontSize: 10.5, background: catMap[cat]?.text ?? '#333', color: '#fff', borderRadius: 10, padding: '1px 7px', fontWeight: 500 }}>{catItems.length}</span>
                    </div>
                  </td>
                </tr>,
                ...catItems.map(item =>
                  item.variants.map((v, vi) => (
                    <tr key={`${item.id}-${v.id}`} style={{ borderBottom: '0.5px solid #f5f5f3' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                      <td style={{ padding: '10px 12px', paddingLeft: vi === 0 ? 20 : 34 }}>
                        {vi === 0 ? (
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{item.name}</div>
                            {item.capacity && <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{item.capacity}</div>}
                          </div>
                        ) : null}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ fontWeight: 700, color: v.qty < 5 ? '#A32D2D' : v.qty < 15 ? '#D4840A' : '#22863a', fontSize: 13.5 }}>{v.qty}</span>
                        {v.qty < 5 && <div style={{ fontSize: 9.5, color: '#A32D2D', fontWeight: 500, marginTop: 1 }}>Sắp hết</div>}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#666', fontSize: 12.5 }}>{v.unit || '—'}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 500, color: v.price ? '#1a1a1a' : '#ccc', fontSize: 13 }}>{v.price ? fmt(v.price) + 'đ' : '—'}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: v.saleType === 'Sỉ' ? '#E6F1FB' : '#FFF3E0', color: v.saleType === 'Sỉ' ? '#1565C0' : '#D4840A' }}>{v.saleType}</span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {vi === 0 && (
                          <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                            <button onClick={() => onAdjustQty(item)} title="Điều chỉnh tồn kho" style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, transition: 'all 0.12s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#378ADD'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8'; }}>📊</button>
                            <button onClick={() => onEditItem(item)} title="Sửa" style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, transition: 'all 0.12s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4840A'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8'; }}>✏️</button>
                            <button onClick={() => onDeleteItem(item)} title="Xóa" style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, transition: 'all 0.12s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#FECDD3'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8'; }}>🗑️</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ),
              ])}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// API-ready: các hàm handleXxx có thể được thay thế bằng
// async/await fetch calls mà không cần thay đổi UI components
// ═══════════════════════════════════════════════════════════════

export default function KhoDichVu() {
  const [items, setItems] = useState<StockItem[]>(INITIAL_ITEMS);
  const [history, setHistory] = useState<ImportRecord[]>(INITIAL_HISTORY);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [view, setView] = useState<View>('list');
  const [itemModal, setItemModal] = useState<{ mode: ItemModalMode; item: StockItem | null }>({ mode: null, item: null });
  const [deleteTarget, setDeleteTarget] = useState<StockItem | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<StockItem | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  // ── CATEGORY CRUD ──────────────────────────────────────────────

  const handleAddCategory = (cat: Category) => {
    setCategories(prev => [...prev, cat]);
    showToast('✓ Đã thêm danh mục: ' + cat.name);
  };

  const handleEditCategory = (oldName: string, cat: Category) => {
    setCategories(prev => prev.map(c => c.name === oldName ? cat : c));
    // Update all items that used the old category name
    if (oldName !== cat.name) {
      setItems(prev => prev.map(i => i.category === oldName ? { ...i, category: cat.name } : i));
    }
    showToast('✓ Đã cập nhật danh mục: ' + cat.name);
  };

  const handleDeleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c.name !== name));
    showToast('🗑 Đã xóa danh mục: ' + name);
  };

  const itemCountByCategory = useMemo(() => {
    const m: Record<string, number> = {};
    items.forEach(i => { m[i.category] = (m[i.category] ?? 0) + 1; });
    return m;
  }, [items]);

  // ── CRUD: swap these with API calls ───────────────────────────

  const handleAddItem = (newItem: StockItem) => {
    // await api.post('/inventory/items', newItem)
    setItems(prev => [...prev, newItem]);
    showToast('✓ Đã thêm: ' + newItem.name);
  };

  const handleEditItem = (updated: StockItem) => {
    // await api.put(`/inventory/items/${updated.id}`, updated)
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    showToast('✓ Đã cập nhật: ' + updated.name);
  };

  const handleDeleteItem = (id: number) => {
    // await api.delete(`/inventory/items/${id}`)
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteTarget(null);
    showToast('🗑 Đã xóa: ' + item?.name);
  };

  const handleAdjustQty = (itemId: number, variantId: number, delta: number, note: string) => {
    // await api.post('/inventory/adjust', { itemId, variantId, delta, note })
    setItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return { ...item, updatedAt: nowStr(), variants: item.variants.map(v => v.id === variantId ? { ...v, qty: Math.max(0, v.qty + delta) } : v) };
    }));
    if (delta > 0) {
      const item = items.find(i => i.id === itemId);
      const variant = item?.variants.find(v => v.id === variantId);
      if (item && variant) {
        setHistory(prev => [...prev, { id: genId(), itemId, itemName: item.name, variantId, unit: variant.unit, qty: delta, note, importedAt: new Date().toLocaleString('vi-VN') }]);
      }
    }
    showToast(`✓ ${delta > 0 ? 'Nhập +' + delta : 'Xuất ' + delta} đơn vị`);
  };

  const handleImport = (record: ImportRecord) => {
    // await api.post('/inventory/import', record)
    handleAdjustQty(record.itemId, record.variantId, record.qty, record.note);
    setView('list');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f7f7f5', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' as const, pointerEvents: 'none' as const }}>
          {toast}
        </div>
      )}

      {/* Modals */}
      {itemModal.mode && (
        <ItemModal mode={itemModal.mode} item={itemModal.item} categories={categories}
          onSave={itemModal.mode === 'add' ? handleAddItem : handleEditItem}
          onClose={() => setItemModal({ mode: null, item: null })} />
      )}
      {deleteTarget && (
        <DeleteConfirm name={deleteTarget.name} onConfirm={() => handleDeleteItem(deleteTarget.id)} onClose={() => setDeleteTarget(null)} />
      )}
      {adjustTarget && (
        <AdjustQtyModal item={adjustTarget} onSave={handleAdjustQty} onClose={() => setAdjustTarget(null)} />
      )}
      {showHistory && <HistoryModal history={history} onClose={() => setShowHistory(false)} />}
      {showCategoryManager && (
        <CategoryManagerModal
          categories={categories}
          itemCountByCategory={itemCountByCategory}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Kho & dịch vụ</div>
        {view === 'import' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span style={{ fontSize: 14, color: '#D4840A', fontWeight: 500 }}>Nhập hàng</span>
          </>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {view === 'list' ? (
          <StockListView
            items={items}
            categories={categories}
            onImport={() => setView('import')}
            onShowHistory={() => setShowHistory(true)}
            onAddItem={() => setItemModal({ mode: 'add', item: null })}
            onEditItem={item => setItemModal({ mode: 'edit', item })}
            onDeleteItem={item => setDeleteTarget(item)}
            onAdjustQty={item => setAdjustTarget(item)}
            onManageCategories={() => setShowCategoryManager(true)}
          />
        ) : (
          <ImportView items={items} onBack={() => setView('list')} onImport={handleImport} />
        )}
      </div>
    </div>
  );
}