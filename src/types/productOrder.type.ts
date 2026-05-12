export interface ProductOrderInvoiceCreatePayload {
  courtOrderId: number;
  givenAmount: number;
  details: IProductOrderDetail[];
}

export interface IProductOrderDetail {
  productOrderDetailId: number;
  quantity: number;
}

export interface IProductOrderInvoiceCalculationResult {
  totalAmount: number;
  changeAmount: number;
}

export interface IProductOrderHistory {
  orderDate: string;
  customerName: string;
  details: IProductOrderHistoryDetail[];
}

export interface IProductOrderHistoryDetail {
  productDetailId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}