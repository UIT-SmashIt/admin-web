import { useState } from 'react';
import type { CartItem, PaymentMethod } from '../types.ts';
import { fmt, DENOMINATIONS } from '../constants';
import QRCodeModal from './QRCodeModal';

interface CheckoutViewProps {
  cart: CartItem[];
  discount: number;
  buyerCode: string;
  onBuyerCodeChange: (v: string) => void;
  onDiscountChange: (v: number) => void;
  onBack: () => void;
  onConfirm: (method: PaymentMethod) => void;
}

export default function CheckoutView({
  cart,
  discount,
  buyerCode,
  onBuyerCodeChange,
  onDiscountChange,
  onBack,
  onConfirm,
}: CheckoutViewProps) {
  const [payMethod, setPayMethod] = useState<PaymentMethod>(null);
  const [cashInput, setCashInput] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.variant.unitPrice * i.qty, 0);
  const discountAmt = Math.round((subtotal * discount) / 100);
  const total = subtotal - discountAmt;
  const rounded = Math.ceil(total / 1000) * 1000;
  const cash = parseInt(cashInput.replace(/\D/g, '')) || 0;
  const change = paidAmount > rounded ? paidAmount - rounded : 0;
  const remaining = paidAmount < rounded ? rounded - paidAmount : 0;

  const fields = [
    { label: 'Giá gốc', value: fmt(subtotal) + 'đ' },
    { label: 'Khuyến mãi', value: discount ? `-${fmt(discountAmt)}đ` : '—', color: '#22863a' },
    { label: 'Cần thu', value: fmt(total) + 'đ', bold: true },
    { label: 'Làm tròn', value: fmt(rounded) + 'đ' },
    { label: 'Đã thu', value: paidAmount > 0 ? fmt(paidAmount) + 'đ' : '—' },
    { label: 'Tiền thừa', value: change > 0 ? fmt(change) + 'đ' : '—', color: '#D4840A' },
    { label: 'Còn thiếu', value: remaining > 0 ? fmt(remaining) + 'đ' : '—', color: '#D4840A' },
    { label: 'Thanh toán', value: fmt(rounded) + 'đ', bold: true, accent: true },
  ];

  const handleCashKeypad = (key: string) => {
    if (key === '⌫') {
      setCashInput((prev) => {
        const s = prev.replace(/\D/g, '').slice(0, -1);
        return s ? fmt(parseInt(s)) : '';
      });
    } else {
      setCashInput((prev) => {
        const s = (prev.replace(/\D/g, '') + key).replace(/^0+/, '') || '0';
        return fmt(parseInt(s));
      });
    }
  };

  const addCashDenomination = (d: number) => {
    setCashInput((prev) => {
      const cur = parseInt(prev.replace(/\D/g, '')) || 0;
      return fmt(cur + d);
    });
  };

  return (
    <>
      {showQR && <QRCodeModal total={total} onClose={() => setShowQR(false)} />}
      <div style={{ display: 'flex', flex: 1, gap: 0, overflow: 'hidden' }}>
        {/* Left: fields */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            borderRight: '0.5px solid rgba(0,0,0,0.08)',
            background: '#fff',
          }}
        >
          {/* Back button */}
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#D4840A',
              fontWeight: 500,
              fontSize: 14,
              fontFamily: 'inherit',
              marginBottom: 20,
              padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Thanh toán
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
            {fields.map((f) => (
              <div
                key={f.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: f.accent ? '#FFF9F0' : '#fafafa',
                  borderRadius: 8,
                  border: f.accent ? '1px solid #FAEEDA' : '1px solid transparent',
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 13, color: '#888' }}>{f.label}</span>
                <span
                  style={{
                    fontSize: f.bold ? 18 : 13,
                    fontWeight: f.bold ? 700 : 500,
                    color: f.color ?? (f.accent ? '#D4840A' : '#1a1a1a'),
                  }}
                >
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
              onChange={(e) => onBuyerCodeChange(e.target.value)}
              placeholder="Nhập mã khách hàng (tuỳ chọn)"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #e8e8e8',
                borderRadius: 8,
                padding: '9px 12px',
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
                color: '#1a1a1a',
              }}
            />
          </div>

          {/* Promo */}
          <button
            onClick={() => setPromoExpanded(!promoExpanded)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px dashed #e0e0e0',
              background: '#fafafa',
              color: '#666',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
                type="number"
                min={0}
                max={100}
                value={discount}
                onChange={(e) => onDiscountChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                style={{
                  width: 80,
                  border: '1px solid #e8e8e8',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: 12, color: '#aaa', marginLeft: 8 }}>%</span>
            </div>
          )}
        </div>

        {/* Right: payment methods */}
        <div
          style={{
            width: 280,
            padding: '20px 16px',
            background: '#f7f7f5',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            borderLeft: '0.5px solid rgba(0,0,0,0.08)',
            overflow: 'auto',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Phương thức
          </div>

          {/* QR Button - smaller */}
          <button
            onClick={() => {
              setPayMethod('qr');
              setShowQR(true);
            }}
            style={{
              minHeight: 60,
              borderRadius: 10,
              border: `2px solid ${payMethod === 'qr' ? '#D4840A' : '#e0e0e0'}`,
              background: payMethod === 'qr' ? '#FFF9F0' : '#fff',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              transition: 'all 0.15s',
            }}
            title={`Mã QR cho ${fmt(total)}đ`}
          >
            <span style={{ fontSize: 20 }}>📱</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: payMethod === 'qr' ? '#D4840A' : '#555',
              }}
            >
              Mã QR
            </span>
          </button>

          {/* Cash Input Section */}
          <div style={{ padding: '12px', background: '#fff', borderRadius: 10, border: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 8 }}>💵 Tiền mặt</div>

            {/* Cash input display */}
            <input
              value={cashInput}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                setCashInput(num ? fmt(num) : '');
              }}
              placeholder="Nhập số tiền"
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

            {/* Denominations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 8 }}>
              {DENOMINATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => addCashDenomination(d)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: '1px solid #ddd',
                    background: '#f5f5f5',
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: '#666',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {d >= 1000 ? `${d / 1000}k` : d}
                </button>
              ))}
            </div>

            {/* Numpad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 8 }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '000', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleCashKeypad(k)}
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
              onClick={() => {
                if (cash > 0) {
                  setPayMethod('cash');
                  setPaidAmount(cash);
                }
              }}
              disabled={cash === 0}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 8,
                border: 'none',
                background: cash > 0 ? '#22863a' : '#ccc',
                color: '#fff',
                fontWeight: 600,
                fontSize: 12,
                cursor: cash > 0 ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}
            >
              ✓ Xác nhận tiền
            </button>
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={() => {
              if (!payMethod) return;
              onConfirm(payMethod);
            }}
            disabled={!payMethod}
            style={{
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: payMethod ? '#D4840A' : '#e0e0e0',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              cursor: payMethod ? 'pointer' : 'default',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            Thanh toán
          </button>
          <button
            onClick={onBack}
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
            Hủy thanh toán
          </button>
        </div>
      </div>
    </>
  );
}
