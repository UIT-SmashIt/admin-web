import { useState } from 'react';

import type {IProduct, IProductCategory, IProductDetail} from "../types/product.type.ts";
import {useFetchProductCategories, useFetchProducts} from "../hooks/useProduct.ts";
import {Spin} from "antd";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CartItem {
  item: IProduct;
  variant: IProductDetail;
  qty: number;
}

interface OrderHistory {
  id: number;
  time: string;
  items: { maSP: string; name: string; qty: number; unit: string; price: number }[];
  total: number;
}

type PaymentMethod = 'cash' | 'qr' | null;
type View = 'pos' | 'checkout';

// ─── Mock const ────────────────────────────────────────────────────────────────

const HISTORY: OrderHistory[] = [
  {
    id: 1, time: '08:32',
    items: [{ maSP: '123', name: 'Coca', qty: 2, unit: 'Chai', price: 15000 }],
    total: 30000,
  },
  {
    id: 2, time: '09:14',
    items: [{ maSP: '456', name: 'Vợt', qty: 2, unit: 'Cái', price: 25000 }],
    total: 50000,
  },
  {
    id: 3, time: '10:05',
    items: [{ maSP: '789', name: 'Cầu', qty: 2, unit: 'Trái', price: 20000 }],
    total: 40000,
  },
];

const DENOMINATIONS = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('vi-VN');
const fmtShort = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
};

// ─── Cash Payment Modal ───────────────────────────────────────────────────────

