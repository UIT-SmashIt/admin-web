import { useMemo, useState } from 'react';
import type { IProduct } from '../../../../types/product.type';

interface ServiceItem {
  id: number;
  detailId?: number;
  name: string;
  unit: string;
  price: number;
  category: number;
}

interface SelectedService {
  service: ServiceItem;
  qty: number;
}

interface ServicesModalProps {
  selected: SelectedService[];
  onChange: (s: SelectedService[]) => void;
  onClose: () => void;
  services?: ServiceItem[];
  products?: IProduct[];
}

const fmt = (n: number) => n.toLocaleString('vi-VN');

function productsToServiceItems(products: IProduct[]): ServiceItem[] {
  return products
    .flatMap(p =>
      p.details.map(d => ({
        id: p.productId,
        detailId: d.productDetailId,
        name: p.productName,
        unit: d.unit,
        price: d.unitPrice ?? 0,
        category: p.categoryId,
      }))
    );
}

export function ServicesModal({
  selected,
  onChange,
  onClose,
  services = [],
  products = [],
}: ServicesModalProps) {
  // Combine products and services
  const allItems = useMemo(() => {
    const fromProducts = products.length > 0 ? productsToServiceItems(products) : [];
    return [...fromProducts, ...services];
  }, [products, services]);

  const [local, setLocal] = useState<SelectedService[]>(selected.map(s => ({ ...s })));
  const [activeCategory, setActiveCategory] = useState(0);
  
  const categories = useMemo(
    () => [0, ...Array.from(new Set(allItems.map(s => s.category)))],
    [allItems]
  );

  const displayed = activeCategory === 0 
    ? allItems 
    : allItems.filter(s => s.category === activeCategory);

  const getQty = (item: ServiceItem) => 
    local.find(s => s.service.detailId === item.detailId && s.service.id === item.id)?.qty ?? 0;

  const setQty = (svc: ServiceItem, qty: number) => {
    if (qty <= 0) {
      setLocal(prev => 
        prev.filter(s => !(s.service.id === svc.id && s.service.detailId === svc.detailId))
      );
    } else {
      setLocal(prev => {
        const ex = prev.find(s => s.service.id === svc.id && s.service.detailId === svc.detailId);
        if (ex) {
          return prev.map(s => 
            s.service.id === svc.id && s.service.detailId === svc.detailId 
              ? { ...s, qty } 
              : s
          );
        }
        return [...prev, { service: svc, qty }];
      });
    }
  };

  const total = local.reduce((s, i) => s + i.service.price * i.qty, 0);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 350, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: 500, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: "'Be Vietnam Pro', sans-serif", overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>🛒 Chọn dịch vụ</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 6, padding: '10px 22px', overflowX: 'auto', borderBottom: '0.5px solid #f0f0ee', flexShrink: 0 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              border: `1px solid ${activeCategory === cat ? '#D4840A' : '#e0e0e0'}`,
              background: activeCategory === cat ? '#D4840A' : '#fafafa',
              color: activeCategory === cat ? '#fff' : '#666',
              fontWeight: activeCategory === cat ? 600 : 400, transition: 'all 0.12s',
            }}>{cat}</button>
          ))}
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px' }}>
          {displayed.length > 0 ? (
            displayed.map(svc => {
              const qty = getQty(svc);
              return (
                <div key={`${svc.id}-${svc.detailId}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 0', borderBottom: '0.5px solid #f5f5f3',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{svc.name}</div>
                    <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 1 }}>{fmt(svc.price)}đ / {svc.unit}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {qty > 0 && (
                      <>
                        <button onClick={() => setQty(svc, qty - 1)} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{qty}</span>
                      </>
                    )}
                    <button onClick={() => setQty(svc, qty + 1)} style={{
                      width: 28, height: 28, borderRadius: 7, border: 'none',
                      background: qty > 0 ? '#378ADD' : '#D4840A', color: '#fff',
                      cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>+</button>
                    {qty > 0 && (
                      <button onClick={() => setQty(svc, 0)} style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: '#FFF5F5', color: '#A32D2D', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#aaa' }}>
              Không có sản phẩm nào
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: '0.5px solid #f0f0ee', flexShrink: 0 }}>
          {local.length > 0 && (
            <div style={{ marginBottom: 10, fontSize: 12.5, color: '#888' }}>
              {local.map((s, idx) => (
                <span key={`${s.service.id}-${s.service.detailId}-${idx}`} style={{ marginRight: 8, background: '#f0f0ee', padding: '2px 8px', borderRadius: 10, color: '#555', fontWeight: 500 }}>
                  {s.service.name} ×{s.qty}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: '#888' }}>Tổng dịch vụ:</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#D4840A' }}>{fmt(total)}đ</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { onChange(local); onClose(); }} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#D4840A', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>✓ Xác nhận</button>
            <button onClick={onClose} style={{ padding: '12px 18px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
