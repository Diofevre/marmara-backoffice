'use client'

import { AddCategoryPayload } from '@/lib/services/categoryService';
import React, { useState } from 'react';
import Input from '../ui/input';
import Button from '../ui/button';

interface CategoryFormProps {
  initialData?: {
    _id: string;
    name: string;
    image: string;
  };
  onSubmit: (data: AddCategoryPayload) => Promise<void>;
  isLoading: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<AddCategoryPayload>({
    name: initialData?.name || '',
    image: initialData?.image || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom de la catégorie"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Ex: Entrées, Plats principaux, Desserts..."
        required
      />

      <div className="space-y-2">
        <Input
          label="URL de l'image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isLoading} className='bg-[#FE724C] hover:bg-[#FE724C]/80 text-black/80'>
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;