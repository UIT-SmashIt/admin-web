import type { IOrder } from '../../../../types/order.type';
import type { ICourt } from '../../../../types/court.type';

interface BookingListProps {
  orders: IOrder[];
  courts: ICourt[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const fmt = (n: number) => n.toLocaleString('vi-VN');

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  unpaid:    { label: 'Chưa thanh toán', color: '#fff',    bg: '#E53E3E' },
  deposited: { label: 'Đã cọc',          color: '#1a1a1a', bg: '#F6C90E' },
  paid:      { label: 'Đã thanh toán',   color: '#fff',    bg: '#38A169' },
  cancelled: { label: 'Đã hủy',          color: '#fff',    bg: '#A32D2D' },
};

function PaymentBadge({ status }: { status: string }) {
  const cfg = PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.unpaid;
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
  court, 
  onView, 
  onEdit, 
  onDelete 
}: { 
  order: IOrder;
  court?: ICourt;
  onView: () => void; 
  onEdit: () => void; 
  onDelete: () => void;
}) {
  const total = order.courtFee + order.serviceFee;

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
        background: PAYMENT_STATUS_CONFIG[order.paymentStatus]?.bg || '#f5f5f3',
      }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <span style={{ fontSize: 9, fontWeight: 700, background: '#378ADD', color: '#fff', padding: '1px 5px', borderRadius: 3 }}>
            {order.type === 'community' ? 'CỘNG ĐỒNG' : 'ĐƠN NGÀY'}
          </span>
          <PaymentBadge status={order.paymentStatus} />
        </div>
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={onEdit} style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#666', transition: 'all 0.12s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0'; (e.currentTarget as HTMLButtonElement).style.color = '#D4840A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#666'; }}>✏️</button>
          <button onClick={onDelete} style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#bbb', transition: 'all 0.12s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5'; (e.currentTarget as HTMLButtonElement).style.color = '#A32D2D'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#bbb'; }}>🗑️</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{order.customerName}</div>
        </div>

        <div style={{ fontSize: 11.5, color: '#888', lineHeight: 1.65 }}>
          <div>Mã đơn: <span style={{ color: '#555', fontWeight: 500 }}>{order.customerCode}</span></div>
          <div>{court?.name} · {order.startTime}–{order.endTime}</div>
          <div>{order.date}</div>

          {order.type === 'community' && order.maxPlayers && (
            <div style={{ marginTop: 6, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: order.maxPlayers }).map((_, i) => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: 2,
                    background: i < (order.currentPlayers ?? 0) ? '#7B1FA2' : '#e8e8e8',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: '#7B1FA2', fontWeight: 600 }}>
                {order.currentPlayers ?? 0}/{order.maxPlayers} người
              </span>
            </div>
          )}

          <div style={{ marginTop: 4, fontWeight: 600, color: '#D4840A' }}>{fmt(total)}đ</div>
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
  onDelete,
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
      {orders.map(order => {
        const court = courts.find(c => c.courtId === order.courtId);
        return (
          <BookingCard 
            key={order.id} 
            order={order} 
            court={court}
            onView={() => onView(order.id)}
            onEdit={() => onEdit(order.id)}
            onDelete={() => onDelete(order.id)}
          />
        );
      })}
    </div>
  );
}
