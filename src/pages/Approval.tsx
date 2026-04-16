import { useState, useMemo } from 'react';
import { COURTS, PAYMENT_STATUS_CONFIG, type PaymentStatus, fmt } from '../pages/Lịch đặt/LichDatTypes';

// ─── Types ────────────────────────────────────────────────────────────────────

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface Order {
  id: number;
  customerName: string;
  customerCode: string;
  phone: string;
  courtId: number;
  date: string;
  startTime: string;
  endTime: string;
  type: 'single' | 'community';
  courtFee: number;
  deposit: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'cash' | 'qr';
  approvalStatus: ApprovalStatus;
  note: string;
  submittedAt: string;
  approvedAt?: string;
  rejectedReason?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_ORDERS: Order[] = [
  { id: 1, customerName: 'Nguyễn Văn An', customerCode: 'NVA01', phone: '0901234567', courtId: 1, date: '19/04/2026', startTime: '6:00', endTime: '8:00', type: 'single', courtFee: 160000, deposit: 80000, paymentStatus: 'deposited', paymentMethod: 'qr', approvalStatus: 'pending', note: '', submittedAt: '16/04/2026 08:32' },
  { id: 2, customerName: 'Trần Thị Bình', customerCode: 'TTB02', phone: '0912345678', courtId: 2, date: '20/04/2026', startTime: '7:00', endTime: '9:00', type: 'community', courtFee: 320000, deposit: 160000, paymentStatus: 'deposited', paymentMethod: 'cash', approvalStatus: 'pending', note: 'Nhóm 4 người, cần ghế ngồi thêm', submittedAt: '16/04/2026 09:15' },
  { id: 3, customerName: 'Lê Dương', customerCode: 'LD03', phone: '0923456789', courtId: 3, date: '17/04/2026', startTime: '17:00', endTime: '19:00', type: 'single', courtFee: 160000, deposit: 80000, paymentStatus: 'unpaid', approvalStatus: 'pending', note: '', submittedAt: '16/04/2026 10:00' },
  { id: 4, customerName: 'Phạm Hương', customerCode: 'PH04', phone: '0934567890', courtId: 1, date: '22/04/2026', startTime: '18:00', endTime: '20:00', type: 'community', courtFee: 160000, deposit: 80000, paymentStatus: 'paid', paymentMethod: 'cash', approvalStatus: 'approved', approvedAt: '15/04/2026 14:00', note: '', submittedAt: '14/04/2026 20:10' },
  { id: 5, customerName: 'Bùi Nam', customerCode: 'BN05', phone: '0945678901', courtId: 2, date: '18/04/2026', startTime: '8:00', endTime: '10:00', type: 'single', courtFee: 160000, deposit: 80000, paymentStatus: 'deposited', paymentMethod: 'qr', approvalStatus: 'rejected', rejectedReason: 'Sân đã có lịch cố định', note: '', submittedAt: '15/04/2026 18:00' },
  { id: 6, customerName: 'Vũ Linh', customerCode: 'VL06', phone: '0956789012', courtId: 3, date: '21/04/2026', startTime: '10:00', endTime: '12:00', type: 'single', courtFee: 160000, deposit: 80000, paymentStatus: 'unpaid', approvalStatus: 'pending', note: 'Khách VIP', submittedAt: '16/04/2026 11:45' },
  { id: 7, customerName: 'Đỗ Minh Khoa', customerCode: 'DMK07', phone: '0967123456', courtId: 1, date: '23/04/2026', startTime: '14:00', endTime: '16:00', type: 'single', courtFee: 160000, deposit: 80000, paymentStatus: 'deposited', paymentMethod: 'qr', approvalStatus: 'pending', note: '', submittedAt: '16/04/2026 13:20' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const APPROVAL_CONFIG: Record<ApprovalStatus, { label: string; color: string; bg: string; border: string; icon: string }> = {
  pending:  { label: 'Chờ duyệt',   color: '#B45309', bg: '#FFFBEB', border: '#FDE68A', icon: '⏳' },
  approved: { label: 'Đã duyệt',    color: '#166534', bg: '#F0FDF4', border: '#BBF7D0', icon: '✅' },
  rejected: { label: 'Từ chối',     color: '#A32D2D', bg: '#FFF5F5', border: '#FECDD3', icon: '❌' },
};

function StatusBadge({ status, small }: { status: ApprovalStatus; small?: boolean }) {
  const cfg = APPROVAL_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: small ? '2px 8px' : '4px 11px', borderRadius: 20,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      fontSize: small ? 11 : 12, fontWeight: 600,
    }}>
      <span style={{ fontSize: small ? 9 : 11 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

function PayBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_STATUS_CONFIG[status];
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, background: cfg.bg, color: cfg.color, fontSize: 10.5, fontWeight: 700 }}>
      {cfg.label}
    </span>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────

function RejectModal({ onConfirm, onClose }: {
  onConfirm: (reason: string) => void; onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  const PRESETS = ['Sân đã có lịch cố định', 'Thời gian không hợp lệ', 'Khách chưa đặt cọc', 'Sân đang bảo trì', 'Lý do khác'];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: 420, padding: '24px', boxShadow: '0 24px 80px rgba(0,0,0,0.2)', fontFamily: "'Be Vietnam Pro', sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 28, textAlign: 'center', marginBottom: 8 }}>❌</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', textAlign: 'center', marginBottom: 4 }}>Từ chối đơn đặt sân</div>
        <div style={{ fontSize: 12.5, color: '#aaa', textAlign: 'center', marginBottom: 18 }}>Vui lòng chọn hoặc nhập lý do từ chối</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {PRESETS.map(p => (
            <button key={p} onClick={() => setReason(p)} style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
              border: `1px solid ${reason === p ? '#A32D2D' : '#e0e0e0'}`,
              background: reason === p ? '#FFF5F5' : '#fafafa',
              color: reason === p ? '#A32D2D' : '#666',
              fontWeight: reason === p ? 600 : 400, transition: 'all 0.12s',
            }}>{p}</button>
          ))}
        </div>
        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Hoặc nhập lý do khác..."
          style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #e8e8e8', borderRadius: 9, padding: '10px 13px', fontSize: 13.5, fontFamily: 'inherit', outline: 'none', resize: 'none' as const, marginBottom: 14, lineHeight: 1.5 }}
          onFocus={e => (e.target.style.borderColor = '#A32D2D')}
          onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => reason.trim() && onConfirm(reason)} disabled={!reason.trim()} style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: reason.trim() ? '#A32D2D' : '#e0e0e0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: reason.trim() ? 'pointer' : 'default', fontFamily: 'inherit' }}>Xác nhận từ chối</button>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#666', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

function DetailDrawer({ order, onApprove, onReject, onClose }: {
  order: Order; onApprove: () => void; onReject: () => void; onClose: () => void;
}) {
  const court = COURTS.find(c => c.id === order.courtId);
  const [showRejectModal, setShowRejectModal] = useState(false);

  return (
    <>
      {showRejectModal && (
        <RejectModal
          onConfirm={reason => { onReject(); setShowRejectModal(false); }}
          onClose={() => setShowRejectModal(false)}
        />
      )}
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.3)' }} onClick={onClose} />
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 301,
        width: 420, background: '#fff',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.2s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid #f0f0ee', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>{order.customerName}</div>
              <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <StatusBadge status={order.approvalStatus} />
                <PayBadge status={order.paymentStatus} />
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: order.type === 'community' ? '#F3E8FF' : '#EFF6FF', color: order.type === 'community' ? '#7B1FA2' : '#378ADD', fontWeight: 600 }}>
                  {order.type === 'community' ? '🏘️ Cộng đồng' : '⚡ Linh hoạt'}
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 15, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Mã đơn', value: order.customerCode },
              { label: 'Điện thoại', value: order.phone },
              { label: 'Sân', value: court?.name },
              { label: 'Ngày đặt', value: order.date },
              { label: 'Giờ', value: `${order.startTime} – ${order.endTime}` },
              { label: 'Gửi lúc', value: order.submittedAt },
              { label: 'Tiền sân', value: `${fmt(order.courtFee)}đ` },
              { label: 'Tiền cọc', value: `${fmt(order.deposit)}đ` },
              ...(order.paymentMethod ? [{ label: 'TT cọc qua', value: order.paymentMethod === 'cash' ? '💵 Tiền mặt' : '📱 QR' }] : []),
              ...(order.approvedAt ? [{ label: 'Duyệt lúc', value: order.approvedAt }] : []),
            ].map(f => (
              <div key={f.label} style={{ padding: '10px 12px', borderRadius: 9, background: '#fafafa', border: '1px solid #f0f0ee' }}>
                <div style={{ fontSize: 10.5, color: '#aaa', marginBottom: 3, fontWeight: 500 }}>{f.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{f.value}</div>
              </div>
            ))}
          </div>

          {order.note && (
            <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FFFBEB', border: '1px solid #FDE68A', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#B45309', fontWeight: 600, marginBottom: 4 }}>📝 GHI CHÚ</div>
              <div style={{ fontSize: 13, color: '#92400E' }}>{order.note}</div>
            </div>
          )}

          {order.rejectedReason && (
            <div style={{ padding: '12px 14px', borderRadius: 10, background: '#FFF5F5', border: '1px solid #FECDD3', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: '#A32D2D', fontWeight: 600, marginBottom: 4 }}>❌ LÝ DO TỪ CHỐI</div>
              <div style={{ fontSize: 13, color: '#7F1D1D' }}>{order.rejectedReason}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        {order.approvalStatus === 'pending' && (
          <div style={{ padding: '16px 24px', borderTop: '0.5px solid #f0f0ee', display: 'flex', gap: 10, flexShrink: 0 }}>
            <button onClick={onApprove} style={{ flex: 1, padding: '13px', borderRadius: 10, border: 'none', background: '#22863a', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              ✅ Duyệt đơn
            </button>
            <button onClick={() => setShowRejectModal(true)} style={{ flex: 1, padding: '13px', borderRadius: 10, border: '1.5px solid #FECDD3', background: '#FFF5F5', color: '#A32D2D', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              ❌ Từ chối
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderRow({ order, onSelect, onApprove, onReject }: {
  order: Order; onSelect: () => void;
  onApprove: () => void; onReject: () => void;
}) {
  const court = COURTS.find(c => c.id === order.courtId);
  return (
    <tr style={{ borderBottom: '0.5px solid #f5f5f3', cursor: 'pointer', transition: 'background 0.1s' }}
      onClick={onSelect}
      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafaf8'}
      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
    >
      <td style={{ padding: '13px 14px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a1a' }}>{order.customerName}</div>
        <div style={{ fontSize: 11.5, color: '#aaa', marginTop: 1 }}>{order.customerCode} · {order.phone}</div>
      </td>
      <td style={{ padding: '13px 14px', fontSize: 13, color: '#555' }}>
        <div>{court?.name}</div>
        <div style={{ fontSize: 11.5, color: '#aaa' }}>{order.startTime}–{order.endTime}</div>
      </td>
      <td style={{ padding: '13px 14px', fontSize: 13, color: '#555' }}>{order.date}</td>
      <td style={{ padding: '13px 14px' }}>
        <div style={{ marginBottom: 4 }}><StatusBadge status={order.approvalStatus} small /></div>
        <PayBadge status={order.paymentStatus} />
      </td>
      <td style={{ padding: '13px 14px', fontSize: 13, fontWeight: 600, color: '#D4840A' }}>{fmt(order.courtFee)}đ</td>
      <td style={{ padding: '13px 14px' }} onClick={e => e.stopPropagation()}>
        {order.approvalStatus === 'pending' ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onApprove} style={{ padding: '6px 12px', borderRadius: 7, border: 'none', background: '#22863a', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>✓ Duyệt</button>
            <button onClick={onReject} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid #FECDD3', background: '#FFF5F5', color: '#A32D2D', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: '#bbb' }}>—</span>
        )}
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DuyetDon() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [filter, setFilter] = useState<ApprovalStatus | 'all'>('pending');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(o =>
      (filter === 'all' || o.approvalStatus === filter) &&
      (o.customerName.toLowerCase().includes(q) || o.customerCode.toLowerCase().includes(q) || o.phone.includes(q))
    ).sort((a, b) => a.submittedAt < b.submittedAt ? 1 : -1);
  }, [orders, filter, search]);

  const approve = (id: number) => setOrders(prev => prev.map(o => o.id === id ? { ...o, approvalStatus: 'approved', approvedAt: new Date().toLocaleString('vi-VN') } : o));
  const reject = (id: number, reason: string) => setOrders(prev => prev.map(o => o.id === id ? { ...o, approvalStatus: 'rejected', rejectedReason: reason } : o));

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.approvalStatus === 'pending').length,
    approved: orders.filter(o => o.approvalStatus === 'approved').length,
    rejected: orders.filter(o => o.approvalStatus === 'rejected').length,
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", background: '#f7f7f5' }}>
      {selectedOrder && (
        <DetailDrawer
          order={selectedOrder}
          onApprove={() => { approve(selectedOrder.id); setSelectedOrder(prev => prev ? { ...prev, approvalStatus: 'approved', approvedAt: new Date().toLocaleString('vi-VN') } : null); }}
          onReject={() => setRejectTarget(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
        />
      )}
      {rejectTarget && (
        <RejectModal
          onConfirm={reason => { reject(rejectTarget.id, reason); setRejectTarget(null); setSelectedOrder(null); }}
          onClose={() => setRejectTarget(null)}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Duyệt đơn</div>
          <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 2 }}>
            {counts.pending} đơn đang chờ · {counts.approved} đã duyệt · {counts.rejected} từ chối
          </div>
        </div>
        {/* Bulk approve pending */}
        {counts.pending > 0 && (
          <button onClick={() => setOrders(prev => prev.map(o => o.approvalStatus === 'pending' ? { ...o, approvalStatus: 'approved', approvedAt: new Date().toLocaleString('vi-VN') } : o))} style={{
            padding: '9px 18px', borderRadius: 10, border: 'none',
            background: '#22863a', color: '#fff', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 8px rgba(34,134,58,0.25)',
          }}>
            ✅ Duyệt tất cả ({counts.pending})
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {([
          { key: 'all', label: 'Tất cả', value: counts.all, color: '#378ADD', bg: '#EFF6FF' },
          { key: 'pending', label: 'Chờ duyệt', value: counts.pending, color: '#B45309', bg: '#FFFBEB' },
          { key: 'approved', label: 'Đã duyệt', value: counts.approved, color: '#166534', bg: '#F0FDF4' },
          { key: 'rejected', label: 'Từ chối', value: counts.rejected, color: '#A32D2D', bg: '#FFF5F5' },
        ] as const).map(card => (
          <button key={card.key} onClick={() => setFilter(card.key as ApprovalStatus | 'all')} style={{
            flex: '1 1 120px', padding: '14px 16px', borderRadius: 12,
            border: `1.5px solid ${filter === card.key ? card.color : '#e8e8e8'}`,
            background: filter === card.key ? card.bg : '#fff',
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            transition: 'all 0.15s', boxShadow: filter === card.key ? `0 2px 8px ${card.color}22` : 'none',
          }}>
            <div style={{ fontSize: 11.5, color: '#888', fontWeight: 500 }}>{card.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: card.color, marginTop: 4 }}>{card.value}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 14, maxWidth: 380 }}>
        <svg style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên, mã, SĐT..."
          style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #e8e8e8', borderRadius: 9, padding: '9px 12px 9px 34px', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#1a1a1a', background: '#fff' }}
          onFocus={e => (e.target.style.borderColor = '#378ADD')}
          onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              {['Khách hàng', 'Sân', 'Ngày đặt', 'Trạng thái', 'Tiền sân', 'Thao tác'].map((h, i) => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#999', fontWeight: 600, fontSize: 11.5, borderBottom: '1px solid #ebebeb', letterSpacing: '0.03em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#bbb', fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                Không có đơn nào
              </td></tr>
            ) : filtered.map(o => (
              <OrderRow key={o.id} order={o}
                onSelect={() => setSelectedOrder(o)}
                onApprove={() => approve(o.id)}
                onReject={() => setRejectTarget(o)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: '#bbb', textAlign: 'center' }}>
          Hiển thị {filtered.length} / {orders.length} đơn
        </div>
      )}
    </div>
  );
}