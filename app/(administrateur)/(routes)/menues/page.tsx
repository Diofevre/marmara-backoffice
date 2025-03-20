'use client'

import CategoryForm from '@/components/admin/category-form';
import CategoryItem from '@/components/admin/category-item';
import ConfirmDialog from '@/components/admin/confirm-dialog';
import DishForm from '@/components/admin/dish-form';
import DishItem from '@/components/admin/dish-item';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { addCategory, AddCategoryPayload, deleteCategory, getCategories, updateCategory } from '@/lib/services/categoryService';
import { addDish, AddDishPayload, deleteDish, getDishesByCategory, updateDish, UpdateDishPayload } from '@/lib/services/dishService';
import { Category, Dish } from '@/lib/types/menu.types';
import { MenuIcon, PlusCircle } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const Menues = () => {
  // State for categories and dishes
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [isDeleteDishModalOpen, setIsDeleteDishModalOpen] = useState(false);
  
  // State for editing
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);
  
  // State for loading states
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [isSubmittingDish, setIsSubmittingDish] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
      
      // Select the first category by default if available
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch dishes when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchDishesByCategory(selectedCategory._id);
    } else {
      setDishes([]);
    }
  }, [selectedCategory]);

  // Fetch dishes by category
  const fetchDishesByCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      const data = await getDishesByCategory(categoryId);
      setDishes(data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast.error('Erreur lors du chargement des plats');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  // Open category modal for adding
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  // Open category modal for editing
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  // Open dish modal for adding
  const handleAddDish = () => {
    setEditingDish(null);
    setIsDishModalOpen(true);
  };

  // Open dish modal for editing
  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setIsDishModalOpen(true);
  };

  // Handle category form submission
  const handleCategorySubmit = async (data: AddCategoryPayload) => {
    setIsSubmittingCategory(true);
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory._id, data);
        toast.success('Catégorie mise à jour avec succès');
      } else {
        // Add new category
        await addCategory(data);
        toast.success('Catégorie ajoutée avec succès');
      }
      
      // Refresh categories
      await fetchCategories();
      setIsCategoryModalOpen(false);
    } catch (error) {
      console.error('Error submitting category:', error);
      toast.error('Erreur lors de l\'enregistrement de la catégorie');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  // Handle dish form submission
  const handleDishSubmit = async (data: AddDishPayload) => {
    setIsSubmittingDish(true );
    try {
      if (editingDish) {
        // Update existing dish
        const updateData: UpdateDishPayload = {
          ...data,
          categoryId: data.categoryId
        };
        await updateDish(editingDish._id, updateData);
        toast.success('Plat mis à jour avec succès');
      } else {
        // Add new dish
        await addDish(data);
        toast.success('Plat ajouté avec succès');
      }
      
      // Refresh dishes if we have a selected category
      if (selectedCategory) {
        await fetchDishesByCategory(selectedCategory._id);
      }
      
      setIsDishModalOpen(false);
    } catch (error) {
      console.error('Error submitting dish:', error);
      toast.error('Erreur lors de l\'enregistrement du plat');
    } finally {
      setIsSubmittingDish(false);
    }
  };

  // Open delete category confirmation
  const handleDeleteCategoryClick = (category: Category) => {
    setEditingCategory(category);
    setIsDeleteCategoryModalOpen(true);
  };

  // Open delete dish confirmation
  const handleDeleteDishClick = (dish: Dish) => {
    setDishToDelete(dish);
    setIsDeleteDishModalOpen(true);
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!editingCategory) return;
    
    setIsDeleting(true);
    try {
      await deleteCategory(editingCategory._id);
      toast.success('Catégorie supprimée avec succès');
      
      // Refresh categories
      await fetchCategories();
      
      // If the deleted category was selected, select the first available category
      if (selectedCategory?._id === editingCategory._id) {
        const updatedCategories = await getCategories();
        setSelectedCategory(updatedCategories.length > 0 ? updatedCategories[0] : null);
      }
      
      setIsDeleteCategoryModalOpen(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete dish
  const handleDeleteDish = async () => {
    if (!dishToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDish(dishToDelete._id);
      toast.success('Plat supprimé avec succès');
      
      // Refresh dishes
      if (selectedCategory) {
        await fetchDishesByCategory(selectedCategory._id);
      }
      
      setIsDeleteDishModalOpen(false);
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast.error('Erreur lors de la suppression du plat');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MenuIcon className="h-5 w-5 mr-2 text-gray-500" />
              <h1 className="font-bold text-gray-900 uppercase">Gestion du Menu</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-5xl mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Categories sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <MenuIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Catégories
                </h2>
                <Button
                  onClick={handleAddCategory} 
                  variant="outline" 
                  size="sm"
                >
                  <PlusCircle size={16} className="mr-1" /> Ajouter
                </Button>
              </div>
              
              {isLoading && categories.length === 0 ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-200 rounded w-60"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p>Aucune catégorie disponible</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
                  {categories.map(category => (
                    <CategoryItem
                      key={category._id}
                      category={category}
                      isActive={selectedCategory?._id === category._id}
                      onClick={() => handleCategorySelect(category)}
                      onEdit={() => handleEditCategory(category)}
                      onDelete={() => handleDeleteCategoryClick(category)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Dishes content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedCategory ? `Plats - ${selectedCategory.name}` : 'Plats'}
                </h2>
                {selectedCategory && (
                  <Button 
                    onClick={handleAddDish} 
                    variant="outline" 
                    className="mt-2"
                  >
                    <PlusCircle size={16} className="mr-1" /> 
                    Ajouter un plat
                  </Button>
                )}
              </div>
              
              {!selectedCategory ? (
                <div className="py-12 text-center text-gray-500">
                  <p>Veuillez sélectionner une catégorie pour voir les plats</p>
                </div>
              ) : isLoading ? (
                <div className="py-8">
                  <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="rounded-lg overflow-hidden">
                        <div className="h-40 bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : dishes.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <p>Aucun plat disponible dans cette catégorie</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dishes.map(dish => (
                    <DishItem
                      key={dish._id}
                      dish={dish}
                      onEdit={() => handleEditDish(dish)}
                      onDelete={() => handleDeleteDishClick(dish)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
      >
        <CategoryForm
          initialData={editingCategory || undefined}
          onSubmit={handleCategorySubmit}
          isLoading={isSubmittingCategory}
        />
      </Modal>
      
      {/* Dish Modal */}
      <Modal
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        title={editingDish ? 'Modifier le plat' : 'Ajouter un plat'}
        className="max-w-2xl"
      >
        <DishForm
          categories={categories}
          initialData={editingDish || undefined}
          onSubmit={handleDishSubmit}
          isLoading={isSubmittingDish}
        />
      </Modal>
      
      {/* Delete Category Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteCategoryModalOpen}
        onClose={() => setIsDeleteCategoryModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Supprimer la catégorie"
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${editingCategory?.name}" ? Cette action est irréversible et supprimera également tous les plats associés.`}
        isLoading={isDeleting}
      />
      
      {/* Delete Dish Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDishModalOpen}
        onClose={() => setIsDeleteDishModalOpen(false)}
        onConfirm={handleDeleteDish}
        title="Supprimer le plat"
        message={`Êtes-vous sûr de vouloir supprimer le plat "${dishToDelete?.name}" ? Cette action est irréversible.`}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default Menues;