export interface IProductCategory {
  productCategoryId: number;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
}

export interface ProductCategoryReq {
  name: string;
  description?: string;
  backgroundColor: string;
  textColor: string;
}