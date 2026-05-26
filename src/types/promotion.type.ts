export interface IPromotion {
  promotionId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  hidden: boolean;
  details: IPromotionDetail[];
}

export interface IPromotionDetail {
  promotionDetailId: number;
  productId: number;
  minQuantity: number;
}

export interface PromotionAddPayload {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  hidden: boolean;
  details: IPromotionDetail[];
}

export interface PromotionEditPayload {
  promotionId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  hidden: boolean;
  details: IPromotionDetail[];
}
