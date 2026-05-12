import type { OrderHistory } from './types';

export const HISTORY: OrderHistory[] = [
  {
    id: 1,
    time: '08:32',
    items: [{ maSP: '123', name: 'Coca', qty: 2, unit: 'Chai', price: 15000 }],
    total: 30000,
  },
  {
    id: 2,
    time: '09:14',
    items: [{ maSP: '456', name: 'Vợt', qty: 2, unit: 'Cái', price: 25000 }],
    total: 50000,
  },
  {
    id: 3,
    time: '10:05',
    items: [{ maSP: '789', name: 'Cầu', qty: 2, unit: 'Trái', price: 20000 }],
    total: 40000,
  },
];

export const DENOMINATIONS = [1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const fmt = (n: number) => n.toLocaleString('vi-VN');

export const fmtShort = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
};
