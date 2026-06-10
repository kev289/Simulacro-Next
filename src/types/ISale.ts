export interface ISaleProduct {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface ISale {
  userId: string;
  products: ISaleProduct[];
  total: number;
}