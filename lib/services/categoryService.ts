import axios from 'axios';
import { Category } from '@/lib/types/menu.types';

export interface AddCategoryPayload {
  name: string;
  image: string;
}

// Call the API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<{ success: boolean; data: Category[] }>('/api/category');
  return response.data.data;
};

// Get a specific category by ID
export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await api.get<{ success: boolean; data: Category }>(`/api/category/${id}`);
  return response.data.data;
};

// Add a category
export const addCategory = async (category: AddCategoryPayload): Promise<Category> => {
  const response = await api.post<{ success: boolean; data: Category }>('/api/category/add', category);
  return response.data.data;
};

// Update a category
export const updateCategory = async (id: string, category: { name?: string; image?: string }): Promise<Category> => {
  const response = await api.put<{ success: boolean; data: Category }>(`/api/category/update/${id}`, category);
  return response.data.data;
};

// Delete a category
export const deleteCategory = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(`/api/category/delete/${id}`);
  return response.data;
};