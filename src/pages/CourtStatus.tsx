import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderType = 'daily' | 'fixed';
type OrderStatus = 'unpaid' | 'deposit' | 'paid';

interface Order {
  id: string;
  name: string;
  court: string;
  type: OrderType;
  status: OrderStatus;
  slots: string[];
  phone: string;
  weekdays?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COURTS = ['Sân 1', 'Sân 2', 'Sân 3'];

const TIMES: string[] = [];
for (let h = 6; h < 22; h++) {
  TIMES.push(`${String(h).padStart(2, '0')}:00`);
  TIMES.push(`${String(h).padStart(2, '0')}:30`);
}

const MOCK_ORDERS: Order[] = [
  { id: 'DH001', name: 'Nguyễn Minh Khoa', court: 'Sân 1', type: 'daily', status: 'unpaid', slots: ['07:00', '07:30', '08:00'], phone: '0901234567' },
  { id: 'DH002', name: 'Trần Thị Lan', court: 'Sân 1', type: 'fixed', status: 'deposit', slots: ['17:00', '17:30', '18:00', '18:30'], phone: '0912345678', weekdays: 'T2, T4, T6' },
  { id: 'DH003', name: 'Lê Văn Hùng', court: 'Sân 2', type: 'daily', status: 'paid', slots: ['06:00', '06:30'], phone: '0923456789' },
  { id: 'DH004', name: 'Phạm Thu Hà', court: 'Sân 2', type: 'daily', status: 'unpaid', slots: ['09:00', '09:30', '10:00'], phone: '0934567890' },
  { id: 'DH005', name: 'Đỗ Quang Vinh', court: 'Sân 3', type: 'fixed', status: 'deposit', slots: ['19:00', '19:30', '20:00', '20:30'], phone: '0945678901', weekdays: 'T3, T5, T7' },
  { id: 'DH006', name: 'Vũ Thị Mai', court: 'Sân 1', type: 'daily', status: 'paid', slots: ['12:00', '12:30'], phone: '0956789012' },
  { id: 'DH007', name: 'Hoàng Đức Anh', court: 'Sân 2', type: 'daily', status: 'unpaid', slots: ['14:00', '14:30', '15:00'], phone: '0967890123' },
  { id: 'DH008', name: 'Bùi Thị Ngọc', court: 'Sân 3', type: 'daily', status: 'paid', slots: ['08:00', '08:30'], phone: '0978901234' },
  { id: 'DH009', name: 'Ngô Văn Tài', court: 'Sân 3', type: 'fixed', status: 'deposit', slots: ['10:00', '10:30', '11:00'], phone: '0989012345', weekdays: 'T2, T4, T6, CN' },
  { id: 'DH010', name: 'Đinh Thị Bích', court: 'Sân 1', type: 'daily', status: 'unpaid', slots: ['15:30', '16:00', '16:30'], phone: '0990123456' },
  { id: 'DH011', name: 'Trương Văn Nam', court: 'Sân 2', type: 'daily', status: 'paid', slots: ['19:00', '19:30', '20:00'], phone: '0901234560' },
  { id: 'DH012', name: 'Lý Thị Thu', court: 'Sân 3', type: 'fixed', status: 'deposit', slots: ['20:30', '21:00'], phone: '0912345670', weekdays: 'T2, T5' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function toInputValue(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getBookedMap(court: string, orders: Order[]): Record<string, Order> {
  const map: Record<string, Order> = {};
  orders.filter((o) => o.court === court).forEach((o) => o.slots.forEach((s) => { map[s] = o; }));
  return map;
}

function getTypeLabel(type: OrderType) {
  return type === 'fixed' ? 'Cố định' : 'Đơn ngày';
}

function getStatusLabel(status: OrderStatus) {
  if (status === 'unpaid') return 'Chưa thanh toán';
  if (status === 'deposit') return 'Đã cọc';
  return 'Đã thanh toán';
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const S = {
  card: {
    background: '#fff',
    border: '0.5px solid rgba(0,0,0,0.08)',
    borderRadius: 12,
  } as React.CSSProperties,

  typeChip(type: OrderType): React.CSSProperties {
    return {
      fontSize: 10,
      fontWeight: 500,
      padding: '2px 8px',
      borderRadius: 20,
      background: type === 'fixed' ? '#FAEEDA' : '#E6F1FB',
      color: type === 'fixed' ? '#854F0B' : '#185FA5',
    };
  },

  statusChip(status: OrderStatus): React.CSSProperties {
    const map: Record<OrderStatus, { bg: string; color: string }> = {
      unpaid: { bg: '#FCEBEB', color: '#A32D2D' },
      deposit: { bg: '#FAEEDA', color: '#854F0B' },
      paid: { bg: '#EAF3DE', color: '#3B6D11' },
    };
    return { fontSize: 10, padding: '2px 8px', borderRadius: 20, ...map[status] };
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SlotCell({
  time,
  order,
  selected,
  onClick,
}: {
  time: string;
  order: Order | undefined;
  selected: boolean;
  onClick: () => void;
}) {
  const booked = !!order;
  return (
    <div
      onClick={onClick}
      title={booked ? `${order!.name} (${order!.id})` : `Trống – ${time}`}
      style={{
        flex: 1,
        minWidth: 20,
        height: 28,
        borderRadius: 5,
        cursor: 'pointer',
        background: booked ? '#F7C1C1' : '#EAF3DE',
        border: selected ? '2px solid #378ADD' : '2px solid transparent',
        transition: 'background 0.12s, border-color 0.12s',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.background = booked ? '#F09595' : '#C0DD97';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.background = booked ? '#F7C1C1' : '#EAF3DE';
        }
      }}
    />
  );
}

function TimeGrid({
  court,
  orders,
  selectedSlot,
  onSlotClick,
}: {
  court: string;
  orders: Order[];
  selectedSlot: { court: string; time: string } | null;
  onSlotClick: (court: string, time: string) => void;
}) {
  const bookedMap = getBookedMap(court, orders);
  const tickStep = 4;

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 580, padding: '12px 16px' }}>
        {/* Time ticks header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ width: 64, flexShrink: 0 }} />
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {TIMES.map((t, i) => (
              <div key={t} style={{ flex: 1, minWidth: 20, fontSize: 10, color: '#aaa', textAlign: 'center' }}>
                {i % tickStep === 0 ? t : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Slots row */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 64, flexShrink: 0, fontSize: 11, fontWeight: 500, color: '#1a1a1a' }}>
            {court}
          </div>
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {TIMES.map((t) => (
              <SlotCell
                key={t}
                time={t}
                order={bookedMap[t]}
                selected={selectedSlot?.court === court && selectedSlot?.time === t}
                onClick={() => onSlotClick(court, t)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const timeRange = `${order.slots[0]} – ${order.slots[order.slots.length - 1]}`;
  return (
    <div
      style={{
        padding: '10px 12px',
        borderRadius: 8,
        border: '0.5px solid rgba(0,0,0,0.08)',
        marginBottom: 8,
        cursor: 'pointer',
        transition: 'border-color 0.12s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.18)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.08)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={S.typeChip(order.type)}>{getTypeLabel(order.type)}</span>
          <span style={S.statusChip(order.status)}>{getStatusLabel(order.status)}</span>
        </div>
        {order.status !== 'paid' && (
          <button
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              border: 'none',
              background: '#378ADD',
              color: '#fff',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Hoàn thành
          </button>
        )}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 3 }}>
        {order.name}
      </div>
      <div style={{ fontSize: 11.5, color: '#888', lineHeight: 1.5 }}>
        Mã: {order.id} · {order.court} · {timeRange}
        {order.type === 'fixed' && order.weekdays ? <><br />{order.weekdays}</> : null}
        <br />{order.phone}
      </div>
    </div>
  );
}

// ─── View: All Courts ─────────────────────────────────────────────────────────

function AllCourtsView({
  orders,
  selectedSlot,
  onSlotClick,
}: {
  orders: Order[];
  selectedSlot: { court: string; time: string } | null;
  onSlotClick: (court: string, time: string) => void;
}) {
  const totalBooked = new Set(orders.flatMap((o) => o.slots.map((s) => `${o.court}|${s}`))).size;
  const totalSlots = COURTS.length * TIMES.length;
  const usedPct = Math.round((totalBooked / totalSlots) * 100);
  const unpaidCount = orders.filter((o) => o.status === 'unpaid').length;

  const metrics = [
    { label: 'Tổng lượt đặt hôm nay', value: String(orders.length), sub: '▲ 5 so với hôm qua', subColor: '#3B6D11' },
    { label: 'Khung giờ đã đặt', value: String(totalBooked), sub: `${usedPct}% công suất`, subColor: '#888' },
    { label: 'Đơn chờ thanh toán', value: String(unpaidCount), sub: 'Cần xử lý', subColor: '#A32D2D', valueColor: '#A32D2D' },
  ];

  return (
    <>
      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ ...S.card, padding: '14px 16px' }}>
            <div style={{ fontSize: 11.5, color: '#888', marginBottom: 5 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: m.valueColor ?? '#1a1a1a', lineHeight: 1 }}>
              {m.value}
            </div>
            <div style={{ fontSize: 11, color: m.subColor, marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Court timelines */}
      {COURTS.map((court) => {
        const bookedMap = getBookedMap(court, orders);
        const bookedCount = Object.keys(bookedMap).length;
        const pct = Math.round((bookedCount / TIMES.length) * 100);
        const busy = pct > 50;

        return (
          <div key={court} style={{ ...S.card, marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '13px 16px',
                borderBottom: '0.5px solid rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{ width: 8, height: 8, borderRadius: '50%', background: busy ? '#E24B4A' : '#639922', flexShrink: 0 }}
              />
              <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{court}</div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: busy ? '#FCEBEB' : '#EAF3DE',
                  color: busy ? '#A32D2D' : '#3B6D11',
                }}
              >
                {pct}% đã đặt
              </span>
              <div style={{ marginLeft: 'auto', fontSize: 11.5, color: '#888' }}>
                {bookedCount}/{TIMES.length} khung giờ
              </div>
            </div>
            <TimeGrid court={court} orders={orders} selectedSlot={selectedSlot} onSlotClick={onSlotClick} />
          </div>
        );
      })}
    </>
  );
}

// ─── View: Single Court ───────────────────────────────────────────────────────

function CourtDetailView({
  orders,
  selectedCourt,
  selectedSlot,
  onCourtChange,
  onSlotClick,
}: {
  orders: Order[];
  selectedCourt: string;
  selectedSlot: { court: string; time: string } | null;
  onCourtChange: (court: string) => void;
  onSlotClick: (court: string, time: string) => void;
}) {
  const courtOrders = orders.filter((o) => o.court === selectedCourt);
  const bookedMap = getBookedMap(selectedCourt, orders);
  const selectedOrder =
    selectedSlot?.court === selectedCourt ? bookedMap[selectedSlot.time] : undefined;
  const isSlotSelected = selectedSlot?.court === selectedCourt;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, alignItems: 'start' }}>
      {/* Left: court selector + timeline */}
      <div>
        {/* Court selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          {COURTS.map((c) => {
            const bk = getBookedMap(c, orders);
            const pct = Math.round((Object.keys(bk).length / TIMES.length) * 100);
            const active = c === selectedCourt;
            return (
              <div
                key={c}
                onClick={() => onCourtChange(c)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: `0.5px solid ${active ? '#378ADD' : 'rgba(0,0,0,0.08)'}`,
                  background: active ? '#E6F1FB' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 500, color: active ? '#185FA5' : '#1a1a1a' }}>{c}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>{pct}% đã đặt</div>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div style={S.card}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '13px 16px',
              borderBottom: '0.5px solid rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#378ADD', flexShrink: 0 }} />
            <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a' }}>{selectedCourt}</div>
            <div style={{ fontSize: 11.5, color: '#888', marginLeft: 4 }}>
              Nhấn vào ô để xem chi tiết
            </div>
          </div>
          <TimeGrid
            court={selectedCourt}
            orders={orders}
            selectedSlot={selectedSlot}
            onSlotClick={onSlotClick}
          />
        </div>
      </div>

      {/* Right: orders list */}
      <div style={{ ...S.card, padding: 16, maxHeight: 560, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Lịch đặt {selectedCourt}</div>
          <span
            style={{
              fontSize: 11,
              background: '#E6F1FB',
              color: '#185FA5',
              padding: '2px 8px',
              borderRadius: 20,
              fontWeight: 500,
            }}
          >
            {courtOrders.length} đơn
          </span>
        </div>

        {/* Slot highlight banner */}
        {isSlotSelected && selectedSlot && (
          <div
            style={{
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 12,
              background: selectedOrder ? '#E6F1FB' : '#EAF3DE',
              border: `0.5px solid ${selectedOrder ? '#B5D4F4' : '#C0DD97'}`,
            }}
          >
            {selectedOrder ? (
              <>
                <div style={{ fontSize: 11, color: '#185FA5', fontWeight: 500, marginBottom: 3 }}>
                  Khung giờ được chọn: {selectedSlot.time}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{selectedOrder.name}</div>
                <div style={{ fontSize: 11.5, color: '#888', marginTop: 2 }}>
                  Mã: {selectedOrder.id} · {selectedOrder.phone}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 11, color: '#3B6D11', fontWeight: 500 }}>
                  Khung giờ {selectedSlot.time} — Trống
                </div>
                <div style={{ fontSize: 12, color: '#3B6D11', marginTop: 2 }}>
                  Có thể đặt sân cho khung giờ này
                </div>
              </>
            )}
          </div>
        )}

        {courtOrders.length === 0 ? (
          <div
            style={{
              background: '#f7f7f5',
              borderRadius: 8,
              padding: '12px',
              fontSize: 12,
              color: '#888',
              textAlign: 'center',
              border: '0.5px solid rgba(0,0,0,0.06)',
            }}
          >
            Chưa có lịch đặt cho sân này
          </div>
        ) : (
          courtOrders.map((o) => <OrderCard key={o.id} order={o} />)
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CourtStatus() {
  const [view, setView] = useState<'all' | 'court'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(toInputValue(new Date()));
  const [selectedCourt, setSelectedCourt] = useState<string>(COURTS[0]);
  const [selectedSlot, setSelectedSlot] = useState<{ court: string; time: string } | null>(null);

  // In production, replace MOCK_ORDERS with a fetch/query filtered by selectedDate
  const orders = MOCK_ORDERS;

  const handleSlotClick = (court: string, time: string) => {
    setSelectedSlot((prev) =>
      prev?.court === court && prev?.time === time ? null : { court, time }
    );
    if (view === 'court') setSelectedCourt(court);
  };

  const handleCourtChange = (court: string) => {
    setSelectedCourt(court);
    setSelectedSlot(null);
  };

  const displayDate = formatDate(new Date(selectedDate + 'T00:00:00'));

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 0',
        fontFamily: "'Be Vietnam Pro', sans-serif",
        background: '#f7f7f5',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          paddingLeft: 24,
          paddingRight: 24,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>Trạng thái sân</div>
          <div style={{ fontSize: 12.5, color: '#888', marginTop: 2 }}>Lịch đặt sân theo ngày</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '0.5px solid rgba(0,0,0,0.12)',
              background: '#fff',
              color: '#1a1a1a',
              fontSize: 12.5,
              fontFamily: 'inherit',
            }}
          />
          <div
            style={{
              fontSize: 12,
              color: '#888',
              background: '#fff',
              padding: '6px 12px',
              borderRadius: 8,
              border: '0.5px solid rgba(0,0,0,0.08)',
            }}
          >
            {displayDate}
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingLeft: 24,
          paddingRight: 24,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* View toggle */}
        <div
          style={{
            display: 'flex',
            border: '0.5px solid rgba(0,0,0,0.12)',
            borderRadius: 8,
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {(['all', 'court'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '6px 16px',
                fontSize: 12.5,
                background: view === v ? '#378ADD' : 'transparent',
                color: view === v ? '#fff' : '#888',
                fontWeight: view === v ? 500 : 400,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {v === 'all' ? 'Tất cả sân' : 'Theo sân'}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginLeft: 'auto' }}>
          {[
            { color: '#C0DD97', label: 'Trống' },
            { color: '#F7C1C1', label: 'Đã đặt' },
          ].map(({ color, label }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ paddingLeft: 24, paddingRight: 24 }}>
        {view === 'all' ? (
          <AllCourtsView orders={orders} selectedSlot={selectedSlot} onSlotClick={handleSlotClick} />
        ) : (
          <CourtDetailView
            orders={orders}
            selectedCourt={selectedCourt}
            selectedSlot={selectedSlot}
            onCourtChange={handleCourtChange}
            onSlotClick={handleSlotClick}
          />
        )}
      </div>
    </div>
  );
}