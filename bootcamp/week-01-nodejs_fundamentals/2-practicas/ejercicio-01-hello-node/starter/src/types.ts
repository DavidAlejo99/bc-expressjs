export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface Report {
  totalProducts: number;
  totalValue: number;
  categories: string[];
  lowStockItems: Product[];
}