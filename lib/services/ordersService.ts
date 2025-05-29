'use client'

import useSWR from 'swr';
import axios from 'axios';
import { Order, OrderStatus, OrderSearchParams, PaymentStatus } from '../types/orders.types';

// Créer une instance Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

// Fetcher pour SWR
const fetcher = (url: string) => api.get(url).then((res) => res.data.orders);

// Hook pour récupérer les commandes
export const useOrders = (status?: OrderStatus) => {
  const url = `/api/order/filter${status ? `?status=${status}` : ''}`;
  const { data, error, isLoading, mutate } = useSWR<Order[], Error>(url, fetcher);

  return {
    orders: data,
    isLoading,
    isError: error,
    mutate,
  };
};

// Hook pour mettre à jour le statut d'une commande
export const useUpdatePaymentStatus = () => {
  const update = async (orderId: string, status: PaymentStatus): Promise<Order> => {
    const response = await api.put<{ success: boolean; order: Order }>(
      `/api/order/payment-status/${orderId}`,
      { paymentStatus: status }
    );
    return response.data.order;
  };

  return { updateOrder: update };
};

// Hook pour mettre à jour le statut d'une commande
export const useUpdateOrderStatus = () => {
  const update = async (orderId: string, status: OrderStatus): Promise<Order> => {
    const response = await api.put<{ success: boolean; order: Order }>(
      `/api/order/update-status/${orderId}`,
      { status }
    );
    return response.data.order;
  };

  return { updateOrderStatus: update };
};


// Hook pour rechercher des commandes
export const useSearchOrders = (params: OrderSearchParams) => {
  const queryParams = new URLSearchParams();

  if (params.reference) queryParams.append('reference', params.reference);
  if (params.name) queryParams.append('name', params.name);
  if (params.date) queryParams.append('date', params.date);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  const url = `/api/order/search-order?${queryParams.toString()}`;
  const { data, error, isLoading, mutate } = useSWR<Order[], Error>(url, fetcher);

  return {
    orders: data,
    isLoading,
    isError: error,
    mutate,
  };
};
