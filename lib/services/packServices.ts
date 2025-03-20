import axios from 'axios';
import { Pack, PackAddOn, PackItem } from '../types/pack.types';

// Payload interfaces
export interface AddPackPayload {
  name: string;
  description: string;
  price: number;
  image: string;
  items: Omit<PackItem, '_id'>[];
  addOns: Omit<PackAddOn, '_id'>[];
}

export interface UpdatePackPayload {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  items?: Omit<PackItem, '_id'>[];
  addOns?: Omit<PackAddOn, '_id'>[];
}

// Create API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
});

// Error handling wrapper
const handleRequest = async <T>(request: Promise<{ data: T }>): Promise<T> => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'An error occurred while processing your request');
    }
    throw error;
  }
};

// Get all packs
export const getAllPacks = async (): Promise<Pack[]> => {
  return handleRequest(api.get('/api/packs/all'));
};

// Get a specific pack by ID
export const getPackById = async (id: string): Promise<Pack> => {
  return handleRequest(api.get(`/api/packs/${id}`));
};

// Add a new pack
export const addPack = async (pack: AddPackPayload): Promise<Pack> => {
  return handleRequest(api.post('/api/packs/add', pack));
};

// Update a pack
export const updatePack = async (id: string, pack: UpdatePackPayload): Promise<Pack> => {
  return handleRequest(api.put(`/api/packs/${id}`, pack));
};

// Toggle pack active status
export const togglePackStatus = async (id: string, isActive: boolean): Promise<Pack> => {
  return handleRequest(api.put(`/api/packs/${id}/toggle`, { isActive }));
};

// Delete a pack
export const deletePack = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/api/packs/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete pack');
    }
    throw error;
  }
};

// Get popular packs (sorted by popularity)
export const getPopularPacks = async (limit?: number): Promise<Pack[]> => {
  const packs = await getAllPacks();
  const sortedPacks = packs
    .filter(pack => pack.isActive)
    .sort((a, b) => b.popularity - a.popularity);
  
  return limit ? sortedPacks.slice(0, limit) : sortedPacks;
};

// Get active packs
export const getActivePacks = async (): Promise<Pack[]> => {
  const packs = await getAllPacks();
  return packs.filter(pack => pack.isActive);
};