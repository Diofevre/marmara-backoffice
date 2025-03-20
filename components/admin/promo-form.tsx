import React, { useState, useEffect } from 'react';
import { Calendar, Percent, Check, X } from 'lucide-react';
import { Dish } from '@/lib/types/menu.types';
import { addPromotion, AddPromotionPayload } from '@/lib/services/promotionService';
import { getAllDishes } from '@/lib/services/dishService';

interface PromotionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ onSuccess, onCancel }) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [formData, setFormData] = useState<AddPromotionPayload>({
    discount: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    platIds: []
  });

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setLoading(true);
        const dishesData = await getAllDishes();
        setDishes(dishesData);
      } catch (err) {
        setError('Failed to load dishes. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' ? Number(value) : value
    }));
  };

  const toggleDishSelection = (dishId: string) => {
    setFormData(prev => {
      if (prev.platIds.includes(dishId)) {
        return {
          ...prev,
          plats: prev.platIds.filter(id => id !== dishId)
        };
      } else {
        return {
          ...prev,
          plats: [...prev.platIds, dishId]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.platIds.length === 0) {
      setError('Please select at least one dish for the promotion.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      await addPromotion(formData);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to create promotion. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDishes = dishes.filter(dish => 
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create New Promotion</h2>
        <button 
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Percentage
            </label>
            <div className="relative">
              <Percent size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                name="discount"
                min="1"
                max="100"
                required
                value={formData.discount}
                placeholder='DISCOUNT'
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                placeholder='STARTDATE'
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleInputChange}
                placeholder='ENDDATE'
                min={formData.startDate}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Dishes for Promotion
          </label>
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          
          <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
            {filteredDishes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No dishes found matching your search.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredDishes.map(dish => (
                  <div 
                    key={dish._id}
                    className={`p-3 flex items-center cursor-pointer hover:bg-gray-50 ${
                      formData.platIds.includes(dish._id) ? 'bg-green-50' : ''
                    }`}
                    onClick={() => toggleDishSelection(dish._id)}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      formData.platIds.includes(dish._id) 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.platIds.includes(dish._id) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{dish.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{dish.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Selected: {formData.platIds.length} dishes
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Promotion'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm;