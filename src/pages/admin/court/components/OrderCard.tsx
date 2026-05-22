import type { Order } from '../types';
import { S } from '../utils/styles';
import { getTypeLabel, getStatusLabel } from '../utils/helpers';

export function OrderCard({ order }: { order: Order }) {
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
