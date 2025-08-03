/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Search, Printer, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { format } from "date-fns";
import {
  Order,
  OrderStatus,
  OrderSearchParams,
} from "@/lib/types/orders.types";
import {
  useOrders,
  useUpdateOrderStatus,
  useSearchOrders,
  useUpdatePaymentStatus,
} from "@/lib/services/ordersService";
import { Input } from "@/components/ui/inputs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrderTicket from "./_components/tickets";
import { Button } from "@/components/ui/buttons";
import { markAsReadNotifications } from "@/lib/services/notificationService";

const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | undefined
  >("pending");
  const [searchParams, setSearchParams] = useState<OrderSearchParams>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // États pour les notifications sonores
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [previousOrdersCount, setPreviousOrdersCount] = useState<number>(0);

  const searchOrdersResult = useSearchOrders(searchParams);
  const ordersResult = useOrders(selectedStatus);

  const { orders, isLoading, isError, mutate } = isSearching
    ? searchOrdersResult
    : ordersResult;
  const { updateOrderStatus } = useUpdateOrderStatus();
  const { updateOrder: updatePaymentStatus } = useUpdatePaymentStatus();

  const statusOptions: OrderStatus[] = [
    "pending",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  // Initialiser l'audio
  useEffect(() => {
    // Créer un son de notification fort et long (7 secondes)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createNotificationSound = () => {
      if (!soundEnabled) return;
      
      // Créer une séquence de bips forts et longs
      const playBeep = (frequency: number, duration: number, delay: number = 0) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = 'sine';
          
          // Volume plus fort (0.8 au lieu de 0.3)
          gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };
      
      // Son long de 7 secondes avec plusieurs bips forts
      playBeep(800, 0.8, 0);      // Premier bip long
      playBeep(1000, 0.8, 900);   // Deuxième bip long
      playBeep(800, 0.8, 1800);   // Troisième bip long
      playBeep(1200, 0.8, 2700);  // Quatrième bip long
      playBeep(800, 0.8, 3600);   // Cinquième bip long
      playBeep(1000, 0.8, 4500);  // Sixième bip long
      playBeep(800, 0.8, 5400);   // Septième bip long
      playBeep(1200, 0.8, 6300);  // Huitième bip long (total ~7 secondes)
    };

    // Vérifier les nouvelles commandes uniquement pour les commandes "pending"
    if (!isSearching && selectedStatus === "pending" && orders) {
      const currentOrdersCount = orders.length;
      
      // Si c'est la première fois qu'on charge, juste sauvegarder le nombre
      if (previousOrdersCount === 0) {
        setPreviousOrdersCount(currentOrdersCount);
      } 
      // Si il y a plus de commandes qu'avant, jouer le son
      else if (currentOrdersCount > previousOrdersCount) {
        createNotificationSound();
        setPreviousOrdersCount(currentOrdersCount);
        
        // Optionnel: Montrer une notification visuelle
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Nouvelle commande!', {
            body: `Vous avez ${currentOrdersCount - previousOrdersCount} nouvelle(s) commande(s)`,
            icon: '/favicon.ico'
          });
        }
      }
      // Mettre à jour le compteur même si le nombre diminue
      else if (currentOrdersCount !== previousOrdersCount) {
        setPreviousOrdersCount(currentOrdersCount);
      }
    }
  }, [orders, isSearching, selectedStatus, previousOrdersCount, soundEnabled]);

  // Demander la permission pour les notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = (orders ?? []).slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil((orders?.length ?? 0) / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingStatus(orderId);
      await updateOrderStatus(orderId, newStatus);
      mutate();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handlePaymentStatusUpdate = async (orderId: string) => {
    try {
      setUpdatingPaymentStatus(orderId);
      await updatePaymentStatus(orderId, "Paid");
      mutate();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de paiement:",
        error
      );
    } finally {
      setUpdatingPaymentStatus(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
  };

  const resetSearch = () => {
    setSearchParams({});
    setIsSearching(false);
    setCurrentPage(1);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  useEffect(() => {
    markAsReadNotifications();
    return () => {
      markAsReadNotifications();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Order Management
          </h1>
          
          {/* Contrôle du son */}
          <Button
            onClick={toggleSound}
            variant="outline"
            className={`flex items-center gap-2 ${
              soundEnabled 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            {soundEnabled ? 'Sound ON' : 'Sound OFF'}
          </Button>
        </div>

        {/* Indicateur de nouvelles commandes */}
        {!isSearching && selectedStatus === "pending" && orders && orders.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-green-800 font-medium">
                {orders.length} pending order{orders.length > 1 ? 's' : ''} waiting for preparation
              </p>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
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
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      reference: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      startDate: e.target.value,
                    })
                  }
                />
                <Input
                  type="date"
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#FE724C] text-white px-4 py-2 rounded-md hover:bg-[#FE724C]/80 focus:outline-none focus:ring-2 focus:ring-[#FE724C] focus:ring-offset-2"
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
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              !selectedStatus && !isSearching
                ? "bg-[#FE724C] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
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
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedStatus === status && !isSearching
                  ? "bg-[#FE724C] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {status
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FE724C] mx-auto"></div>
          </div>
        ) : currentOrders?.length === 0 || isError ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">
              {isSearching
                ? "No orders match your search."
                : "No orders found for the selected filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {currentOrders.map((order) => (
              <div
                key={order._id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                  order.status === 'pending' ? 'ring-2 ring-orange-200 ring-opacity-50' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        Order {order.reference}
                        {order.status === 'pending' && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            NEW
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.date), "PPP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {["ready", "out_for_delivery", "delivered"].includes(
                        order.status
                      ) && (
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-sm hover:bg-green-100 transition-colors border border-green-700"
                        >
                          <Printer size={18} />
                        </button>
                      )}
                      {updatingStatus === order._id ? (
                        <span className="text-sm text-gray-500">
                          Changing status...
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex items-center gap-2 text-sm border-gray-300"
                              >
                                {order.status
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                                <ChevronDown size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {statusOptions.map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() =>
                                    handleStatusUpdate(order._id, status)
                                  }
                                  className={
                                    order.status === status ? "bg-gray-100" : ""
                                  }
                                >
                                  {status
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {order.payment === "Not paid" && (
                            updatingPaymentStatus === order._id ? (
                              <span className="text-sm text-gray-500">
                                Updating payment...
                              </span>
                            ) : (
                              <Button
                                variant="outline"
                                className="text-sm border-green-700 text-green-700 hover:bg-green-50"
                                onClick={() =>
                                  handlePaymentStatusUpdate(order._id)
                                }
                              >
                                Mark as paid
                              </Button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Customer Information
                        </h4>
                        {order.userId ? (
                          <div className="mt-2">
                            <p className="text-sm text-gray-900">
                              {order.userId.firstName} {order.userId.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.userId.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.userId.phone}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-2">
                            Guest Order
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Order Details
                        </h4>
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
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Order Items
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-900">
                            {item.quantity}x{" "}
                            {item.platId?.name || item.packId?.name}
                          </span>
                          <span className="text-gray-500">
                            $
                            {(
                              (item.platId?.price || item.packId?.price || 0) *
                              item.quantity
                            ).toFixed(2)}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 mb-6">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, orders?.length ?? 0)} of{" "}
              {orders?.length ?? 0} orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      currentPage === page
                        ? "bg-[#FE724C] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
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
};

export default Orders;