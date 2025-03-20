/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Category } from '../../lib/types/menu.types';
import { cn } from '../../lib/utils';

interface CategoryItemProps {
  category: Category;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isActive,
  onClick,
  onEdit,
  onDelete
}) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors",
        isActive ? "bg-[#FE724C]/5 border-l-4 border-[#FE724C]" : "hover:bg-[#FE724C]/5 hover:border-l-4 hover:border-[#FE724C]"
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={category.image || 'https://via.placeholder.com/40?text=Menu'} 
            alt={category.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Menu';
            }}
          />
        </div>
        <div>
          <h3 className="font-medium">{category.name}</h3>
          <p className="text-sm text-gray-500">
            {category.plats?.length || 0} plat{(category.plats?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
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
  );
};

export default CategoryItem;