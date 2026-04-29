import type {IProduct} from "../../../../types/product.type.ts";
import type {IProductCategory} from "../../../../types/productCategory.type.ts";
import {useMemo, useState} from "react";
import {fmt} from "../../../../utils/fmt.ts";

export function StockListView({ items, categories, onImport, onShowHistory, onAddItem, onEditItem, onAdjustQty, onManageCategories }: {
  items: IProduct[]; categories: IProductCategory[]; onImport: () => void; onShowHistory: () => void;
  onAddItem: () => void; onEditItem: (i: IProduct) => void;
  onAdjustQty: (i: IProduct) => void;
  onManageCategories: () => void;
}) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Tất cả');

  // Reset filter if deleted category
  const catNames = categories.map(c => c.name);
  const activeCatFilter = catFilter === 'Tất cả' || catNames.includes(catFilter) ? catFilter : 'Tất cả';

  const catMap = useMemo(() => {
    const m: Record<string, IProductCategory> = {};
    categories.forEach(c => { m[c.name] = c; });
    return m;
  }, [categories]);

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const m: Record<string, IProduct[]> = {};
    items.filter(i => i.productName.toLowerCase().includes(q) && (activeCatFilter === 'Tất cả' || i.categoryName === activeCatFilter))
      .forEach(i => { if (!m[i.categoryName]) m[i.categoryName] = []; m[i.categoryName].push(i); });
    return m;
  }, [items, search, activeCatFilter]);

  const totalUnits = items.reduce((s, i) => s + i.details.reduce((vs, v) => vs + v.quantity, 0), 0);
  const lowStockCount = items.filter(i => i.details.some(v => v.quantity < 5)).length;

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
              border: `1px solid ${isActive ? (catObj?.textColor ?? '#D4840A') : '#e0e0e0'}`,
              background: isActive ? (catObj?.backgroundColor ?? '#FFF3E0') : '#fff',
              color: isActive ? (catObj?.textColor ?? '#D4840A') : '#666', fontWeight: isActive ? 600 : 400,
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
                <td colSpan={6} style={{ padding: '7px 14px', background: catMap[cat]?.backgroundColor ?? '#f0f0ee', borderTop: '0.5px solid rgba(0,0,0,0.06)', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: catMap[cat]?.textColor ?? '#333', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{cat}</span>
                    <span style={{ fontSize: 10.5, background: catMap[cat]?.textColor ?? '#333', color: '#fff', borderRadius: 10, padding: '1px 7px', fontWeight: 500 }}>{catItems.length}</span>
                  </div>
                </td>
              </tr>,
              ...catItems.map(item =>
                item.details.map((v, vi) => (
                  <tr key={`${item.productId}-${v.productDetailId}`} style={{ borderBottom: '0.5px solid #f5f5f3' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}>
                    <td style={{ padding: '10px 12px', paddingLeft: vi === 0 ? 20 : 34 }}>
                      {vi === 0 ? (
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{item.productName}</div>
                          {item.capacity && <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{item.capacity}</div>}
                        </div>
                      ) : null}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, color: v.quantity < 5 ? '#A32D2D' : v.quantity < 15 ? '#D4840A' : '#22863a', fontSize: 13.5 }}>{v.quantity}</span>
                      {v.quantity < 5 && <div style={{ fontSize: 9.5, color: '#A32D2D', fontWeight: 500, marginTop: 1 }}>Sắp hết</div>}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#666', fontSize: 12.5 }}>{v.unit || '—'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 500, color: v.unitPrice ? '#1a1a1a' : '#ccc', fontSize: 13 }}>{v.unitPrice ? fmt(v.unitPrice) + 'đ' : '—'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, background: v.saleType === "Wholesale" ? '#E6F1FB' : '#FFF3E0', color: v.saleType === "Wholesale" ? '#1565C0' : '#D4840A' }}>{v.saleType}</span>
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