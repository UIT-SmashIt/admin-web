import { useState } from 'react';
import type { AdminOrder } from '../../../../types/order.type';
import type { ICourt } from '../../../../types/court.type';

interface OrderDetailsViewProps {
  order: AdminOrder;
  courts: ICourt[];
  onBack: () => void;
  onEdit: () => void;
  onInvoice: (orderId: number, payload: any) => void;
  loading?: boolean;
}

export function OrderDetailsView({
  order,
  courts,
  onBack,
  onEdit,
  onInvoice,
  loading = false,
}: OrderDetailsViewProps) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [givenAmount, setGivenAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QR' | null>(null);

  const courtNames = order.courtIds
    .map(id => courts.find(c => c.courtId === id)?.name)
    .filter(Boolean)
    .join(', ');

  const handleInvoiceSubmit = () => {
    if (!paymentMethod || !givenAmount) {
      alert('Vui lòng chọn phương thức thanh toán và nhập số tiền');
      return;
    }
    onInvoice(order.courtOrderId, {
      givenAmount: parseInt(givenAmount),
      paymentMethod,
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: '#f7f7f5' }}>
        <button onClick={onBack} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: loading ? 'default' : 'pointer', color: '#D4840A', fontWeight: 600, fontSize: 15, fontFamily: 'inherit', padding: 0, marginBottom: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Quay lại
        </button>

        <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', marginBottom: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
                {order.guestName}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>Mã đơn: {order.courtOrderId}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onEdit} disabled={loading} style={{
                padding: '10px 16px', borderRadius: 8, border: 'none',
                background: '#D4840A', color: '#fff',
                fontWeight: 600, fontSize: 13,
                cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
              }}>
                ✏️ Chỉnh sửa
              </button>
              <button onClick={() => setShowInvoiceModal(true)} disabled={loading} style={{
                padding: '10px 16px', borderRadius: 8, border: '1.5px solid #D4840A',
                background: '#fff', color: '#D4840A',
                fontWeight: 600, fontSize: 13,
                cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
              }}>
                🧾 Xuất hóa đơn
              </button>
            </div>
          </div>

          {/* Status Badge */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: 6,
              background: order.status === 'WaitingForPayment' ? '#E53E3E' : '#38A169',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
            }}>
              {order.status === 'WaitingForPayment' ? 'Chờ thanh toán' : 'Đã xác nhận'}
            </span>
          </div>

          {/* Order Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11.5, color: '#999', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Thông tin khách</div>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: '#555' }}>
                <div><strong>Email:</strong> {order.guestEmail}</div>
                <div><strong>ĐT:</strong> {order.guestPhoneNumber}</div>
                <div><strong>ID khách:</strong> {order.customerId}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11.5, color: '#999', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Lịch đặt</div>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: '#555' }}>
                <div><strong>Ngày:</strong> {order.orderDate}</div>
                <div><strong>Khung giờ:</strong> {order.startHour} - {order.endHour}</div>
                <div><strong>Sân:</strong> {courtNames}</div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11.5, color: '#999', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Thời gian tạo</div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            <div>Tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}</div>
            <div>Cập nhật: {new Date(order.updatedAt).toLocaleString('vi-VN')}</div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowInvoiceModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 450, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.22)', fontFamily: "'Be Vietnam Pro', sans-serif" }} onClick={e => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(135deg,#D4840A,#F5A623)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>Xuất hóa đơn</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{order.guestName}</div>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Amount Input */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>Số tiền nhận</label>
                <input
                  type="number"
                  value={givenAmount}
                  onChange={e => setGivenAmount(e.target.value)}
                  placeholder="Nhập số tiền"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: '1.5px solid #e8e8e8', borderRadius: 9,
                    padding: '10px 13px', fontSize: 14, fontFamily: 'inherit',
                    color: '#1a1a1a', background: '#fff', outline: 'none',
                  }}
                  disabled={loading}
                />
              </div>

              {/* Payment Method */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11.5, color: '#999', display: 'block', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Phương thức thanh toán</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[{ key: 'CASH' as const, icon: '💵', label: 'Tiền mặt' }, { key: 'QR' as const, icon: '📱', label: 'Mã QR' }].map(m => (
                    <button
                      key={m.key}
                      onClick={() => setPaymentMethod(m.key)}
                      disabled={loading}
                      style={{
                        flex: 1, padding: '14px', borderRadius: 10,
                        border: `2px solid ${paymentMethod === m.key ? '#D4840A' : '#e0e0e0'}`,
                        background: paymentMethod === m.key ? '#FFF7ED' : '#fff',
                        cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: 'center', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: paymentMethod === m.key ? '#D4840A' : '#555' }}>{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleInvoiceSubmit}
                  disabled={!givenAmount || !paymentMethod || loading}
                  style={{
                    flex: 1, padding: '13px', borderRadius: 10, border: 'none',
                    background: givenAmount && paymentMethod && !loading ? '#D4840A' : '#e0e0e0',
                    color: '#fff', fontWeight: 700, fontSize: 14,
                    cursor: givenAmount && paymentMethod && !loading ? 'pointer' : 'default',
                    fontFamily: 'inherit',
                  }}
                >
                  {loading ? '⏳ Đang xử lý...' : '✓ Xuất hóa đơn'}
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  disabled={loading}
                  style={{
                    padding: '13px 20px', borderRadius: 10, border: '1.5px solid #e0e0e0',
                    background: '#fff', color: '#666', fontWeight: 600, fontSize: 13,
                    cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
