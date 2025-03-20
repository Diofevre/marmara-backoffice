import axios from 'axios';
import { Promotion } from '../types/menu.types';

// Interface for the payload to add a new promotion
export interface AddPromotionPayload {
  discount: number;
  startDate: string;
  endDate: string;
  platIds: string[];
}

// Interface for the payload to update a promotion
export interface UpdatePromotionPayload {
  discount?: number;
  startDate?: string;
  endDate?: string;
  platIds?: string[];
}

// Create API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

// Get all promotions
export const getAllPromotions = async (): Promise<Promotion[]> => {
  const response = await api.get<{ success: boolean; data: Promotion[] }>('/api/promotions');
  return response.data.data;
};

// Add a new promotion
export const addPromotion = async (promotion: AddPromotionPayload): Promise<Promotion> => {
  const response = await api.post<{ success: boolean; data: Promotion }>('/api/promotions/add', promotion);
  return response.data.data;
};

// Get a specific promotion by ID
export const getPromotionById = async (id: string): Promise<Promotion> => {
  const response = await api.get<{ success: boolean; data: Promotion }>(`/api/promotions/${id}`);
  return response.data.data;
};

// Update a promotion
export const updatePromotion = async (id: string, promotion: UpdatePromotionPayload): Promise<Promotion> => {
  const response = await api.put<{ success: boolean; data: Promotion }>(`/api/promotions/${id}`, promotion);
  return response.data.data;
};

// Delete a promotion
export const deletePromotion = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/api/promotions/${id}`);
  return response.data;
};