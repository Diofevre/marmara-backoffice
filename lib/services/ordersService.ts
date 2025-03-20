import axios from 'axios';
import { Order, OrderStatus, OrderSearchParams } from '../types/orders.types';

// Create API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
})

export const getOrders = async (status?: OrderStatus): Promise<Order[]> => {
  const response = await api.get<{ success: boolean; orders: Order[] }>(
    `/api/order/filter${status ? `?status=${status}` : ''}`
  );
  return response.data.orders;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  const response = await api.put<{ success: boolean; order: Order }>(
    `/api/order/update-status/${orderId}`,
    { status }
  );
  return response.data.order;
};

export const searchOrders = async (params: OrderSearchParams): Promise<Order[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.reference) queryParams.append('reference', params.reference);
  if (params.name) queryParams.append('name', params.name);
  if (params.date) queryParams.append('date', params.date);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  const response = await api.get<{ success: boolean; orders: Order[] }>(
    `/api/order/search-order?${queryParams.toString()}`
  );
  return response.data.orders;
};