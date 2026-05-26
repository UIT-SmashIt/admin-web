import type { AdminOrder } from '../../../../types/order.type';
import type { ICourt } from '../../../../types/court.type';

interface BookingListProps {
  orders: AdminOrder[];
  courts: ICourt[];
  onView: (order: AdminOrder) => void;
  onEdit: (order: AdminOrder) => void;
  loading?: boolean;
}

const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  WaitingForPayment: { label: 'Chờ thanh toán', color: '#fff', bg: '#E53E3E' },
  pending: { label: 'Chờ xác nhận', color: '#1a1a1a', bg: '#F6C90E' },
  confirmed: { label: 'Đã xác nhận', color: '#fff', bg: '#38A169' },
  completed: { label: 'Hoàn thành', color: '#fff', bg: '#378ADD' },
  cancelled: { label: 'Đã hủy', color: '#fff', bg: '#A32D2D' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.pending;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      background: cfg.bg, color: cfg.color,
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.02em',
    }}>{cfg.label}</span>
  );
}

function BookingCard({ 
  order,
  courts,
  onView, 
  onEdit,
}: { 
  order: AdminOrder;
  courts: ICourt[];
  onView: () => void;
  onEdit: () => void;
}) {
  const courtNames = order.courtIds
    .map(id => courts.find(c => c.courtId === id)?.name)
    .filter(Boolean)
    .join(', ');

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '0.5px solid rgba(0,0,0,0.08)',
      overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => { 
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; 
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; 
      }}
      onMouseLeave={e => { 
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; 
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; 
      }}
      onClick={onView}
    >
      {/* Header bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 10px',
        background: ORDER_STATUS_CONFIG[order.status]?.bg || '#f5f5f3',
      }}>
        <StatusBadge status={order.status} />
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={onEdit} style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#666', transition: 'all 0.12s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0'; (e.currentTarget as HTMLButtonElement).style.color = '#D4840A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#666'; }}>✏️</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{order.guestName}</div>
        </div>

        <div style={{ fontSize: 11.5, color: '#888', lineHeight: 1.65 }}>
          <div>Mã đơn: <span style={{ color: '#555', fontWeight: 500 }}>{order.customerId}</span></div>
          <div>{courtNames} · {order.startHour}–{order.endHour}</div>
          <div>{order.orderDate}</div>
          <div>Email: <span style={{ color: '#555', fontWeight: 500 }}>{order.guestEmail}</span></div>
          <div>ĐT: <span style={{ color: '#555', fontWeight: 500 }}>{order.guestPhoneNumber}</span></div>
        </div>
      </div>
    </div>
  );
}

export function BookingList({ 
  orders,
  courts,
  onView, 
  onEdit,
  loading = false
}: BookingListProps) {
  if (loading) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center', color: '#aaa' }}>
        ⏳ Đang tải...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center', color: '#aaa' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
        <div style={{ fontSize: 14 }}>Chưa có đơn đặt lịch</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14, padding: '0 24px' }}>
      {orders.map(order => (
        <BookingCard 
          key={order.courtOrderId}
          order={order}
          courts={courts}
          onView={() => onView(order)}
          onEdit={() => onEdit(order)}
        />
      ))}
    </div>
  );
}
