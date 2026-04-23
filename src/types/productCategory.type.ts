export interface IProductCategory {
  productCategoryId: string;
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