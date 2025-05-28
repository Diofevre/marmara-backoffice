'use client'

import React, { useState } from 'react';
import { Search, Printer, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { Order, OrderStatus, OrderSearchParams } from '@/lib/types/orders.types';
import { useOrders, useUpdateOrderStatus, useSearchOrders } from '@/lib/services/ordersService';
import { Input } from '@/components/ui/inputs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OrderTicket from './_components/tickets';
import { Button } from '@/components/ui/buttons';

const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>();
  const [searchParams, setSearchParams] = useState<OrderSearchParams>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const searchOrdersResult = useSearchOrders(searchParams);
  const ordersResult = useOrders(selectedStatus);

  const { orders, isLoading, isError, mutate } = isSearching ? searchOrdersResult : ordersResult;
  const { updateOrderStatus } = useUpdateOrderStatus();

  const statusOptions: OrderStatus[] = [
    'pending',
    'preparing',
    'ready',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ];

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(orderId); // Set loading state for this order
      await updateOrderStatus(orderId, newStatus);
      mutate();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingStatus(null); // Clear loading state
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
  };

  const resetSearch = () => {
    setSearchParams({});
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference or Customer Name
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
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

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#FE724C] px-4 py-2 rounded-md hover:bg-[#FE724C]/80 focus:outline-none focus:ring-2 focus:ring-[#FE724C] focus:ring-offset-2"
              >
                Search Orders
              </button>
              {isSearching && (
                <button
                  type="button"
                  onClick={resetSearch}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setSelectedStatus(undefined);
              setIsSearching(false);
            }}
            className={`px-4 py-2 rounded-[12px] text-sm font-medium ${
              !selectedStatus && !isSearching
                ? 'bg-[#FE724C]'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Orders
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setIsSearching(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedStatus === status && !isSearching
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
        ) : orders?.length === 0 || isError ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">
              {isSearching ? 'No orders match your search.' : 'No orders found for the selected filter.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {(orders ?? []).map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-sm hover:bg-green-100 transition-colors border border-green-700"
                        >
                          <Printer size={18} />
                        </button>
                      )}
                      {updatingStatus === order._id ? (
                        <span className="text-sm text-gray-500">Changing status...</span>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex items-center gap-2 text-sm border-gray-300"
                            >
                              {order.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                              <ChevronDown size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {statusOptions.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => handleStatusUpdate(order._id, status)}
                                className={order.status === status ? 'bg-gray-100' : ''}
                              >
                                {status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
        )}

        {/* Order Ticket Modal */}
        {selectedOrder && (
          <OrderTicket order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </div>
    </div>
  );
};

export default Orders;