function CashModal({
  total,
  onConfirm,
  onCancel,
}: {
  total: number;
  onConfirm: (cash: number) => void;
  onCancel: () => void;
}) {
  const [input, setInput] = useState('');
  const cash = parseInt(input.replace(/\D/g, '')) || 0;
  const change = Math.max(0, cash - total);
  const rounded = Math.ceil(total / 500) * 500;

  const addDenomination = (d: number) => {
    setInput((prev) => {
      const cur = parseInt(prev.replace(/\D/g, '')) || 0;
      return fmt(cur + d);
    });
  };

  const handleInput = (v: string) => {
    const num = parseInt(v.replace(/\D/g, '')) || 0;
    setInput(num ? fmt(num) : '');
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          width: 340,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>
          Nhập tiền mặt
        </div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
          Tổng cần thanh toán: <strong style={{ color: '#D4840A' }}>{fmt(total)}đ</strong>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Nhập số tiền"
            style={{
              flex: 1,
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: '9px 12px',
              fontSize: 15,
              fontWeight: 600,
              color: '#1a1a1a',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <button
            onClick={() => onConfirm(cash)}
            disabled={cash < total}
            style={{
              padding: '9px 14px',
              borderRadius: 8,
              border: 'none',
              background: cash >= total ? '#22863a' : '#ccc',
              color: '#fff',
              fontWeight: 600,
              fontSize: 12,
              cursor: cash >= total ? 'pointer' : 'default',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            Vừa đủ
          </button>
        </div>

        {/* Denominations grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 14 }}>
          {DENOMINATIONS.map((d) => (
            <button
              key={d}
              onClick={() => addDenomination(d)}
              style={{
                border: '1px solid #e8e8e8',
                borderRadius: 7,
                padding: '7px 4px',
                fontSize: 11,
                fontWeight: 500,
                color: '#444',
                background: '#fafafa',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4840A';
                (e.currentTarget as HTMLButtonElement).style.color = '#D4840A';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#fafafa';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8';
                (e.currentTarget as HTMLButtonElement).style.color = '#444';
              }}
            >
              {fmtShort(d)}
            </button>
          ))}
        </div>

        {/* Keypad + info */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {/* Numpad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, flex: 1 }}>
            {['1','2','3','4','5','6','7','8','9','000','0','⌫'].map((k) => (
              <button
                key={k}
                onClick={() => {
                  if (k === '⌫') {
                    setInput(prev => {
                      const s = prev.replace(/\D/g, '').slice(0, -1);
                      return s ? fmt(parseInt(s)) : '';
                    });
                  } else {
                    setInput(prev => {
                      const s = (prev.replace(/\D/g, '') + k).replace(/^0+/, '') || '0';
                      return fmt(parseInt(s));
                    });
                  }
                }}
                style={{
                  border: '1px solid #ebebeb',
                  borderRadius: 7,
                  padding: '9px 4px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: k === '⌫' ? '#A32D2D' : '#333',
                  background: '#fafafa',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              flex: 1, background: '#f7f7f5', borderRadius: 8, padding: '10px 12px',
              fontSize: 12, color: '#666',
            }}>
              <div style={{ marginBottom: 6 }}>Tiền khách đưa</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: cash >= total ? '#22863a' : '#1a1a1a' }}>
                {cash ? fmt(cash) + 'đ' : '—'}
              </div>
              <div style={{ marginTop: 8, borderTop: '1px dashed #e0e0e0', paddingTop: 8 }}>
                <div style={{ marginBottom: 3 }}>Tiền thừa</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#D4840A' }}>
                  {cash >= total ? fmt(change) + 'đ' : '—'}
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 10.5, color: '#aaa' }}>
                Làm tròn: {fmt(rounded)}đ
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onConfirm(cash)}
            disabled={cash < total}
            style={{
              flex: 1, padding: '11px', borderRadius: 9, border: 'none',
              background: cash >= total ? '#22863a' : '#d0d0d0',
              color: '#fff', fontWeight: 600, fontSize: 13,
              cursor: cash >= total ? 'pointer' : 'default',
              fontFamily: 'inherit',
            }}
          >
            ✓ OK
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '11px', borderRadius: 9,
              border: '1px solid #e0e0e0',
              background: '#fff', color: '#A32D2D', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout View ────────────────────────────────────────────────────────────

function CheckoutView({
  cart,
  discount,
  buyerCode,
  onBuyerCodeChange,
  onDiscountChange,
  onBack,
  onConfirm,
}: {
  cart: CartItem[];
  discount: number;
  buyerCode: string;
  onBuyerCodeChange: (v: string) => void;
  onDiscountChange: (v: number) => void;
  onBack: () => void;
  onConfirm: (method: PaymentMethod) => void;
}) {
  const [payMethod, setPayMethod] = useState<PaymentMethod>(null);
  const [showCash, setShowCash] = useState(false);
  const [promoExpanded, setPromoExpanded] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.variant.unitPrice * i.qty, 0);
  const discountAmt = Math.round(subtotal * discount / 100);
  const total = subtotal - discountAmt;
  const rounded = Math.ceil(total / 500) * 500;

  const fields = [
    { label: 'Cần thu', value: fmt(total) + 'đ', bold: true, accent: true },
    { label: 'Giá gốc', value: fmt(subtotal) + 'đ' },
    { label: 'Khuyến mãi', value: discount ? `-${fmt(discountAmt)}đ` : '—', color: '#22863a' },
    { label: 'Đã thu', value: '—' },
    { label: 'Còn thiếu', value: total > 0 ? fmt(total) + 'đ' : '—' },
    { label: 'Làm tròn', value: fmt(rounded) + 'đ' },
    { label: 'Tiền thừa', value: '—' },
  ];

  return (
    <>
      {showCash && payMethod === 'cash' && (
        <CashModal
          total={rounded}
          onConfirm={() => { setShowCash(false); onConfirm('cash'); }}
          onCancel={() => setShowCash(false)}
        />
      )}
      <div style={{ display: 'flex', flex: 1, gap: 0, overflow: 'hidden' }}>
        {/* Left: fields */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          borderRight: '0.5px solid rgba(0,0,0,0.08)',
          background: '#fff',
        }}>
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#D4840A', fontWeight: 500, fontSize: 14,
              fontFamily: 'inherit', marginBottom: 20, padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Thanh toán
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
            {fields.map((f) => (
              <div key={f.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px',
                background: f.accent ? '#FFF9F0' : '#fafafa',
                borderRadius: 8,
                border: f.accent ? '1px solid #FAEEDA' : '1px solid transparent',
                marginBottom: 2,
              }}>
                <span style={{ fontSize: 13, color: '#888' }}>{f.label}</span>
                <span style={{
                  fontSize: f.bold ? 18 : 13,
                  fontWeight: f.bold ? 700 : 500,
                  color: f.color ?? (f.accent ? '#D4840A' : '#1a1a1a'),
                }}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>

          {/* Mã người mua */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 5 }}>
              Mã người mua
            </label>
            <input
              value={buyerCode}
              onChange={e => onBuyerCodeChange(e.target.value)}
              placeholder="Nhập mã khách hàng (tuỳ chọn)"
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1px solid #e8e8e8', borderRadius: 8,
                padding: '9px 12px', fontSize: 13, fontFamily: 'inherit',
                outline: 'none', color: '#1a1a1a',
              }}
            />
          </div>

          {/* Promo */}
          <button
            onClick={() => setPromoExpanded(!promoExpanded)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 8,
              border: '1px dashed #e0e0e0', background: '#fafafa',
              color: '#666', fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <span>Thông tin khuyến mãi</span>
            <span style={{ fontSize: 10, color: '#bbb' }}>{promoExpanded ? '▲' : '▼'}</span>
          </button>
          {promoExpanded && (
            <div style={{ marginTop: 8, padding: '12px 14px', background: '#fafafa', borderRadius: 8 }}>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 5 }}>
                Giảm giá (%)
              </label>
              <input
                type="number" min={0} max={100}
                value={discount}
                onChange={e => onDiscountChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                style={{
                  width: 80, border: '1px solid #e8e8e8', borderRadius: 6,
                  padding: '7px 10px', fontSize: 13, fontFamily: 'inherit', outline: 'none',
                }}
              />
              <span style={{ fontSize: 12, color: '#aaa', marginLeft: 8 }}>%</span>
            </div>
          )}
        </div>

        {/* Right: payment methods */}
        <div style={{
          width: 220, padding: '20px 16px', background: '#f7f7f5',
          display: 'flex', flexDirection: 'column', gap: 12,
          borderLeft: '0.5px solid rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Phương thức
          </div>

          {[
            { method: 'cash' as PaymentMethod, label: 'Tiền mặt', emoji: '💵' },
            { method: 'qr' as PaymentMethod, label: 'Mã QR', emoji: '📱' },
          ].map(({ method, label, emoji }) => (
            <button
              key={method!}
              onClick={() => setPayMethod(method)}
              style={{
                flex: 1, minHeight: 80,
                borderRadius: 12, border: `2px solid ${payMethod === method ? '#D4840A' : '#e0e0e0'}`,
                background: payMethod === method ? '#FFF9F0' : '#fff',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 24 }}>{emoji}</span>
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: payMethod === method ? '#D4840A' : '#555',
              }}>
                {label}
              </span>
            </button>
          ))}

          <div style={{ flex: 1 }} />

          <button
            onClick={() => {
              if (!payMethod) return;
              if (payMethod === 'cash') setShowCash(true);
              else onConfirm(payMethod);
            }}
            disabled={!payMethod}
            style={{
              padding: '12px', borderRadius: 10, border: 'none',
              background: payMethod ? '#D4840A' : '#e0e0e0',
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: payMethod ? 'pointer' : 'default', fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            Thanh toán
          </button>
          <button
            onClick={onBack}
            style={{
              padding: '11px', borderRadius: 10,
              border: '1.5px solid #e0e0e0',
              background: '#fff', color: '#A32D2D', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Hủy thanh toán
          </button>
        </div>
      </div>
    </>
  );
}

// ─── POS View ─────────────────────────────────────────────────────────────────

function POSView({
  products,
  categories,
  cart,
  onAddToCart,
  onQtyChange,
  onRemove,
  onCheckout,
  onClear,
}: {
  products: IProduct[];
  categories: IProductCategory[];
  cart: CartItem[];
  onAddToCart: (item: IProduct, variant: IProductDetail) => void;
  onQtyChange: (itemId: number, variantId: number, qty: number) => void;
  onRemove: (itemId: number, variantId: number) => void;
  onCheckout: () => void;
  onClear: () => void;
}) {
  const [category, setCategory] = useState(categories[0].productCategoryId || null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<{ itemId: number; variantId: number } | null>(null);

  const filtered = products.filter(p => p.categoryId === category);
  const total = cart.reduce((s, i) => s + i.variant.unitPrice * i.qty, 0);
  const selectedItem = selectedCartItem !== null
    ? cart.find(i => i.item.productId === selectedCartItem.itemId && i.variant.productDetailId === selectedCartItem.variantId)
    : null;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* ── Left: product browser ── */}
      <div style={{
        flex: '0 0 340px', display: 'flex', flexDirection: 'column',
        borderRight: '0.5px solid rgba(0,0,0,0.08)',
        background: '#fff', overflow: 'hidden',
      }}>
        {/* Category tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '0.5px solid rgba(0,0,0,0.08)',
          padding: '10px 16px',
          overflowX: 'auto',
          gap: 6,
        }}>
          {categories.map(cat => (
            <button
              key={cat.productCategoryId}
              onClick={() => setCategory(cat.productCategoryId)}
              style={{
                padding: '6px 14px', borderRadius: 20, border: 'none',
                background: category === cat.productCategoryId ? '#D4840A' : '#f0f0ee',
                color: category === cat.productCategoryId ? '#fff' : '#555',
                fontWeight: category === cat.productCategoryId ? 600 : 400,
                fontSize: 13, cursor: 'pointer',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.15s',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: 12,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
          alignContent: 'start',
        }}>
          {filtered.map(item => (
            <button
              key={item.productId}
              onClick={() => onAddToCart(item, item.details[0])}
              style={{
                border: '1px solid #ebebeb', borderRadius: 10,
                padding: '10px 8px', background: '#fafafa',
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#FFF9F0';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4840A';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#fafafa';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#ebebeb';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: 'linear-gradient(135deg,#f0f0ee,#e8e8e8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {/*{category === 'Nước' ? '🥤' : category === 'Snack' ? '🍪' : category === 'Vợt' ? '🏸' : category === 'Cầu' ? '⚪' : '🎽'}*/}
              </div>
              <div style={{ fontSize: 11, color: '#1a1a1a', textAlign: 'center', lineHeight: 1.3, fontWeight: 500 }}>
                {item.productName}
              </div>
              <div style={{ fontSize: 11.5, color: '#D4840A', fontWeight: 600 }}>
                {fmtShort(item.details[0].unitPrice)}đ
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Middle: order table ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: '#fff', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
            Thời gian
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: '6px 14px', borderRadius: 7, border: '1px solid #e0e0e0',
              background: showHistory ? '#f0f0ee' : '#fff', fontSize: 12,
              color: '#555', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
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
                <tr style={{ background: '#fafafa' }}>
                  {['STT', 'Mã SP', 'Tên SP', 'SL', 'ĐV', 'Giờ', 'Số tiền'].map(h => (
                    <th key={h} style={{
                      padding: '9px 12px', textAlign: h === 'Số tiền' ? 'right' : 'left',
                      color: '#888', fontWeight: 500, fontSize: 11.5,
                      borderBottom: '1px solid #f0f0ee',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HISTORY.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: '0.5px solid #f5f5f5' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafafa'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                  >
                    <td style={{ padding: '9px 12px', color: '#888' }}>{i + 1}</td>
                    <td style={{ padding: '9px 12px', color: '#555' }}>{o.items[0].maSP}</td>
                    <td style={{ padding: '9px 12px', color: '#1a1a1a', fontWeight: 500 }}>{o.items[0].name}</td>
                    <td style={{ padding: '9px 12px', color: '#1a1a1a' }}>{o.items[0].qty}</td>
                    <td style={{ padding: '9px 12px', color: '#888' }}>{o.items[0].unit}</td>
                    <td style={{ padding: '9px 12px', color: '#888' }}>{o.time}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 500, color: '#1a1a1a' }}>
                      {fmt(o.total)}
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
              <div style={{
                flex: 1, height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', color: '#bbb',
                fontSize: 13, gap: 8,
              }}>
                <span style={{ fontSize: 32 }}>🛒</span>
                Chưa có sản phẩm nào
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['#', 'Mã SP', 'Tên sản phẩm', 'SL', 'ĐV', 'Đơn giá', 'Thành tiền', ''].map(h => (
                      <th key={h} style={{
                        padding: '9px 10px', textAlign: h === 'Thành tiền' ? 'right' : 'left',
                        color: '#888', fontWeight: 500, fontSize: 11.5,
                        borderBottom: '1px solid #f0f0ee',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, i) => (
                    <tr
                      key={`${item.item.productId}-${item.variant.productDetailId}`}
                      onClick={() => setSelectedCartItem(selectedCartItem?.itemId === item.item.productId && selectedCartItem?.variantId === item.variant.productDetailId ? null : { itemId: item.item.productId, variantId: item.variant.productDetailId })}
                      style={{
                        borderBottom: '0.5px solid #f5f5f5',
                        background: selectedCartItem?.itemId === item.item.productId && selectedCartItem?.variantId === item.variant.productDetailId ? '#FFF9F0' : '',
                        cursor: 'pointer', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => {
                        if (selectedCartItem?.itemId !== item.item.productId || selectedCartItem?.variantId !== item.variant.productDetailId)
                          (e.currentTarget as HTMLTableRowElement).style.background = '#fafafa';
                      }}
                      onMouseLeave={e => {
                        if (selectedCartItem?.itemId !== item.item.productId || selectedCartItem?.variantId !== item.variant.productDetailId)
                          (e.currentTarget as HTMLTableRowElement).style.background = '';
                      }}
                    >
                      <td style={{ padding: '9px 10px', color: '#bbb' }}>{i + 1}</td>
                      <td style={{ padding: '9px 10px', color: '#888', fontSize: 11 }}>{item.item.productId}</td>
                      <td style={{ padding: '9px 10px', color: '#1a1a1a', fontWeight: 500 }}>{item.item.productId}</td>
                      <td style={{ padding: '9px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button
                            onClick={e => { e.stopPropagation(); onQtyChange(item.item.productId, item.variant.productDetailId, item.qty - 1); }}
                            style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 12, lineHeight: 1, color: '#555' }}
                          >−</button>
                          <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                          <button
                            onClick={e => { e.stopPropagation(); onQtyChange(item.item.productId, item.variant.productDetailId, item.qty + 1); }}
                            style={{ width: 20, height: 20, borderRadius: 4, border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: 12, lineHeight: 1, color: '#555' }}
                          >+</button>
                        </div>
                      </td>
                      <td style={{ padding: '9px 10px', color: '#888' }}>{item.variant.unit}</td>
                      <td style={{ padding: '9px 10px', color: '#555' }}>{fmt(item.variant.unitPrice)}</td>
                      <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 600, color: '#1a1a1a' }}>
                        {fmt(item.variant.unitPrice * item.qty)}
                      </td>
                      <td style={{ padding: '9px 6px' }}>
                        <button
                          onClick={e => { e.stopPropagation(); onRemove(item.item.productId, item.variant.productDetailId); }}
                          style={{
                            width: 20, height: 20, borderRadius: 4, border: 'none',
                            background: '#FEE8E8', color: '#A32D2D', cursor: 'pointer',
                            fontSize: 11, lineHeight: 1,
                          }}
                        >✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Total */}
        <div style={{
          padding: '12px 16px', borderTop: '0.5px solid rgba(0,0,0,0.08)',
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8,
          background: '#fafafa',
        }}>
          <span style={{ fontSize: 13, color: '#888' }}>Tổng tiền:</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#D4840A' }}>
            {total ? fmt(total) + 'đ' : '....'}
          </span>
        </div>
      </div>

      {/* ── Right: selected item & actions ── */}
      <div style={{
        flex: '0 0 180px', display: 'flex', flexDirection: 'column',
        padding: '14px 14px', gap: 10, background: '#fafafa',
        borderLeft: '0.5px solid rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Sản phẩm chọn
        </div>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 10,
          border: '1px solid #ebebeb', padding: 10,
          fontSize: 12, color: selectedItem ? '#1a1a1a' : '#bbb',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
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

        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Đơn giá
        </div>
        <div style={{
          background: '#fff', borderRadius: 10, border: '1px solid #ebebeb',
          padding: '10px', fontSize: 14, fontWeight: 700,
          color: selectedItem ? '#D4840A' : '#ddd', textAlign: 'center',
        }}>
          {selectedItem ? fmt(selectedItem.variant.unitPrice) + 'đ' : '—'}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={onClear}
            style={{
              flex: 1, padding: '8px 6px', borderRadius: 8,
              border: '1px solid #e0e0e0', background: '#fff',
              fontSize: 11, color: '#888', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Xóa
          </button>
          <button
            onClick={() => {}}
            style={{
              flex: 1, padding: '8px 6px', borderRadius: 8,
              border: '1px solid #e0e0e0', background: '#fff',
              fontSize: 11, color: '#888', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}
          >
            <span>Bàn phím</span>
            <span style={{ fontSize: 9 }}>số</span>
          </button>
        </div>

        <button
          onClick={() => {}}
          style={{
            padding: '9px', borderRadius: 8, border: '1px solid #e0e0e0',
            background: '#fff', fontSize: 12, color: '#555',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Nhập số lượng
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          style={{
            padding: '12px', borderRadius: 10, border: 'none',
            background: cart.length > 0 ? '#D4840A' : '#e0e0e0',
            color: '#fff', fontWeight: 700, fontSize: 14,
            cursor: cart.length > 0 ? 'pointer' : 'default',
            fontFamily: 'inherit', transition: 'background 0.15s',
          }}
        >
          Thanh toán
        </button>
        <button
          onClick={onClear}
          style={{
            padding: '11px', borderRadius: 10,
            border: '1.5px solid #e0e0e0',
            background: '#fff', color: '#A32D2D',
            fontWeight: 600, fontSize: 13,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}

// ─── Main BanHang Page ────────────────────────────────────────────────────────

export default function BanHang() {
  const { data: products, isLoading: productsLoading } = useFetchProducts();
  const { data: categories, isLoading: categoriesLoading} = useFetchProductCategories();
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
    setCart(prev => {
      const existing = prev.find(i => i.item.productId === item.productId && i.variant.productDetailId === variant.productDetailId);
      if (existing) return prev.map(i => i.item.productId === item.productId && i.variant.productDetailId === variant.productDetailId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { item, variant, qty: 1 }];
    });
  };

  const changeQty = (itemId: number, variantId: number, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(i => !(i.item.productId === itemId && i.variant.productDetailId === variantId)));
    else setCart(prev => prev.map(i => i.item.productId === itemId && i.variant.productDetailId === variantId ? { ...i, qty } : i));
  };

  const removeItem = (itemId: number, variantId: number) => setCart(prev => prev.filter(i => !(i.item.productId === itemId && i.variant.productDetailId === variantId)));

  const clearCart = () => { setCart([]); setDiscount(0); setBuyerCode(''); };

  const handleConfirm = (method: PaymentMethod) => {
    showToast(`✓ Thanh toán thành công qua ${method === 'cash' ? 'tiền mặt' : 'QR'}!`);
    clearCart();
    setView('pos');
  };

  if (categoriesLoading || productsLoading) { return <Spin fullscreen /> }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: '#f7f7f5', fontFamily: "'Be Vietnam Pro', sans-serif",
      position: 'relative',
    }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#1a1a1a', color: '#fff', padding: '10px 20px',
          borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 200,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap',
        }}>
          {toast}
        </div>
      )}

      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 20px',
        background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}>

        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Bán hàng</div>
        {cart.length > 0 && (
          <div style={{
            marginLeft: 4, background: '#D4840A', color: '#fff',
            borderRadius: '50%', width: 20, height: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700,
          }}>
            {cart.reduce((s, i) => s + i.qty, 0)}
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 12, color: '#aaa' }}>
          {view === 'checkout' && (
            <span style={{ color: '#D4840A', fontWeight: 500 }}>● Đang thanh toán</span>
          )}
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
  );
}