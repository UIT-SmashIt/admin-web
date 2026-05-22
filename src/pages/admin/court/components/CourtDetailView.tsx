import type { Order } from '../types';
import { COURTS, TIMES } from '../consts';
import { getBookedMap } from '../utils/helpers';
import { S } from '../utils/styles';
import { TimeGrid } from './TimeGrid';
import { OrderCard } from './OrderCard';

export function CourtDetailView({
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
