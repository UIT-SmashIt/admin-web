import { useState } from 'react';
import type { IProduct, IProductCategory, IProductDetail } from '../../types/product.type';
import { useFetchProductCategories, useFetchProducts } from '../../hooks/useProduct';
import { Spin } from 'antd';
import { globalStyles } from './styles';
import POSView from './components/POSView';
import CheckoutView from './components/CheckoutView';
import type { CartItem, PaymentMethod, View } from './types';

export default function BanHang() {
  const { data: products, isLoading: productsLoading } = useFetchProducts();
  const { data: categories, isLoading: categoriesLoading } = useFetchProductCategories();
  const [view, setView] = useState<View>('pos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [buyerCode, setBuyerCode] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const addToCart = (item: IProduct, variant: IProductDetail) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.item.productId === item.productId && i.variant.productDetailId === variant.productDetailId
      );
      if (existing)
        return prev.map((i) =>
          i.item.productId === item.productId && i.variant.productDetailId === variant.productDetailId
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      return [...prev, { item, variant, qty: 1 }];
    });
  };

  const changeQty = (itemId: number, variantId: number, qty: number) => {
    if (qty <= 0)
      setCart((prev) =>
        prev.filter((i) => !(i.item.productId === itemId && i.variant.productDetailId === variantId))
      );
    else
      setCart((prev) =>
        prev.map((i) =>
          i.item.productId === itemId && i.variant.productDetailId === variantId ? { ...i, qty } : i
        )
      );
  };

  const removeItem = (itemId: number, variantId: number) =>
    setCart((prev) =>
      prev.filter((i) => !(i.item.productId === itemId && i.variant.productDetailId === variantId))
    );

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setBuyerCode('');
  };

  const handleConfirm = (method: PaymentMethod) => {
    showToast(`✓ Thanh toán thành công qua ${method === 'cash' ? 'tiền mặt' : 'QR'}!`);
    clearCart();
    setView('pos');
  };

  if (categoriesLoading || productsLoading) {
    return <Spin fullscreen />;
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#f7f7f5',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          position: 'relative',
        }}
      >
        {/* Toast */}
        {toast && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#1a1a1a',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              zIndex: 200,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            {toast}
          </div>
        )}

        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 20px',
            background: '#fff',
            borderBottom: '0.5px solid rgba(0,0,0,0.08)',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Bán hàng</div>
          {cart.length > 0 && (
            <div
              style={{
                marginLeft: 4,
                background: '#D4840A',
                color: '#fff',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {cart.reduce((s, i) => s + i.qty, 0)}
            </div>
          )}
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 12, color: '#aaa' }}>
            {view === 'checkout' && <span style={{ color: '#D4840A', fontWeight: 500 }}>● Đang thanh toán</span>}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {view === 'pos' ? (
            <POSView
              products={products || []}
              categories={categories || []}
              cart={cart}
              onAddToCart={addToCart}
              onQtyChange={changeQty}
              onRemove={removeItem}
              onCheckout={() => setView('checkout')}
              onClear={clearCart}
            />
          ) : (
            <CheckoutView
              cart={cart}
              discount={discount}
              buyerCode={buyerCode}
              onBuyerCodeChange={setBuyerCode}
              onDiscountChange={setDiscount}
              onBack={() => setView('pos')}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      </div>
    </>
  );
}
