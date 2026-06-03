import type {IProduct, ProductEditQuantityPayload} from "../../../../types/product.type.ts";
import {useState} from "react";
import {getInpStyle} from "../../../../utils/get-input-style.ts";
import {blurGray, focusOrange} from "../../../../utils/custom-color.ts";

export function AdjustQtyModal({ item, onSave, onClose }: {
  item: IProduct;
  onSave: (itemId: number, payload: ProductEditQuantityPayload) => void;
  onClose: () => void;
}) {
  const [selVariantId, setSelVariantId] = useState(item.details[0]?.productDetailId ?? undefined);
  const [mode, setMode] = useState<'+' | '-'>('+');
  const [delta, setDelta] = useState(0);
  const variant = item.details.find(v => v.productDetailId === selVariantId);
  const newQty = variant ? Math.max(0, variant.capacity + (mode === '+' ? delta : -delta)) : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(0,0,0,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: 400, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 22px 14px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Điều chỉnh tồn kho</div>
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{item.productName}</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Variant select */}
          {item.details.length > 1 && (
            <div>
              <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600 }}>CHỌN ĐƠN VỊ</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {item.details.map(v => (
                  <button key={v.productDetailId} onClick={() => setSelVariantId(v.productDetailId)} style={{
                    flex: 1, padding: '8px', borderRadius: 9, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'center' as const,
                    border: `1.5px solid ${selVariantId === v.productDetailId ? '#D4840A' : '#e0e0e0'}`,
                    background: selVariantId === v.productDetailId ? '#FFF3E0' : '#fafafa',
                    color: selVariantId === v.productDetailId ? '#D4840A' : '#666', fontWeight: selVariantId === v.productDetailId ? 700 : 400,
                  }}>
                    {v.unit}<br /><span style={{ fontSize: 10.5, opacity: 0.8 }}>Tồn: {v.capacity}</span>
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
                <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>{variant.capacity}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{variant.unit}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              <div style={{ flex: 1, padding: '12px', borderRadius: 10, textAlign: 'center' as const, background: newQty !== variant.capacity ? '#FFF3E0' : '#fafafa', border: `1px solid ${newQty !== variant.capacity ? '#FAEEDA' : '#f0f0ee'}` }}>
                <div style={{ fontSize: 10.5, color: '#aaa', marginBottom: 3 }}>Sau điều chỉnh</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: newQty < variant.capacity ? '#A32D2D' : newQty > variant.capacity ? '#22863a' : '#1a1a1a' }}>{newQty}</div>
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
          <button
            onClick={() => {
              if (delta > 0 && selVariantId) {
                const finalQuantity = mode === '+' ? delta : -delta;
                onSave(item.productId, {productDetailId: selVariantId, quantity: finalQuantity});
                onClose();
              }
            }}
            disabled={delta === 0}
            style={{ padding: '12px', borderRadius: 10, border: 'none', background: delta > 0 ? '#D4840A' : '#e0e0e0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: delta > 0 ? 'pointer' : 'default', fontFamily: 'inherit' }}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}