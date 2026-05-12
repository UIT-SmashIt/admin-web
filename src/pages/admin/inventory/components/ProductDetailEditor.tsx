import type {
  IProduct,
  IProductCategory,
  IProductDetail,
  ProductAddPayload,
  ProductEditPayload
} from "../../../../types/product.type";
import {genId} from "../../../../utils/gen-id.ts";
import {getInpStyle} from "../../../../utils/get-input-style.ts";
import {SaleType} from "../../../../const/saleType.const.ts";
import {blurGray, focusOrange} from "../../../../utils/custom-color.ts";
import {useState} from "react";
import {fmt} from "../../../../utils/fmt.ts";
import {RETAIL_UNITS, WHOLESALE_UNITS} from "../../../../const/units.const.ts";
export type ItemModalMode = 'add' | 'edit' | null;

function ProductDetailEditor({ variants, onChange, capacity, onCapacityChange }: { 
  variants: IProductDetail[]; 
  onChange: (v: IProductDetail[]) => void;
  capacity: string;
  onCapacityChange: (c: string) => void;
}) {
  const addVariant = () => {
    const hasRetail = variants.some(v => v.saleType === 'Retail');
    onChange([...variants, { 
      productDetailId: genId(), 
      unit: '', 
      unitPrice: 0, 
      saleType: hasRetail ? "Wholesale" : "Retail", 
      quantity: 0,
      barcode: ''
    }]);
  };
  const remove = (id: number | undefined) => onChange(variants.filter(v => v.productDetailId !== id));
  const setF = <K extends keyof IProductDetail>(id: number | undefined, k: K, val: IProductDetail[K]) =>
    onChange(variants.map(v => v.productDetailId === id ? { ...v, [k]: val } : v));
  
  const getUnitList = (saleType: string) => saleType === 'Retail' ? RETAIL_UNITS : WHOLESALE_UNITS;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontSize: 11.5, color: '#999', fontWeight: 600, textTransform: 'uppercase' as const }}>Dung tích / Quy cách & Đơn vị <span style={{ color: '#D4840A' }}>*</span></label>
      </div>
      
      {/* Capacity field */}
      <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
        <input 
          value={capacity} 
          onChange={e => onCapacityChange(e.target.value)} 
          placeholder="VD: 500ml, 12 chai/thùng, kích cỡ lớn..." 
          style={getInpStyle(!!capacity)}
          onFocus={focusOrange} 
          onBlur={blurGray}
        />
      </div>

      {variants.length === 0 && (
        <div style={{ padding: '12px', borderRadius: 9, background: '#fafafa', border: '1px dashed #e0e0e0', textAlign: 'center', fontSize: 12.5, color: '#bbb' }}>Nhấn "+ Thêm đơn vị" để thêm</div>
      )}
      
      {variants.map((v, idx) => (
        <div key={v.productDetailId} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            {/* Barcode */}
            <div>
              <label style={{ fontSize: 10.5, color: '#999', display: 'block', marginBottom: 4, fontWeight: 500 }}>Mã vạch</label>
              <input 
                type="text" 
                value={v.barcode || ''} 
                onChange={e => setF(v.productDetailId, 'barcode', e.target.value)} 
                placeholder="Mã vạch sản phẩm"
                style={getInpStyle(!!v.barcode)}
                onFocus={focusOrange}
                onBlur={blurGray}
              />
            </div>
            
            {/* Sale Type selector */}
            <div>
              <label style={{ fontSize: 10.5, color: '#999', display: 'block', marginBottom: 4, fontWeight: 500 }}>Loại bán</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.values(SaleType).map(t => (
                  <button 
                    key={t} 
                    onClick={() => setF(v.productDetailId, 'saleType', t)}
                    disabled={t === 'Retail' && variants.some((vt, tidx) => tidx !== idx && vt.saleType === 'Retail')}
                    style={{
                      flex: 1, 
                      padding: '8px 0', 
                      borderRadius: 8, 
                      fontSize: 12, 
                      fontFamily: 'inherit', 
                      cursor: 'pointer',
                      border: `1.5px solid ${v.saleType === t ? '#D4840A' : '#e0e0e0'}`,
                      background: v.saleType === t ? '#FFF3E0' : '#fafafa',
                      color: v.saleType === t ? '#D4840A' : '#666', 
                      fontWeight: v.saleType === t ? 700 : 400,
                    }}
                  >
                    {t === 'Retail' ? 'Lẻ' : 'Sỉ'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr auto', gap: 8, alignItems: 'center' }}>
            {/* Unit selector */}
            <div>
              <label style={{ fontSize: 10.5, color: '#999', display: 'block', marginBottom: 4, fontWeight: 500 }}>Đơn vị</label>
              <select 
                value={v.unit} 
                onChange={e => setF(v.productDetailId, 'unit', e.target.value)} 
                onFocus={focusOrange} 
                onBlur={blurGray}
                style={{ ...getInpStyle(!!v.unit), appearance: 'none' as const, padding: '9px 10px' }}
              >
                <option value="">Chọn đơn vị</option>
                {getUnitList(v.saleType).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            
            {/* Unit Price */}
            <div>
              <label style={{ fontSize: 10.5, color: '#999', display: 'block', marginBottom: 4, fontWeight: 500 }}>Giá bán</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="number" 
                  min={0} 
                  value={v.unitPrice || ''} 
                  onChange={e => setF(v.productDetailId, 'unitPrice', +e.target.value)}
                  placeholder="Giá bán" 
                  style={{ ...getInpStyle(v.unitPrice > 0), paddingRight: 28 }} 
                  onFocus={focusOrange} 
                  onBlur={blurGray} 
                />
                <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#aaa', pointerEvents: 'none' }}>đ</span>
              </div>
            </div>
            
            {/* Delete button */}
            <div>
              <button 
                onClick={() => remove(v.productDetailId)} 
                disabled={variants.length <= 1} 
                style={{
                  width: 36, 
                  height: 36, 
                  borderRadius: 8, 
                  border: 'none', 
                  flexShrink: 0,
                  background: variants.length <= 1 ? '#f5f5f5' : '#FFF5F5',
                  color: variants.length <= 1 ? '#ccc' : '#A32D2D',
                  cursor: variants.length <= 1 ? 'default' : 'pointer',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginTop: 24
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Add more units button */}
      <button 
        onClick={addVariant} 
        style={{ 
          fontSize: 12, 
          color: '#D4840A', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          fontFamily: 'inherit', 
          fontWeight: 600, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4,
          padding: '8px 0'
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
        Thêm {variants.some(v => v.saleType === 'Retail') ? 'loại khác' : 'đơn vị'}
      </button>
    </div>
  );
}

export function ProductEditor({ mode, item, categories, onAdd, onEdit, onClose }: {
  mode: ItemModalMode;
  item: IProduct | null;
  categories: IProductCategory[];
  onAdd: (item: ProductAddPayload) => void;
  onEdit: (item: ProductEditPayload) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(item?.productName ?? '');
  const [category, setCategory] = useState(item?.categoryId ?? (categories[0]?.productCategoryId ?? 0));
  const [capacity, setCapacity] = useState(item?.capacity ?? '');
  const [details, setDetails] = useState<IProductDetail[]>(
    item?.details.length ? item.details.map(v => ({ ...v }))
      : [{ productDetailId: genId(), unit: '', unitPrice: 0, saleType: "Retail", quantity: 0, barcode: '' }]
  );

  const canSave = name.trim().length > 0 && details.length > 0 && details.every(v => v.unit) && details.some(v => v.saleType === 'Retail');

  const handleSave = () => {
    if (!canSave) return;
    if (mode === 'add') {
      onAdd({ productName: name.trim(), categoryId: category, capacity, details });
    } else if (mode === 'edit' && item) {
      onEdit({ productId: item.productId, productName: name.trim(), categoryId: category, capacity, details})
    }

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
                <button key={c.productCategoryId} onClick={() => setCategory(c.productCategoryId)} style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 12.5, fontFamily: 'inherit', cursor: 'pointer',
                  border: `1.5px solid ${c.productCategoryId === category ? c.textColor : '#e0e0e0'}`,
                  background: c.productCategoryId === category ? c.backgroundColor : '#fafafa',
                  color: c.productCategoryId === category ? c.textColor : '#666',
                  fontWeight: c.productCategoryId === category ? 700 : 400, transition: 'all 0.12s',
                }}>{c.name}</button>
              ))}
            </div>
          </div>
          
          {/* Variants */}
          <ProductDetailEditor 
            variants={details} 
            onChange={setDetails}
            capacity={capacity}
            onCapacityChange={setCapacity}
          />
          
          {/* Preview */}
          {name && details.some(v => v.unit && v.unitPrice > 0) && (
            <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FFFBF5', border: '1px solid #FAEEDA' }}>
              <div style={{ fontSize: 10.5, color: '#D4840A', fontWeight: 600, marginBottom: 5 }}>XEM TRƯỚC</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a1a', marginBottom: 5 }}>{name}{capacity ? ` (${capacity})` : ''}</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                {details.filter(v => v.unit && v.unitPrice > 0).map(v => (
                  <span key={v.productDetailId} style={{ fontSize: 11.5, background: '#fff', border: '1px solid #FAEEDA', borderRadius: 6, padding: '2px 8px', color: '#555' }}>
                    {v.unit} · {fmt(v.unitPrice)}đ · {v.saleType === 'Retail' ? 'Lẻ' : 'Sỉ'}{v.barcode ? ` (${v.barcode})` : ''}
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