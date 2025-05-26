import React from "react";
import { format } from "date-fns";
import { Order } from "@/lib/types/orders.types";

interface OrderTicketProps {
  order: Order;
  onClose: () => void;
}

const OrderTicket: React.FC<OrderTicketProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order.reference}</title>
          <style>
            @page {
              margin: 0;
              size: 100mm 250mm;
            }
            body {
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 0;
              width: 80mm;
              font-size: 12px;
              line-height: 1.2;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            .receipt {
              padding: 8px;
              text-align: center;
            }
            .header {
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px dashed #000;
            }
            .title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .info {
              font-size: 12px;
              margin-bottom: 4px;
            }
            .section {
              margin: 8px 0;
              padding: 8px 0;
              border-bottom: 1px dashed #000;
            }
            .section-title {
              font-weight: bold;
              text-align: left;
              margin-bottom: 8px;
            }
            .customer-info {
              text-align: left;
              line-height: 1.4;
            }
            .items {
              width: 100%;
              text-align: left;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 4px 0;
            }
            .item-name {
              flex: 1;
              text-align: left;
              padding-right: 8px;
            }
            .item-price {
              text-align: right;
              white-space: nowrap;
            }
            .total {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px solid #000;
            }
            .footer {
              margin-top: 8px;
              padding-top: 8px;
              text-align: center;
              font-size: 11px;
              line-height: 1.3;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="title">MARMARA SPRA</div>
              <div class="info">Order #${order.reference}</div>
              <div class="info">${format(
                new Date(order.date),
                "dd/MM/yyyy HH:mm"
              )}</div>
            </div>

            <div class="section">
              <div class="section-title">Customer Details</div>
              <div class="customer-info">
                ${
                  order.userId
                    ? `
                  ${order.userId.firstName} ${order.userId.lastName}<br>
                  ${order.userId.phone}
                `
                    : "Guest Order"
                }
                <br>
                Delivery: ${order.deliveryMethod}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Order Items</div>
              <div class="items">
                ${order.items
                  .map(
                    (item) => `
                  <div class="item">
                    <div class="item-name">${item.quantity}x ${
                      item.platId?.name || item.packId?.name
                    }</div>
                    <div class="item-price">${(
                      (item.platId?.price || item.packId?.price || 0) *
                      item.quantity
                    ).toFixed(2)}€</div>
                  </div>
                `
                  )
                  .join("")}
                <div class="total">
                  <div>Total</div>
                  <div>${order.amount.toFixed(2)}€</div>
                </div>
              </div>
            </div>

            <div class="footer">
              Thank you for choosing Marmara SPRA!<br>
              ${format(new Date(), "dd/MM/yyyy HH:mm")}
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="fixed top-10 bg-white w-[100mm] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white px-6 pt-8 pb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-[0.25em] text-gray-900 mb-3">
              MARMARA SPRA
            </h1>
            <p className="text-lg font-medium text-gray-700">
              Order #{order.reference}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {format(new Date(order.date), "dd/MM/yyyy HH:mm")}
            </p>
            <span className="inline-flex items-center px-4 py-1.5 mt-3 text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full ring-1 ring-blue-200">
              {order.status.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm ring-1 ring-gray-100">
            <h2 className="font-semibold text-gray-900 uppercase text-sm mb-3">
              Customer Details
            </h2>
            {order.userId ? (
              <div className="space-y-1">
                <p className="font-medium text-gray-800">
                  {order.userId.firstName} {order.userId.lastName}
                </p>
                <p className="text-sm text-gray-600">{order.userId.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Guest Order</p>
            )}
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Delivery Method:</span>{" "}
                {order.deliveryMethod}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 uppercase text-sm">
              Order Items
            </h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="py-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-gray-900">
                      {item.quantity}x
                    </span>
                    <span className="text-gray-700">
                      {item.platId?.name || item.packId?.name}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {(
                      (item.platId?.price || item.packId?.price || 0) *
                      item.quantity
                    ).toFixed(2)}
                    €
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white shadow-xl">
            <h2 className="text-gray-300 uppercase text-xs mb-1">
              Total Amount
            </h2>
            <p className="text-2xl font-bold">{order.amount.toFixed(2)}€</p>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-gray-700 font-medium">
              Thank you for choosing Marmara SPRA!
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {format(new Date(), "dd/MM/yyyy HH:mm")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handlePrint}
              className="flex-1 bg-gradient-to-br from-[#FE724C] to-[#FE724C] px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-green-100 hover:from-[#FE724C] hover:to-[#FE724C] transition-all duration-200 focus:ring-2 focus:ring-[#FE724C] focus:ring-offset-2"
            >
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTicket;
