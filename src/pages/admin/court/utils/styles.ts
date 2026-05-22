import type { OrderType, OrderStatus } from '../types';

export const globalStyles = `
  html, body {
    color-scheme: light;
  }
  * {
    color-scheme: light;
  }
`;

export const S = {
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
