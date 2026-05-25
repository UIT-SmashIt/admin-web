import { useState } from 'react';

interface ServiceItem {
  id: number;
  name: string;
  unit: string;
  price: number;
  category: string;
}

interface SelectedService {
  service: ServiceItem;
  qty: number;
}

interface Court {
  id: number;
  name: string;
}

interface InvoiceModalProps {
  customerName: string;
  courtId: number;
  courts: Court[];
  startTime: string;
  endTime: string;
  services: SelectedService[];
  onConfirm: (method: 'CASH' | 'QR', data: any) => void;
  onClose: () => void;
  loading?: boolean;
}

const fmt = (n: number) => n.toLocaleString('vi-VN');

function calcHours(start: string, end: string): number {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };
  return Math.max(0, (toMin(end) - toMin(start)) / 60);
}

export function InvoiceModal({
  customerName,
  courtId,
  courts,
  startTime,
  endTime,
  services,
  onConfirm,
  onClose,
  loading = false,
}: InvoiceModalProps) {
  const [method, setMethod] = useState<'CASH' | 'QR' | null>(null);
  const court = courts.find(c => c.id === courtId);
  const hours = calcHours(startTime, endTime);
  const COURT_PRICE_PER_HOUR = 80000; // Should come from backend
  const courtFee = hours * COURT_PRICE_PER_HOUR;
  const serviceFee = services.reduce((s, i) => s + i.service.price * i.qty, 0);
  const total = courtFee + serviceFee;
  const deposit = courtFee / 2;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: 420, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.22)', fontFamily: "'Be Vietnam Pro', sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ background: 'linear-gradient(135deg,#D4840A,#F5A623)', padding: '20px 24px' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>Hóa đơn đặt lịch linh hoạt</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{customerName}</div>
        </div>
        <div style={{ padding: '20px 24px', maxHeight: 'calc(85vh - 100px)', overflowY: 'auto' }}>
          {[
            { label: 'Sân', value: court?.name },
            { label: 'Khung giờ', value: `${startTime} – ${endTime} (${hours}h)` },
            { label: 'Tiền sân', value: `${fmt(courtFee)}đ` },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 10px', borderRadius: 7, background: '#fafafa', marginBottom: 6 }}>
              <span style={{ color: '#888' }}>{r.label}</span>
              <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{r.value}</span>
            </div>
          ))}

          {services.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', margin: '10px 0 6px', letterSpacing: '0.04em' }}>Dịch vụ</div>
              {services.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 10px', borderRadius: 6, background: '#fafafa', marginBottom: 4 }}>
                  <span style={{ color: '#666' }}>{s.service.name} × {s.qty}</span>
                  <span style={{ fontWeight: 500 }}>{fmt(s.service.price * s.qty)}đ</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              <span style={{ color: '#555' }}>Tổng cộng</span>
              <span style={{ color: '#D4840A' }}>{fmt(total)}đ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, background: '#FFF7ED', padding: '10px 12px', borderRadius: 9 }}>
              <span style={{ color: '#D4840A' }}>💰 Cọc trước (50% sân)</span>
              <span style={{ color: '#D4840A', fontSize: 15 }}>{fmt(deposit)}đ</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#aaa', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Thanh toán cọc qua</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ key: 'CASH' as const, icon: '💵', label: 'Tiền mặt' }, { key: 'QR' as const, icon: '📱', label: 'Mã QR' }].map(m => (
                <button key={m.key} onClick={() => setMethod(m.key)} disabled={loading} style={{
                  flex: 1, padding: '14px', borderRadius: 12,
                  border: `2px solid ${method === m.key ? '#D4840A' : '#e0e0e0'}`,
                  background: method === m.key ? '#FFF7ED' : '#fff',
                  cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: 'center', transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: method === m.key ? '#D4840A' : '#555' }}>{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => method && onConfirm(method, { courtFee, serviceFee, total, deposit })} disabled={!method || loading} style={{ flex: 1, padding: '13px', borderRadius: 10, border: 'none', background: method && !loading ? '#D4840A' : '#e0e0e0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: method && !loading ? 'pointer' : 'default', fontFamily: 'inherit' }}>
              {loading ? '⏳ Đang xử lý...' : '✓ Xác nhận đặt lịch'}
            </button>
            <button onClick={onClose} disabled={loading} style={{ padding: '13px 20px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontWeight: 600, fontSize: 13, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit' }}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
