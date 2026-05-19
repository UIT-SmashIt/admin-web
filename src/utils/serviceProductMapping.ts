import type { IProduct, IProductDetail } from '../types/product.type';
import type { ServiceItem } from '../pages/Lịch đặt/LichDatTypes';

/**
 * Convert a product detail to a service item for booking
 */
export function productDetailToService(product: IProduct, detail: IProductDetail): ServiceItem {
  return {
    id: detail.productDetailId,
    name: product.productName,
    unit: detail.unit,
    price: detail.unitPrice,
    category: product.categoryName,
  };
}

/**
 * Convert multiple products to service items
 */
export function productsToServices(products: IProduct[]): ServiceItem[] {
  const services: ServiceItem[] = [];
  products.forEach(product => {
    product.details.forEach(detail => {
      services.push(productDetailToService(product, detail));
    });
  });
  return services;
}

/**
 * Find a service by ID from products
 */
export function findServiceInProducts(products: IProduct[], serviceId: number): ServiceItem | null {
  for (const product of products) {
    for (const detail of product.details) {
      if (detail.productDetailId === serviceId) {
        return productDetailToService(product, detail);
      }
    }
  }
  return null;
}

/**
 * Group services by category
 */
export function groupServicesByCategory(services: ServiceItem[]): Record<string, ServiceItem[]> {
  const grouped: Record<string, ServiceItem[]> = {};
  services.forEach(service => {
    if (!grouped[service.category]) {
      grouped[service.category] = [];
    }
    grouped[service.category].push(service);
  });
  return grouped;
}
