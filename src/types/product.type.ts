import type {SaleType} from "../const/saleType.const.ts";
import type {ProductStatus} from "../const/productStatus.const.ts";
import type {ImportStatus} from "../const/importStatus.const.ts";

export interface IProduct {
  productId: number;
  productName: string;
  capacity: string;
  categoryId: number;
  categoryName: string;
  details: IProductDetail[];
}

export interface IProductDetail {
  productDetailId: number;
  barcode?: string;
  unit: string;
  unitPrice: number;
  saleType: SaleType;
  quantity: number;
  minQuantity?: number;
  status?: ProductStatus;
}

export interface IProductImport {
  importId: number;
  quantity: number;
  note: string;
  status: ImportStatus;
  updatedAt: string;
  productDetailId: number;
  productName: string;
}

export interface ProductAddPayload {
  productName: string;
  capacity: string;
  categoryId: number;
  details: IProductDetail[];
}

export interface ProductEditPayload {
  productId: number;
  productName: string;
  capacity: string;
  categoryId: number;
  details: IProductDetail[];
}

export interface ProductEditQuantityPayload {
  productDetailId: number;
  quantity: number;
}

export interface ProductImportAddPayload {
  quantity: number;
  note: string;
  productDetailId: number;
}

/*
export interface ProductReq {
  productName: string;
  capacity: string;
  categoryId: number;
  detailReqs: ProductDetailReq[];
}

export interface ProductDetailReq {
  barcode?: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  minQuantity?: number;
  saleType: SaleType;
}*/
