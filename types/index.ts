export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
}

export interface CartItem extends Product {
  quantity: number;
}