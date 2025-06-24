export interface ProductType {
  id: string;
  title: string;
  sku: string;
  category: string;
  stock: number;
  dealerPrice: number;
  tradePrice: number;
  retailerPrice: number;
  ctnSize: number;
  isActive?: boolean;
}
