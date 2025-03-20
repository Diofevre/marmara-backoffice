/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, Tag, ChevronDown, ChevronUp, Plus, Edit, Trash2 } from 'lucide-react';
import { Dish, Promotion } from '@/lib/types/menu.types';
import { getAllPromotions } from '@/lib/services/promotionService';
import { getAllDishes } from '@/lib/services/dishService';
import { formatCurrency, formatDate } from '@/lib/utils';
import PromotionModal from '@/components/admin/promo-modal';
import { deletePromotion } from '@/lib/services/promotionService';
import { toast } from 'sonner';

const PromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [, setAllDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPromotion, setExpandedPromotion] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'expired'>('all');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [promotionsData, dishesData] = await Promise.all([
          getAllPromotions(),
          getAllDishes()
        ]);
        setPromotions(promotionsData);
        setAllDishes(dishesData);

        console.log(dishesData);
      } catch (err) {
        setError('Failed to load promotions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    if (expandedPromotion === id) {
      setExpandedPromotion(null);
    } else {
      setExpandedPromotion(id);
    }
  };

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (err) {
      setError('Failed to load promotions. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const getPromotionStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'expired';
    return 'active';
  };

  const filteredPromotions = promotions.filter(promotion => {
    if (filter === 'all') return true;

    const status = getPromotionStatus(promotion.startDate, promotion.endDate);
    return status === filter;
  });

  const handleAddPromotion = () => {
    setEditingPromotion(undefined);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPromotion(undefined);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setShowModal(true);
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (!window.confirm("Are you sure you want to delete this promotion?")) {
      return; // User cancelled deletion
    }

    try {
      setLoading(true);
      const result = await deletePromotion(promotionId);

      if (result.success) {
        toast.success('Promotion deleted successfully!'); 
        setPromotions(prevPromotions => prevPromotions.filter(promotion => promotion._id !== promotionId));
        fetchPromotions(); // Refresh promotions list
      } else {
        toast.error(`Failed to delete promotion: ${result.message}`);
        setError(`Failed to delete promotion: ${result.message}`); 
      }
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error('An unexpected error occurred while deleting.');
      setError('An unexpected error occurred while deleting.');
    } finally {
      setLoading(false);
    }
  };

  // Sort promotions: active first, then upcoming, then expired
  const sortedPromotions = [...filteredPromotions].sort((a, b) => {
    const statusA = getPromotionStatus(a.startDate, a.endDate);
    const statusB = getPromotionStatus(b.startDate, b.endDate);

    if (statusA === 'active' && statusB !== 'active') return -1;
    if (statusA !== 'active' && statusB === 'active') return 1;
    if (statusA === 'upcoming' && statusB === 'expired') return -1;
    if (statusA === 'expired' && statusB === 'upcoming') return 1;

    // If same status, sort by start date (newest first)
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  if (loading) {
    return (
      <div className="bg-gray-50 flex h-full items-center justify-center">
        <div className="text-gray-500 animate-pulse text-xl">Loading promotions data ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#FE724C] mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Special Promotions</h1>
            <p className="text-gray-600">
              Discover our special offers and discounts on selected dishes. Don&apos;t miss out on these limited-time promotions!
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-colors ${filter === 'all'
                ? 'bg-[#FE724C] text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All Promotions
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-colors ${filter === 'active'
                ? 'bg-[#FE724C] text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-colors ${filter === 'upcoming'
                ? 'bg-[#FE724C] text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-4 py-2 rounded-[12px] text-sm font-medium transition-colors ${filter === 'expired'
                ? 'bg-[#FE724C] text-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Expired
            </button>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manage Promotions</h1>
            <button
              onClick={handleAddPromotion}
              className="px-4 py-2 bg-[#FE724C] text-black rounded-[12px] hover:bg-[#FE724C]/80 flex items-center text-sm"
            >
              <Plus size={18} className="mr-1" />
              New Promotion
            </button>
          </div>

          {sortedPromotions.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">No promotions found for the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedPromotions.map(promotion => {
                const status = getPromotionStatus(promotion.startDate, promotion.endDate);
                const isExpanded = expandedPromotion === promotion._id;

                return (
                  <div
                    key={promotion._id}
                    className={`border rounded-lg overflow-hidden transition-all duration-300 ${status === 'active'
                      ? 'border-green-200 bg-green-50'
                      : status === 'upcoming'
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                      }`}
                  >
                    <div
                      className="p-4 sm:p-6 cursor-pointer"
                      onClick={() => toggleExpand(promotion._id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <div className={`p-2 rounded-full mr-4 ${status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : status === 'upcoming'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                            }`}>
                            <Tag size={20} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{promotion.discount}% OFF</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Calendar size={14} className="mr-1" />
                              <span>
                                {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium mr-3 ${status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : status === 'upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}>
                            {status === 'active'
                              ? 'Active'
                              : status === 'upcoming'
                                ? 'Upcoming'
                                : 'Expired'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent toggleExpand from being called
                              handleEditPromotion(promotion);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100"
                            aria-label="Edit Promotion"
                          >
                            <Edit size={20} className="text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent toggleExpand from being called
                              handleDeletePromotion(promotion._id);
                            }}
                            className="p-2 rounded-full hover:bg-red-100"
                            aria-label="Delete Promotion"
                          >
                            <Trash2 size={20} className="text-red-500" />
                          </button>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-200">
                        <h4 className="font-medium mb-3">Dishes on Promotion:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {promotion.plats.map(dish => {
                            const discountedPrice = dish.price * (1 - promotion.discount / 100);

                            return (
                              <div key={dish._id} className="bg-white rounded-lg p-3 border border-gray-100">
                                <div className="flex items-start">
                                  <div className="h-16 w-16 rounded overflow-hidden mr-3 flex-shrink-0">
                                    <img
                                      src={dish.image || 'https://www.cobsbread.com/us/wp-content//uploads/2022/09/Pepperoni-pizza-850x630-1.png'}
                                      alt={dish.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-sm">{dish.name}</h5>
                                    <div className="mt-1 flex items-center">
                                      <span className="text-gray-500 line-through text-xs mr-2">
                                        {formatCurrency(dish.price)}
                                      </span>
                                      <span className="text-red-600 font-bold text-sm">
                                        {formatCurrency(discountedPrice)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <PromotionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSuccess={fetchPromotions}
        editPromotion={editingPromotion}
      />
    </div>
  );
};

export default PromotionsPage;