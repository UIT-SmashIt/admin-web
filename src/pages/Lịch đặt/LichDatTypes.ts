// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingType = 'single' | 'community';
export type PaymentStatus = 'unpaid' | 'deposited' | 'paid';
export type BookingTab = 'single' | 'community' | 'all';

export interface ServiceItem {
  id: number;
  name: string;
  unit: string;
  price: number;
  category: string;
}

export interface SelectedService {
  service: ServiceItem;
  qty: number;
}

export interface Booking {
  id: number;
  type: BookingType;
  customerName: string;
  customerCode: string;
  phone: string;
  courtId: number;
  date: string;        // DD/MM/YYYY
  startTime: string;
  endTime: string;
  courtFee: number;
  serviceFee: number;
  deposit: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'cash' | 'qr';
  services: SelectedService[];
  note: string;
  createdAt: string;
  // community-only
  maxPlayers?: number;
  currentPlayers?: number;
  caption?: string;
  level?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const COURTS = [
  { id: 1, name: 'Sân 1' },
  { id: 2, name: 'Sân 2' },
  { id: 3, name: 'Sân 3' },
];

export const TIME_SLOTS = [
  '6:00','6:30','7:00','7:30','8:00','8:30','9:00','9:30',
  '10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00','20:30','21:00',
];

export const BOOKED_SLOTS: Record<number, string[]> = {
  1: ['7:30','8:00','8:30','12:00','12:30','13:00','13:30'],
  2: ['9:30','10:00','10:30','18:00','18:30'],
  3: ['7:00','7:30','19:00','19:30','20:00'],
};

export const PENDING_SLOTS: Record<number, string[]> = {
  1: ['9:00','9:30'],
  2: ['12:00','12:30'],
  3: ['14:00'],
};

export const COURT_PRICE_PER_HOUR = 80000;

export const PLAY_LEVELS = ['Mọi trình độ', 'Mới bắt đầu', 'Trung bình', 'Khá', 'Chuyên nghiệp'];

export const SERVICES_LIST: ServiceItem[] = [
  { id: 1, name: 'Cầu Yonex AS-05',  unit: 'hộp',  price: 220000, category: 'Cầu' },
  { id: 2, name: 'Cầu nhựa RSL',     unit: 'hộp',  price: 85000,  category: 'Cầu' },
  { id: 3, name: 'Vợt Victor JS-12', unit: 'cái',  price: 350000, category: 'Vợt' },
  { id: 4, name: 'Thuê vợt',         unit: 'lần',  price: 30000,  category: 'Vợt' },
  { id: 5, name: 'Nước Pocari',      unit: 'chai', price: 15000,  category: 'Nước' },
  { id: 6, name: 'Nước lọc Aqua',   unit: 'chai', price: 8000,   category: 'Nước' },
  { id: 7, name: 'Red Bull',         unit: 'lon',  price: 12000,  category: 'Nước' },
  { id: 8, name: 'Quấn cán',         unit: 'cuộn', price: 35000,  category: 'Phụ kiện' },
  { id: 9, name: 'Snack Oishi',      unit: 'gói',  price: 5000,   category: 'Snack' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const fmt = (n: number) => n.toLocaleString('vi-VN');

export function calcHours(start: string, end: string): number {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };
  return Math.max(0, (toMin(end) - toMin(start)) / 60);
}

/** Convert YYYY-MM-DD → DD/MM/YYYY */
export function isoToVN(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Convert DD/MM/YYYY → YYYY-MM-DD */
export function vnToISO(vn: string): string {
  if (!vn) return '';
  const [d, m, y] = vn.split('/');
  return `${y}-${m}-${d}`;
}

/** Min ISO date = 3 days from today */
export function minCommunityDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
  unpaid:    { label: 'Chưa thanh toán', color: '#fff',    bg: '#E53E3E' },
  deposited: { label: 'Đã cọc',          color: '#1a1a1a', bg: '#F6C90E' },
  paid:      { label: 'Đã thanh toán',   color: '#fff',    bg: '#38A169' },
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 1, type: 'single', customerName: 'Nguyễn Văn An', customerCode: 'NVA01',
    phone: '0901234567', courtId: 1, date: '16/04/2026',
    startTime: '6:00', endTime: '8:00', courtFee: 160000, serviceFee: 15000,
    deposit: 80000, paymentStatus: 'unpaid',
    services: [{ service: SERVICES_LIST[4], qty: 1 }],
    note: '', createdAt: '16/04/2026',
  },
  {
    id: 2, type: 'community', customerName: 'Trần Thị Bình', customerCode: 'TTB02',
    phone: '0912345678', courtId: 2, date: '20/04/2026',
    startTime: '7:00', endTime: '9:00',
    courtFee: 320000, serviceFee: 0, deposit: 160000,
    paymentStatus: 'deposited', services: [], note: '',
    createdAt: '16/04/2026',
    maxPlayers: 4, currentPlayers: 2, level: 'Trung bình',
    caption: '🏸 Tìm 2 người chơi cầu lông sáng 20/04 tại Sân 2, 7:00–9:00. Trình độ trung bình. Ai quan tâm nhắn tin nhé!',
  },
  {
    id: 3, type: 'single', customerName: 'Lê Dương', customerCode: 'LD03',
    phone: '0923456789', courtId: 3, date: '17/04/2026',
    startTime: '17:00', endTime: '19:00', courtFee: 160000, serviceFee: 220000,
    deposit: 80000, paymentStatus: 'unpaid',
    services: [{ service: SERVICES_LIST[0], qty: 1 }], note: '', createdAt: '16/04/2026',
  },
  {
    id: 4, type: 'community', customerName: 'Phạm Hương', customerCode: 'PH04',
    phone: '0934567890', courtId: 1, date: '22/04/2026',
    startTime: '18:00', endTime: '20:00',
    courtFee: 160000, serviceFee: 30000, deposit: 80000,
    paymentStatus: 'paid', paymentMethod: 'cash',
    services: [{ service: SERVICES_LIST[3], qty: 1 }], note: '',
    createdAt: '16/04/2026',
    maxPlayers: 6, currentPlayers: 6, level: 'Khá',
    caption: '🏸 Đủ người rồi nhé! Sân 1, 22/04, 18:00–20:00. Hẹn gặp trên sân 💪',
  },
  {
    id: 5, type: 'single', customerName: 'Bùi Nam', customerCode: 'BN05',
    phone: '0945678901', courtId: 2, date: '18/04/2026',
    startTime: '8:00', endTime: '10:00', courtFee: 160000, serviceFee: 85000,
    deposit: 80000, paymentStatus: 'deposited',
    services: [{ service: SERVICES_LIST[1], qty: 1 }], note: '', createdAt: '16/04/2026',
  },
];