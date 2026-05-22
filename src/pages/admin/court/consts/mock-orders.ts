import type { Order } from '../types';

export const MOCK_ORDERS: Order[] = [
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
