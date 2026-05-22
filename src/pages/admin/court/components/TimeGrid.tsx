import type { Order } from '../types';
import { TIMES } from '../consts/times';
import { getBookedMap } from '../utils/helpers';
import { SlotCell } from './SlotCell';

export function TimeGrid({
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
