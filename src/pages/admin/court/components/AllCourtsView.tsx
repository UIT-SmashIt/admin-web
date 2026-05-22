import type { Order } from '../types';
import { COURTS, TIMES } from '../consts';
import { getBookedMap } from '../utils/helpers';
import { S } from '../utils/styles';
import { TimeGrid } from './TimeGrid';

export function AllCourtsView({
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
