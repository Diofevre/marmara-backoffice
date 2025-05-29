export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentStatus = 'Paid' | 'Not paid' | 'failed';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface OrderItem {
  type?: 'pack' | 'plat';
  packId?: {
    name: string;
    price: number;
    image: string;
  };
  platId?: {
    name: string;
    price: number;
    image: string;
  };
  productId?: string;
  quantity: number;
  price?: number;
  ingredientSelected?: string[];
  addOnsSelected?: {
    name: string;
    price: number;
    _id: string;
  }[];
  selectedOptions?: {
    title: string;
    choices: {
      name: string;
      price: number;
      _id: string;
    }[];
    _id: string;
  }[];
  totalPrice?: number;
  _id?: string;
  finalPrice?: number;
}

export interface Order {
  _id: string;
  userId: User | null;
  items: OrderItem[];
  amount: number;
  address: string;
  deliveryMethod: DeliveryMethod;
  status: OrderStatus;
  date: string;
  payment: PaymentStatus;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSearchParams {
  reference?: string;
  name?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}