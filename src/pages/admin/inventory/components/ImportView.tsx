import type {IProduct, ProductImportAddPayload} from "../../../../types/product.type.ts";
import {useMemo, useState} from "react";
import {fmt} from "../../../../utils/fmt.ts";
import {getInpStyle} from "../../../../utils/get-input-style.ts";
import {blurGray, focusOrange} from "../../../../utils/custom-color.ts";

export function ImportView({ items, onBack, onImport }: {
  items: IProduct[];
  onBack: () => void;
  onImport: (record: ProductImportAddPayload) => void;
}) {
  const [selItemId, setSelItemId] = useState<number | null>(null);
  const [selVariantId, setSelVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(0);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  const selItem = items.find(i => i.productId === selItemId) ?? null;
  const selVariant = selItem?.details.find(v => v.productDetailId === selVariantId) ?? null;
  const canSubmit = !!(selItemId && selVariantId && qty && +qty > 0);

  const handleSubmit = () => {
    if (!canSubmit || !selItem || !selVariant) return;
    onImport({ quantity: qty, note, productDetailId: selVariantId });
    setDone(true);
    setTimeout(() => { setDone(false); setSelItemId(null); setSelVariantId(null); setQty(0); setNote(''); }, 1600);
  };

  const grouped = useMemo(() => {
    const m: Record<string, IProduct[]> = {};
    items.forEach(item => { if (!m[item.categoryId]) m[item.categoryId] = []; m[item.categoryId].push(item); });
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
                  <button key={item.productId} onClick={() => { setSelItemId(item.productId); setSelVariantId(item.details[0]?.productDetailId ?? null); }}
                          style={{
                            width: '100%', padding: '10px 12px', borderRadius: 9, marginBottom: 4, cursor: 'pointer', fontFamily: 'inherit',
                            border: `1.5px solid ${selItemId === item.productId ? '#D4840A' : '#e8e8e8'}`,
                            background: selItemId === item.productId ? '#FFFBF5' : '#fafafa',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.12s',
                          }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: selItemId === item.productId ? 600 : 400, color: selItemId === item.productId ? '#D4840A' : '#1a1a1a', textAlign: 'left' as const }}>{item.productName}</div>
                      {item.capacity && <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{item.capacity}</div>}
                    </div>
                    <div style={{ fontSize: 11, color: '#bbb' }}>{item.details.map(v => v.unit).join(' / ')}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        {selItem && selItem.details.length > 1 && (
          <div>
            <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>CHỌN ĐƠN VỊ <span style={{ color: '#D4840A' }}>*</span></label>
            <div style={{ display: 'flex', gap: 8 }}>
              {selItem.details.map(v => (
                <button key={v.productDetailId} onClick={() => setSelVariantId(v.productDetailId)} style={{
                  flex: 1, padding: '9px', borderRadius: 9, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center' as const,
                  border: `1.5px solid ${selVariantId === v.productDetailId ? '#D4840A' : '#e0e0e0'}`,
                  background: selVariantId === v.productDetailId ? '#FFF3E0' : '#fafafa',
                  color: selVariantId === v.productDetailId ? '#D4840A' : '#666', fontWeight: selVariantId === v.productDetailId ? 700 : 400,
                }}>
                  {v.unit}<br /><span style={{ fontSize: 10.5 }}>{fmt(v.unitPrice)}đ · Tồn {v.quantity}</span>
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
            <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 3 }}>{selItem?.productName}</div>
            <div style={{ color: '#666' }}>Đơn vị: <strong>{selVariant.unit}</strong></div>
            <div style={{ color: '#666' }}>Giá: <strong>{fmt(selVariant.unitPrice)}đ</strong></div>
            <div style={{ color: '#666' }}>Tồn hiện tại: <strong style={{ color: selVariant.quantity < 10 ? '#A32D2D' : '#22863a' }}>{selVariant.quantity}</strong></div>
          </div>
        )}
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>SỐ LƯỢNG NHẬP <span style={{ color: '#D4840A' }}>*</span></label>
          <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} placeholder="0"
                 style={getInpStyle(!!qty)} onFocus={focusOrange} onBlur={blurGray} />
        </div>
        <div>
          <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 5, fontWeight: 600 }}>GHI CHÚ</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Ghi chú nhập hàng..."
                    style={{ ...getInpStyle(!!note), resize: 'none' as const, lineHeight: 1.5 }} onFocus={focusOrange} onBlur={blurGray} />
        </div>
        {selVariant && qty && +qty > 0 && (
          <div style={{ padding: '8px 12px', borderRadius: 9, background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: 12.5, color: '#166534' }}>
            Sau nhập: <strong>{selVariant.quantity + +qty} {selVariant.unit}</strong>
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