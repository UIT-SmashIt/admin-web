import { useState, useMemo } from 'react';
import {
  type Booking, type BookingTab, type PaymentStatus,
  INITIAL_BOOKINGS, PAYMENT_STATUS_CONFIG, COURTS, WEEKDAYS, fmt,
} from './LichDatTypes';

// ─── Sub-components ───────────────────────────────────────────────────────────

function PaymentBadge({ status, small }: { status: PaymentStatus; small?: boolean }) {
  const cfg = PAYMENT_STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-block',
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius: 4,
      background: cfg.bg, color: cfg.color,
      fontSize: small ? 10 : 11, fontWeight: 700,
      letterSpacing: '0.02em',
    }}>{cfg.label}</span>
  );
}

function BookingCard({
  booking,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  booking: Booking;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (s: PaymentStatus) => void;
}) {
  const court = COURTS.find(c => c.id === booking.courtId);
  const total = booking.courtFee + booking.serviceFee;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '0.5px solid rgba(0,0,0,0.08)',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.15s',
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
      {/* Color bar header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 10px',
        background: PAYMENT_STATUS_CONFIG[booking.paymentStatus].bg,
      }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {booking.type === 'fixed' && (
            <span style={{
              fontSize: 9, fontWeight: 700, background: '#378ADD', color: '#fff',
              padding: '1px 5px', borderRadius: 3, letterSpacing: '0.04em',
            }}>CỐ ĐỊNH</span>
          )}
          {booking.type === 'single' && (
            <span style={{
              fontSize: 9, fontWeight: 700, background: '#7B1FA2', color: '#fff',
              padding: '1px 5px', borderRadius: 3, letterSpacing: '0.04em',
            }}>ĐƠN NGÀY</span>
          )}
          <PaymentBadge status={booking.paymentStatus} small />
        </div>
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={onEdit} style={{
            width: 22, height: 22, borderRadius: 5, border: '1px solid rgba(0,0,0,0.12)',
            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: '#666', transition: 'all 0.12s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF3E0'; (e.currentTarget as HTMLButtonElement).style.color = '#D4840A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#666'; }}
          >✏️</button>
          <button onClick={onDelete} style={{
            width: 22, height: 22, borderRadius: 5, border: '1px solid rgba(0,0,0,0.12)',
            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: '#bbb', transition: 'all 0.12s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF5F5'; (e.currentTarget as HTMLButtonElement).style.color = '#A32D2D'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.color = '#bbb'; }}
          >🗑️</button>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{booking.customerName}</div>
          <button
            onClick={e => { e.stopPropagation(); onStatusChange(booking.paymentStatus === 'paid' ? 'unpaid' : booking.paymentStatus === 'unpaid' ? 'deposited' : 'paid'); }}
            style={{
              padding: '4px 8px', borderRadius: 6, border: 'none',
              background: '#22863a', color: '#fff', fontWeight: 600, fontSize: 10.5,
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
          >Hoàn thành</button>
        </div>

        <div style={{ fontSize: 11.5, color: '#888', lineHeight: 1.6 }}>
          <div>Mã đơn: <span style={{ color: '#555', fontWeight: 500 }}>{booking.customerCode}</span></div>
          <div>
            Chi tiết: {court?.name} · {booking.startTime}–{booking.endTime}
          </div>
          {booking.type === 'fixed' && booking.weekDays && (
            <div style={{ fontSize: 10.5, color: '#378ADD' }}>
              {booking.weekDays.map(d => WEEKDAYS[d]).join(', ')}
            </div>
          )}
          <div>{booking.date}</div>
          <div style={{ marginTop: 4, fontWeight: 600, color: '#D4840A' }}>
            {fmt(total)}đ
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Booking Type Selector Popup ──────────────────────────────────────────────

function BookingTypePopup({
  onSelectFixed,
  onSelectSingle,
  onClose,
}: {
  onSelectFixed: () => void;
  onSelectSingle: () => void;
  onClose: () => void;
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 20, width: 380, padding: '28px 28px 24px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>📅</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>Chọn loại đặt lịch</div>
          <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 4 }}>Bạn muốn đặt theo hình thức nào?</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={onSelectFixed} style={{
            padding: '16px 20px', borderRadius: 14,
            border: '2px solid #378ADD', background: '#EFF6FF',
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DBEAFE'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1D4ED8', marginBottom: 4 }}>
              📋 Đặt lịch cố định
            </div>
            <div style={{ fontSize: 12.5, color: '#3B82F6' }}>
              Lặp lại hàng tuần theo các ngày cố định
            </div>
          </button>

          <button onClick={onSelectSingle} style={{
            padding: '16px 20px', borderRadius: 14,
            border: '2px solid #D4840A', background: '#FFF7ED',
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF3C7'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF7ED'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: '#D4840A', marginBottom: 4 }}>
              ⚡ Đặt lịch linh hoạt
            </div>
            <div style={{ fontSize: 12.5, color: '#F59E0B' }}>
              Chọn ngày, giờ và sân theo từng lần
            </div>
          </button>
        </div>

        <button onClick={onClose} style={{
          width: '100%', marginTop: 16, padding: '11px', borderRadius: 10,
          border: '1.5px solid #e0e0e0', background: '#fff',
          color: '#888', fontWeight: 500, fontSize: 13.5,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>Hủy</button>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ booking, onClose, onStatusChange }: {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: number, s: PaymentStatus) => void;
}) {
  const court = COURTS.find(c => c.id === booking.courtId);
  const total = booking.courtFee + booking.serviceFee;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 18, width: 460, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.18)', fontFamily: "'Be Vietnam Pro', sans-serif" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '0.5px solid #f0f0ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{booking.customerName}</div>
            <div style={{ marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
              <PaymentBadge status={booking.paymentStatus} />
              <span style={{ fontSize: 11, color: '#aaa' }}>{booking.type === 'fixed' ? '📋 Cố định' : '⚡ Linh hoạt'}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#f5f5f3', cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Mã đơn', value: booking.customerCode },
              { label: 'Điện thoại', value: booking.phone },
              { label: 'Sân', value: court?.name },
              { label: 'Ngày', value: booking.date },
              { label: 'Giờ', value: `${booking.startTime} – ${booking.endTime}` },
              ...(booking.weekDays ? [{ label: 'Ngày trong tuần', value: booking.weekDays.map(d => WEEKDAYS[d]).join(', ') }] : []),
            ].map(f => (
              <div key={f.label} style={{ padding: '10px 12px', borderRadius: 9, background: '#fafafa', border: '1px solid #f0f0ee' }}>
                <div style={{ fontSize: 10.5, color: '#aaa', marginBottom: 3, fontWeight: 500 }}>{f.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{f.value}</div>
              </div>
            ))}
          </div>

          {booking.services.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, color: '#aaa', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Dịch vụ</div>
              {booking.services.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', borderRadius: 7, background: '#fafafa', marginBottom: 4, fontSize: 13 }}>
                  <span style={{ color: '#555' }}>{s.service.name} × {s.qty}</span>
                  <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{fmt(s.service.price * s.qty)}đ</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: 'linear-gradient(135deg,#FFF7ED,#FFF3E0)', borderRadius: 12, padding: '14px 16px', marginBottom: 16, border: '1px solid #FDE68A' }}>
            {[
              { label: 'Tiền sân', value: fmt(booking.courtFee) + 'đ' },
              { label: 'Dịch vụ', value: fmt(booking.serviceFee) + 'đ' },
              { label: 'Đã cọc', value: fmt(booking.deposit) + 'đ' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: '#666' }}>
                <span>{r.label}</span><span style={{ fontWeight: 600, color: '#1a1a1a' }}>{r.value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed #FDE68A', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: '#D4840A' }}>
              <span>Tổng cộng</span><span>{fmt(total)}đ</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {(['unpaid','deposited','paid'] as PaymentStatus[]).map(s => {
              const cfg = PAYMENT_STATUS_CONFIG[s];
              const active = booking.paymentStatus === s;
              return (
                <button key={s} onClick={() => { onStatusChange(booking.id, s); onClose(); }} style={{
                  flex: 1, padding: '9px', borderRadius: 9, border: `1.5px solid ${active ? cfg.bg : '#e0e0e0'}`,
                  background: active ? cfg.bg : '#fafafa', color: active ? cfg.color : '#666',
                  fontWeight: active ? 700 : 400, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.12s',
                }}>{cfg.label}</button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface LichDatProps {
  onNavigateFixed: (booking?: Booking) => void;
  onNavigateSingle: (booking?: Booking) => void;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export default function LichDat({ onNavigateFixed, onNavigateSingle, bookings, setBookings }: LichDatProps) {
  const [tab, setTab] = useState<BookingTab>('all');
  const [showTypePopup, setShowTypePopup] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchTab = tab === 'all' || (tab === 'single' && b.type === 'single') || (tab === 'fixed' && b.type === 'fixed');
      return matchTab;
    });
  }, [bookings, tab]);

  const handleStatusChange = (id: number, status: PaymentStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paymentStatus: status } : b));
  };

  const handleDelete = (id: number) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const TAB_LABELS: { key: BookingTab; label: string }[] = [
    { key: 'single', label: 'Đơn ngày' },
    { key: 'fixed',  label: 'Đơn cố định' },
    { key: 'all',    label: 'Tất cả' },
  ];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', fontFamily: "'Be Vietnam Pro', sans-serif", background: '#f7f7f5' }}>
      {showTypePopup && (
        <BookingTypePopup
          onSelectFixed={() => { setShowTypePopup(false); onNavigateFixed(); }}
          onSelectSingle={() => { setShowTypePopup(false); onNavigateSingle(); }}
          onClose={() => setShowTypePopup(false)}
        />
      )}
      {detailBooking && (
        <DetailModal
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
          onStatusChange={(id, s) => { handleStatusChange(id, s); setDetailBooking(null); }}
        />
      )}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDeleteTarget(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 340, padding: '24px', textAlign: 'center', fontFamily: "'Be Vietnam Pro', sans-serif", boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🗑️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Xóa đơn đặt lịch?</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Đơn của <strong>{deleteTarget.customerName}</strong> sẽ bị xóa vĩnh viễn.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { handleDelete(deleteTarget.id); setDeleteTarget(null); }} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: '#A32D2D', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Xóa</button>
              <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', color: '#555', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Lịch đặt</div>
          <div style={{ fontSize: 12.5, color: '#aaa', marginTop: 2 }}>{filtered.length} đơn · {bookings.filter(b => b.paymentStatus === 'unpaid').length} chưa thanh toán</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 10px', fontSize: 12.5, fontFamily: 'inherit', outline: 'none', color: '#555' }} />
          <button onClick={() => setShowTypePopup(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', borderRadius: 10, border: 'none',
            background: '#D4840A', color: '#fff', fontWeight: 700, fontSize: 13.5,
            cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(212,132,10,0.3)',
            transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
          >
            + Đặt lịch
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        {Object.entries(PAYMENT_STATUS_CONFIG).map(([k, cfg]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#666' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: cfg.bg, border: '0.5px solid rgba(0,0,0,0.1)' }} />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: '#fff', borderRadius: 10, padding: 4, border: '0.5px solid rgba(0,0,0,0.08)', width: 'fit-content' }}>
        {TAB_LABELS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none',
            background: tab === t.key ? '#D4840A' : 'transparent',
            color: tab === t.key ? '#fff' : '#666',
            fontWeight: tab === t.key ? 700 : 400,
            fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#bbb', background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
          <div style={{ fontSize: 14 }}>Không có đơn đặt lịch nào</div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
        }}>
          {filtered.map(b => (
            <BookingCard
              key={b.id}
              booking={b}
              onView={() => setDetailBooking(b)}
              onEdit={() => b.type === 'fixed' ? onNavigateFixed(b) : onNavigateSingle(b)}
              onDelete={() => setDeleteTarget(b)}
              onStatusChange={s => handleStatusChange(b.id, s)}
            />
          ))}
        </div>
      )}
    </div>
  );
}