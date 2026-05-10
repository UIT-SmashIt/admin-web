import {useState} from "react";
import {getInpStyle} from "../../../../utils/get-input-style.ts";
import {blurGray, focusOrange} from "../../../../utils/custom-color.ts";
import type {IProductCategory, ProductCategoryPayload} from "../../../../types/product.type.ts";

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

function CategoryEditModal({ cat, existingNames, onSave, onClose }: {
  cat: ProductCategoryPayload | null; // null = thêm mới
  existingNames: string[];
  onSave: (c: ProductCategoryPayload) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(cat?.name ?? '');
  const [selPalette, setSelPalette] = useState<{ color: string; text: string }>(
    cat ? { color: cat.backgroundColor, text: cat.textColor } : PALETTE[0]
  );

  const isEdit = !!cat;
  const duplicate = name.trim() !== '' && name.trim() !== cat?.name && existingNames.includes(name.trim());
  const canSave = name.trim().length > 0 && !duplicate;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ name: name.trim(), backgroundColor: selPalette.color, textColor: selPalette.text });
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

export function CategoryManagerModal({ categories, itemCountByCategory, onAdd, onEdit, onDelete, onClose }: {
  categories: IProductCategory[];
  itemCountByCategory: Record<string, number>;
  onAdd: (c: ProductCategoryPayload) => void;
  onEdit: (id: number, c: ProductCategoryPayload) => void;
  onDelete: (name: string) => void;
  onClose: () => void;
}) {
  const [editModal, setEditModal] = useState<{ open: boolean; cat: IProductCategory | null }>({ open: false, cat: null });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleSave = (c: ProductCategoryPayload) => {
    if (editModal.cat) {
      onEdit(editModal.cat.productCategoryId, c);
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
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: cat.backgroundColor, border: `2px solid ${cat.textColor}`, flexShrink: 0 }} />
                  {/* Badge */}
                  <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 12.5, fontWeight: 700, background: cat.backgroundColor, color: cat.textColor, border: `1px solid ${cat.textColor}20` }}>{cat.name}</span>
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