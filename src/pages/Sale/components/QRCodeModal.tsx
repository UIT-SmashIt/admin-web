import { useState, useEffect } from 'react';
import { fmt } from '../constants';

interface QRCodeModalProps {
  total: number;
  onClose: () => void;
}

export default function QRCodeModal({ total, onClose }: QRCodeModalProps) {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate fetching QR code from backend
  useEffect(() => {
    // Mock API call to generate QR code
    const timer = setTimeout(() => {
      // Mock QR code data (in real app, would come from backend)
      const mockQRData = `https://qr.viblo.asia/?d=SO_TIEN:${total}|THOI_GIAN:${new Date().toISOString()}|ID:${Math.random().toString(36).substr(2, 9)}`;
      setQrCode(mockQRData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [total]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 150,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          width: 320,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 16 }}>
          Mã QR thanh toán
        </div>

        {loading ? (
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        ) : (
          <>
            <div
              style={{
                width: 200,
                height: 200,
                margin: '0 auto 16px',
                background: '#f0f0f0',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #e0e0e0',
                fontSize: 32,
              }}
            >
              📱
            </div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 12, wordBreak: 'break-all' }}>
              {qrCode.substring(0, 50)}...
            </div>
          </>
        )}

        <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
          Cần thanh toán: <strong style={{ color: '#D4840A', fontSize: 14 }}>{fmt(total)}đ</strong>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: 9,
            border: 'none',
            background: '#D4840A',
            color: '#fff',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          ✓ Xác nhận
        </button>
      </div>
    </div>
  );
}
