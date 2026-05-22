import type { Order } from '../types';
import { S } from '../utils/styles';
import { getTypeLabel, getStatusLabel } from '../utils/helpers';

export function SlotCell({
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
