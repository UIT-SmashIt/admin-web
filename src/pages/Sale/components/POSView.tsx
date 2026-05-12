import { useState } from 'react';
import type { CartItem, IProduct, IProductCategory, IProductDetail } from '../types.ts';
import { fmt } from '../constants';

interface POSViewProps {
  products: IProduct[];
  categories: IProductCategory[];
  cart: CartItem[];
  onAddToCart: (item: IProduct, variant: IProductDetail) => void;
  onQtyChange: (itemId: number, variantId: number, qty: number) => void;
  onRemove: (itemId: number, variantId: number) => void;
  onCheckout: () => void;
  onClear: () => void;
}

export default function POSView({
  products,
  categories,
  cart,
  onAddToCart,
  onQtyChange,
  onRemove,
  onCheckout,
  onClear,
}: POSViewProps) {
  const [category, setCategory] = useState(categories[0]?.productCategoryId || null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<{ itemId: number; variantId: number } | null>(null);
  const [numpadInput, setNumpadInput] = useState('');

  const filtered = products.filter((p) => p.categoryId === category);
  const total = cart.reduce((s, i) => s + i.variant.unitPrice * i.qty, 0);
  const selectedItem =
    selectedCartItem !== null
      ? cart.find(
          (i) => i.item.productId === selectedCartItem.itemId && i.variant.productDetailId === selectedCartItem.variantId
        )
      : null;

  const handleNumpadKey = (key: string) => {
    if (key === '⌫') {
      setNumpadInput((prev) => prev.slice(0, -1));
    } else {
      setNumpadInput((prev) => (prev + key).replace(/^0+/, '') || '0');
    }
  };

  const confirmNumpadQty = () => {
    const qty = parseInt(numpadInput) || 0;
    if (selectedItem && qty > 0) {
      onQtyChange(selectedItem.item.productId, selectedItem.variant.productDetailId, qty);
      setNumpadInput('');
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* ── Left: product browser ── */}
      <div
        style={{
          flex: '0 0 340px',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '0.5px solid rgba(0,0,0,0.08)',
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        {/* Category tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '0.5px solid rgba(0,0,0,0.08)',
            padding: '10px 16px',
            overflowX: 'auto',
            gap: 6,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.productCategoryId}
              onClick={() => setCategory(cat.productCategoryId)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                background: category === cat.productCategoryId ? '#D4840A' : '#f0f0ee',
                color: category === cat.productCategoryId ? '#fff' : '#555',
                fontWeight: category === cat.productCategoryId ? 600 : 400,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            alignContent: 'start',
          }}
        >
          {filtered.map((item) => (
            <button
              key={item.productId}
              onClick={() => onAddToCart(item, item.details[0])}
              style={{
                border: '1px solid #ebebeb',
                borderRadius: 10,
                padding: '10px 8px',
                background: '#fafafa',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.12s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#FFF9F0';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4840A';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#fafafa';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#ebebeb';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg,#f0f0ee,#e8e8e8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                📦
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#1a1a1a',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  fontWeight: 500,
                }}
              >
                {item.productName}
              </div>
              <div style={{ fontSize: 11.5, color: '#D4840A', fontWeight: 600 }}>
                {fmt(item.details[0]?.unitPrice || 0)}đ
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Middle: order table ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '0.5px solid rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Thời gian</div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: '6px 14px',
              borderRadius: 7,
              border: '1px solid #e0e0e0',
              background: showHistory ? '#f0f0ee' : '#fff',
              fontSize: 12,
              color: '#555',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 500,
            }}
          >
            Lịch sử
          </button>
        </div>

        {showHistory ? (
          // History table
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#888' }}>ID</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#888' }}>Giờ</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#888' }}>Sản phẩm</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#888' }}>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {/* Mock history data */}
                {[
                  {
                    id: 1,
                    time: '08:32',
                    items: [{ name: 'Coca', qty: 2, unit: 'Chai' }],
                    total: 30000,
                  },
                  {
                    id: 2,
                    time: '09:14',
                    items: [{ name: 'Vợt', qty: 2, unit: 'Cái' }],
                    total: 50000,
                  },
                ].map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 16px', color: '#666' }}>#{order.id}</td>
                    <td style={{ padding: '10px 16px', color: '#666' }}>{order.time}</td>
                    <td style={{ padding: '10px 16px', color: '#666' }}>
                      {order.items.map((i, idx) => (
                        <div key={idx}>
                          {i.name} x{i.qty}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#D4840A' }}>
                      {fmt(order.total)}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Cart table
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#bbb',
                  fontSize: 13,
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 32 }}>🛒</span>
                Chưa có sản phẩm nào
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#888' }}>Sản phẩm</th>
                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600, color: '#888' }}>ĐV</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#888' }}>Giá</th>
                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600, color: '#888' }}>SL</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#888' }}>Thành tiền</th>
                    <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600, color: '#888' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr
                      key={idx}
                      onClick={() =>
                        setSelectedCartItem({
                          itemId: item.item.productId,
                          variantId: item.variant.productDetailId,
                        })
                      }
                      style={{
                        borderBottom: '1px solid #f0f0f0',
                        background:
                          selectedCartItem?.itemId === item.item.productId &&
                          selectedCartItem?.variantId === item.variant.productDetailId
                            ? '#FFF9F0'
                            : '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      <td style={{ padding: '10px 16px', color: '#1a1a1a', fontWeight: 500 }}>
                        {item.item.productName}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', color: '#888' }}>
                        {item.variant.unit}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', color: '#D4840A', fontWeight: 500 }}>
                        {fmt(item.variant.unitPrice)}đ
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600 }}>
                        {item.qty}
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#D4840A' }}>
                        {fmt(item.variant.unitPrice * item.qty)}đ
                      </td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item.item.productId, item.variant.productDetailId);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#A32D2D',
                            cursor: 'pointer',
                            fontSize: 14,
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Total */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '0.5px solid rgba(0,0,0,0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 8,
            background: '#fafafa',
          }}
        >
          <span style={{ fontSize: 13, color: '#888' }}>Tổng tiền:</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#D4840A' }}>
            {total ? fmt(total) + 'đ' : '....'}
          </span>
        </div>
      </div>

      {/* ── Right: selected item & actions ── */}
      <div
        style={{
          flex: '0 0 180px',
          display: 'flex',
          flexDirection: 'column',
          padding: '14px 12px',
          gap: 8,
          background: '#fafafa',
          borderLeft: '0.5px solid rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Sản phẩm chọn
        </div>
        <div
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: 10,
            border: '1px solid #ebebeb',
            padding: 10,
            fontSize: 12,
            color: selectedItem ? '#1a1a1a' : '#bbb',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {selectedItem ? (
            <>
              <div style={{ fontWeight: 600, fontSize: 12.5 }}>{selectedItem.item.productName}</div>
              <div style={{ color: '#888' }}>ID: {selectedItem.item.productId}</div>
              <div style={{ color: '#888' }}>ĐV: {selectedItem.variant.unit}</div>
              <div style={{ color: '#D4840A', fontWeight: 600, marginTop: 4 }}>
                {fmt(selectedItem.variant.unitPrice)}đ × {selectedItem.qty}
              </div>
              <div style={{ borderTop: '1px dashed #e8e8e8', marginTop: 4, paddingTop: 4, fontWeight: 700, color: '#1a1a1a' }}>
                = {fmt(selectedItem.variant.unitPrice * selectedItem.qty)}đ
              </div>
            </>
          ) : (
            <span>Chọn sản phẩm để xem</span>
          )}
        </div>

        <div
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Thành tiền
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 10,
            border: '1px solid #ebebeb',
            padding: '10px',
            fontSize: 14,
            fontWeight: 700,
            color: selectedItem ? '#D4840A' : '#ddd',
            textAlign: 'center',
          }}
        >
          {selectedItem ? fmt(selectedItem.variant.unitPrice * selectedItem.qty) + 'đ' : '—'}
        </div>

        <button
          onClick={onClear}
          style={{
            width: '100%',
            padding: '9px 6px',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
            background: '#fff',
            fontSize: 11,
            color: '#888',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Xóa giỏ hàng
        </button>

        {/* Qty Input Section */}
        {selectedItem && (
          <div style={{ padding: '12px', background: '#fff', borderRadius: 10, border: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 8 }}>Số lượng</div>

            {/* Qty input display */}
            <input
              value={numpadInput}
              onChange={(e) => setNumpadInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Nhập số lượng"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: '9px 10px',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'inherit',
                outline: 'none',
                color: '#1a1a1a',
                marginBottom: 8,
              }}
            />

            {/* Numpad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 8 }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleNumpadKey(k)}
                  style={{
                    padding: '7px',
                    borderRadius: 6,
                    border: '1px solid #ddd',
                    background: '#fff',
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#333',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Confirm button */}
            <button
              onClick={confirmNumpadQty}
              disabled={!numpadInput}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 8,
                border: 'none',
                background: numpadInput ? '#22863a' : '#ccc',
                color: '#fff',
                fontWeight: 600,
                fontSize: 12,
                cursor: numpadInput ? 'pointer' : 'default',
                fontFamily: 'inherit',
                marginBottom: 8,
              }}
            >
              ✓ OK
            </button>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          style={{
            padding: '12px',
            borderRadius: 10,
            border: 'none',
            background: cart.length > 0 ? '#D4840A' : '#e0e0e0',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            cursor: cart.length > 0 ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          Thanh toán
        </button>
        <button
          onClick={onClear}
          style={{
            padding: '11px',
            borderRadius: 10,
            border: '1.5px solid #e0e0e0',
            background: '#fff',
            color: '#A32D2D',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}
