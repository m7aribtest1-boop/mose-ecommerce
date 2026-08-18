export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  notes?: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export type OrderStatus = Order['status'];
