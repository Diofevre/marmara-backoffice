import axios from 'axios';
import { Dish } from '../types/menu.types';

// Interface for the payload to add a new dish
export interface AddDishPayload {
  name: string;
  ingredients: string[];
  description: string;
  price: number;
  image: string;
  categoryId: string;
  options: {
    title: string;
    choices: {
      name: string;
      price: number;
    }[];
    required: boolean;
    isMultiple: boolean;
  }[];
  isAvailable?: boolean;
}

// Interface for the payload to update a dish
export interface UpdateDishPayload {
  name?: string;
  ingredients?: string[];
  description?: string;
  price?: number;
  image?: string;
  categoryId?: string;
  options?: {
    title: string;
    choices: {
      name: string;
      price: number;
    }[];
    required: boolean;
    isMultiple: boolean;
  }[];
  isAvailable?: boolean;
}

// Create API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

// Get all dishes
export const getAllDishes = async (): Promise<Dish[]> => {
  const response = await api.get<{ success: boolean; data: Dish[] }>('/api/plats');
  return response.data.data;
};

// Get a specific dish by ID
export const getDishById = async (id: string): Promise<Dish> => {
  const response = await api.get<{ success: boolean; data: Dish }>(`/api/plats/${id}`);
  return response.data.data;
};

// Add a new dish
export const addDish = async (dish: AddDishPayload): Promise<Dish> => {
  const response = await api.post<{ success: boolean; data: Dish }>('/api/plats/add', dish);
  return response.data.data;
};

// Update a dish
export const updateDish = async (id: string, dish: UpdateDishPayload): Promise<Dish> => {
  const response = await api.put<{ success: boolean; data: Dish }>(`/api/plats/update/${id}`, dish);
  return response.data.data;
};

// Delete a dish
export const deleteDish = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/api/plats/delete/${id}`);
  return response.data;
};

// Get dishes by category
export const getDishesByCategory = async (categoryId: string): Promise<Dish[]> => {
  const response = await api.get<{ success: boolean; data: Dish[] }>(`/api/plats/category/${categoryId}`);
  return response.data.data;
};