'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { AddDishPayload } from '@/lib/services/dishService';
import Input from '../ui/input';
import Textarea from '../ui/textarea';
import Button from '../ui/button';
import Switch from '../ui/switch';
import { Category } from '@/lib/types/menu.types';

interface DishFormProps {
  categories: Category[];
  initialData?: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    ingredients: string[];
    options: {
      _id: string;
      title: string;
      choices: {
        _id: string;
        name: string;
        price: number;
      }[];
      required: boolean;
      isMultiple: boolean;
    }[];
    isAvailable: boolean;
  };
  onSubmit: (data: AddDishPayload) => Promise<void>;
  isLoading: boolean;
}

const DishForm: React.FC<DishFormProps> = ({
  categories,
  initialData,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<AddDishPayload>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    image: initialData?.image || '',
    categoryId: initialData?.category || (categories[0]?._id || ''),
    ingredients: initialData?.ingredients || [''],
    options: initialData?.options.map(opt => ({
      title: opt.title,
      choices: opt.choices.map(choice => ({
        name: choice.name,
        price: choice.price
      })),
      required: opt.required,
      isMultiple: opt.isMultiple,
    })) || [],
    isAvailable: initialData?.isAvailable ?? true
  });

  const [newIngredient, setNewIngredient] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !formData.categoryId) {
      setFormData(prev => ({ ...prev, categoryId: categories[0]._id }));
    }
  }, [categories, formData.categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isAvailable: checked }));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { title: '', choices: [{ name: '', price: 0 }], required: false, isMultiple: true }]
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index: number, field: string, value: string | boolean) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      if (field === 'required') {
        newOptions[index].required = value as boolean;
      } else if (field === 'isMultiple') {
        newOptions[index].isMultiple = value as boolean;
      } else {
        newOptions[index].title = value as string;
      }
      return { ...prev, options: newOptions };
    });
  };

  const addChoice = (optionIndex: number) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[optionIndex].choices.push({ name: '', price: 0 });
      return { ...prev, options: newOptions };
    });
  };

  const removeChoice = (optionIndex: number, choiceIndex: number) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[optionIndex].choices = newOptions[optionIndex].choices.filter((_, i) => i !== choiceIndex);
      return { ...prev, options: newOptions };
    });
  };

  const handleChoiceChange = (optionIndex: number, choiceIndex: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      if (field === 'price') {
        newOptions[optionIndex].choices[choiceIndex].price = parseFloat(value as string) || 0;
      } else {
        newOptions[optionIndex].choices[choiceIndex].name = value as string;
      }
      return { ...prev, options: newOptions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty ingredients
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
      options: formData.options.map(opt => ({
        ...opt,
        choices: opt.choices.filter(choice => choice.name.trim() !== '')
      })).filter(opt => opt.title.trim() !== '' && opt.choices.length > 0)
    };
    
    await onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nom du plat"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Burger Classique"
          required
        />
        
        <Input
          label="Prix (€)"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          placeholder="9.99"
          required
        />
      </div>
      
      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Une description détaillée du plat..."
        rows={3}
        required
      />

      <Input
        label="URL de l'image"
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catégorie
        </label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          required
        >
          <option value="" disabled>Sélectionner une catégorie</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingrédients
        </label>
        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center">
              <Input
                value={ingredient}
                onChange={(e) => {
                  const newIngredients = [...formData.ingredients];
                  newIngredients[index] = e.target.value;
                  setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                }}
                placeholder="Ex: Tomate, Laitue, Fromage..."
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="ml-2 p-2 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          <div className="flex mt-2">
            <Input
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Ajouter un ingrédient..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addIngredient}
              className="ml-2"
              variant="secondary"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Options (ex: taille, accompagnements, etc.)
          </label>
          <Button
            type="button"
            onClick={addOption}
            variant="outline"
            size="sm"
          >
            <Plus size={16} className="mr-1" /> Ajouter une option
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.options.map((option, optionIndex) => (
            <div key={optionIndex} className="border rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Option #{optionIndex + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeOption(optionIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <Input
                  label="Titre de l'option"
                  value={option.title}
                  onChange={(e) => handleOptionChange(optionIndex, 'title', e.target.value)}
                  placeholder="Ex: Taille, Cuisson, Sauce..."
                />
                
                <div className="flex items-end">
                  <Switch
                    checked={option.required}
                    onChange={(checked) => handleOptionChange(optionIndex, 'required', checked)}
                    label="Option obligatoire"
                    className="mt-auto"
                  />

                  <Switch
                    checked={option.isMultiple}
                    onChange={(checked) => handleOptionChange(optionIndex, 'isMultiple', checked)}
                    label="Choix multiple"
                    className="mt-auto"
                  />
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choix disponibles
                </label>
                
                <div className="space-y-2">
                  {option.choices.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className="flex items-center gap-2">
                      <Input
                        value={choice.name}
                        onChange={(e) => handleChoiceChange(optionIndex, choiceIndex, 'name', e.target.value)}
                        placeholder="Nom du choix"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={choice.price}
                        onChange={(e) => handleChoiceChange(optionIndex, choiceIndex, 'price', e.target.value)}
                        placeholder="Prix supplémentaire"
                        className="w-32"
                      />
                      <button
                        type="button"
                        onClick={() => removeChoice(optionIndex, choiceIndex)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    onClick={() => addChoice(optionIndex)}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus size={16} className="mr-1" /> Ajouter un choix
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center">
        <Switch
          checked={formData.isAvailable ?? true}
          onChange={handleAvailabilityChange}
          label="Disponible à la vente"
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

export default DishForm;