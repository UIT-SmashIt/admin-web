export const ImportStatus = {
  Pending: 'Đang đợi',
  Accepted: 'Xác nhận',
  Cancelled: 'Đã hủy',
} as const;

export type ImportStatus = typeof ImportStatus[keyof typeof ImportStatus];