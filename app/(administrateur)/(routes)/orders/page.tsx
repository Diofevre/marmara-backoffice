'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { Order, OrderStatus, OrderSearchParams } from '@/lib/types/orders.types';
import { getOrders, updateOrderStatus, searchOrders } from '@/lib/services/ordersService';
import { toast } from 'sonner';
import { Input } from '@/components/ui/inputs';
import OrderTicket from './_components/tickets';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>();
  const [searchParams, setSearchParams] = useState<OrderSearchParams>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusOptions: OrderStatus[] = [
    'pending',
    'preparing',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ];

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getOrders(selectedStatus);
      setOrders(data);
    } catch (error) {
      console.log(error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, selectedStatus]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      loadOrders();
    } catch (error) {
      console.log(error);
      toast.error('Failed to update order status');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const results = await searchOrders(searchParams);
      setOrders(results);
    } catch (error) {
      console.log(error);
      toast.error('Failed to search orders');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference or Customer Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Search..."
                  onChange={(e) => setSearchParams({ ...searchParams, reference: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
                />
                <Input
                  type="date"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#FE724C] px-4 py-2 rounded-md hover:bg-[#FE724C]/80 focus:outline-none focus:ring-2 focus:ring-[#FE724C] focus:ring-offset-2"
              >
                Search Orders
              </button>
            </div>
          </form>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedStatus(undefined)}
            className={`px-4 py-2 rounded-[12px] text-sm font-medium ${
              !selectedStatus
                ? 'bg-[#FE724C]'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Orders
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-[#FE724C]'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FE724C] mx-auto"></div>
          </div>
        ) : (
          <>
            {orders.length === 0 && (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500 text-lg">No Orders found for the selected filter.</p>
              </div>
            )}
            
            {/* List of Orders */}
            <div className="grid gap-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order {order.reference}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(order.date), 'PPP')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {['ready', 'out_for_delivery', 'delivered'].includes(order.status) && (
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-[12px] hover:bg-green-100 transition-colors border border-green-700"
                          >
                            <Printer size={18} />
                          </button>
                        )}
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value as OrderStatus)}
                          className="rounded-[12px] border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1.5"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                          {order.userId ? (
                            <div className="mt-2">
                              <p className="text-sm text-gray-900">
                                {order.userId.firstName} {order.userId.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{order.userId.email}</p>
                              <p className="text-sm text-gray-500">{order.userId.phone}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 mt-2">Guest Order</p>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Order Details</h4>
                          <div className="mt-2">
                            <p className="text-sm text-gray-900">
                              Delivery Method: {order.deliveryMethod}
                            </p>
                            <p className="text-sm text-gray-900">
                              Payment Status: {order.payment}
                            </p>
                            <p className="text-sm text-gray-900">
                              Total Amount: ${order.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-900">
                              {item.quantity}x {item.platId?.name || item.packId?.name}
                            </span>
                            <span className="text-gray-500">
                              ${((item.platId?.price || item.packId?.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Order Ticket Modal */}
        {selectedOrder && (
          <OrderTicket
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Orders;