/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Dish } from '../../lib/types/menu.types';
import { formatPrice } from '../../lib/utils';

interface DishItemProps {
  dish: Dish;
  onEdit: () => void;
  onDelete: () => void;
}

const DishItem: React.FC<DishItemProps> = ({ dish, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="h-40 overflow-hidden">
        <img 
          src={dish.image || 'https://via.placeholder.com/400x300?text=Plat'} 
          alt={dish.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Plat';
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{dish.name}</h3>
          <span className="font-semibold text-lg">{formatPrice(dish.price)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{dish.description}</p>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {dish.ingredients.slice(0, 3).map((ingredient, index) => (
            <span 
              key={index} 
              className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700"
            >
              {ingredient}
            </span>
          ))}
          {dish.ingredients.length > 3 && (
            <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700">
              +{dish.ingredients.length - 3}
            </span>
          )}
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${dish.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {dish.isAvailable ? 'Disponible' : 'Indisponible'}
          </span>
          
          <div className="flex space-x-1">
            <button 
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishItem;