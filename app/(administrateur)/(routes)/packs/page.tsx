/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Power, 
  X,
  ChevronUp,
  ChevronDown,
  Search,
  Filter
} from 'lucide-react';
import { 
  getAllPacks, 
  addPack, 
  updatePack, 
  deletePack, 
  togglePackStatus,
  type AddPackPayload,
  type UpdatePackPayload 
} from '@/lib/services/packServices';
import { Pack } from '@/lib/types/pack.types';
import { Input } from '@/components/ui/inputs';
import Textarea from '@/components/ui/textarea';
import { toast } from 'sonner';

const Packs = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showInactiveOnly, setShowInactiveOnly] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AddPackPayload>({
    name: '',
    description: '',
    price: 0,
    image: '',
    items: [{ name: '', quantity: 1 }],
    addOns: []
  });

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const data = await getAllPacks();
      setPacks(data);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch packs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPack = async () => {
    try {
      setFormLoading(true);
      await addPack(formData);
      await fetchPacks();
      setIsModalOpen(false);
      resetForm();
      toast.success('Pack added successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to add pack');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdatePack = async () => {
    if (!editingPack) return;
    try {
      setFormLoading(true);
      const updatePayload: UpdatePackPayload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image: formData.image,
        items: formData.items,
        addOns: formData.addOns
      };
      await updatePack(editingPack._id, updatePayload);
      await fetchPacks();
      setIsModalOpen(false);
      setEditingPack(null);
      resetForm();
      toast.success('Pack updated successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update pack');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePack = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this pack?')) return;
    try {
      setLoading(true);
      await deletePack(id);
      await fetchPacks();
      toast.success('Pack deleted successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete pack');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      await togglePackStatus(id, !currentStatus);
      await fetchPacks();
      toast.success('Pack status updated successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to toggle pack status');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      items: [{ name: '', quantity: 1 }],
      addOns: []
    });
  };

  const openEditModal = (pack: Pack) => {
    setEditingPack(pack);
    setFormData({
      name: pack.name,
      description: pack.description,
      price: pack.price,
      image: pack.image,
      items: pack.items,
      addOns: pack.addOns
    });
    setIsModalOpen(true);
  };

  const filteredAndSortedPacks = packs?.filter(pack => {
    const matchesSearch = pack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactiveOnly ? !pack.isActive : true;
    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'popularity':
        comparison = a.popularity - b.popularity;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  }) ?? [];

  if (loading) {
    return (
      <div className="bg-gray-50 flex h-full items-center justify-center">
        <div className="text-gray-500 animate-pulse text-xl">Loading pack data ...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-[#FE724C]" />
            <h1 className="text-2xl font-semibold text-gray-900">Pack Management</h1>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingPack(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#FE724C] text-sm rounded-[12px] hover:bg-[#FE724C]/80 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Pack
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search packs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'popularity')}
                  className="border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="popularity">Popularity</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  {sortOrder === 'asc' ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showInactiveOnly}
                  onChange={(e) => setShowInactiveOnly(e.target.checked)}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                Show Inactive Only
              </label>
            </div>
          </div>
        </div>

        {/* Packs Grid */}
        {filteredAndSortedPacks.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No pack found for the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPacks.map((pack) => (
              <motion.div
                key={pack._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={pack.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80'}
                    alt={pack.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(pack._id, pack.isActive)}
                      className={`p-2 rounded-full ${
                        pack.isActive ? 'bg-green-500' : 'bg-gray-500'
                      } text-white hover:opacity-90 transition-opacity`}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{pack.name}</h3>
                    <span className="text-lg font-semibold text-blue-500">
                      ${pack.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{pack.description}</p>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Items:</h4>
                      <ul className="text-sm text-gray-600">
                        {pack.items.map((item, index) => (
                          <li key={index}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {pack.addOns.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Add-ons:</h4>
                        <ul className="text-sm text-gray-600">
                          {pack.addOns.map((addon, index) => (
                            <li key={index}>
                              {addon.name} (+${addon.price.toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Popularity:</span>
                      <span className="text-sm font-medium">{pack.popularity}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(pack)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePack(pack._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPack ? 'Edit Pack' : 'Add New Pack'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <Input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items
                    </label>
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[index].name = e.target.value;
                            setFormData({ ...formData, items: newItems });
                          }}
                          placeholder="Item name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...formData.items];
                            newItems[index].quantity = parseInt(e.target.value);
                            setFormData({ ...formData, items: newItems });
                          }}
                          min="1"
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            const newItems = formData.items.filter((_, i) => i !== index);
                            setFormData({ ...formData, items: newItems });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        items: [...formData.items, { name: '', quantity: 1 }]
                      })}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add-ons
                    </label>
                    {formData.addOns.map((addon, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={addon.name}
                          onChange={(e) => {
                            const newAddons = [...formData.addOns];
                            newAddons[index].name = e.target.value;
                            setFormData({ ...formData, addOns: newAddons });
                          }}
                          placeholder="Add-on name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          value={addon.price}
                          onChange={(e) => {
                            const newAddons = [...formData.addOns];
                            newAddons[index].price = parseFloat(e.target.value);
                            setFormData({ ...formData, addOns: newAddons });
                          }}
                          step="0.01"
                          min="0"
                          placeholder="Price"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => {
                            const newAddons = formData.addOns.filter((_, i) => i !== index);
                            setFormData({ ...formData, addOns: newAddons });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setFormData({
                        ...formData,
                        addOns: [...formData.addOns, { name: '', price: 0 }]
                      })}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      + Add Add-on
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-[12px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingPack ? handleUpdatePack : handleAddPack}
                  className="px-4 py-2 bg-[#FE724C] rounded-[12px] hover:bg-[#FE724C]/80 transition-colors"
                  disabled={formLoading}
                >
                  {formLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : (editingPack ? 'Update Pack' : 'Add Pack')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Packs;