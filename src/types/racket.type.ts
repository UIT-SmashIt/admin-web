export type RacketStatus = 'Đã đặt' | 'Đang sử dụng' | 'Hoàn tất';

export interface RacketRental {
  rentalId: number;
  orderId: string;
  courtName: string;
  rentalTime: string; // ISO datetime
  returnTime: string; // ISO datetime
  status: RacketStatus;
  racketName: string;
  quantity: number;
  notes?: string;
}

export interface RacketRentalPayload {
  orderId: string;
  courtName: string;
  rentalTime: string;
  returnTime: string;
  status: RacketStatus;
  racketName: string;
  quantity: number;
  notes?: string;
}
