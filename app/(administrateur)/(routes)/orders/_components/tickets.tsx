import React from "react";
import { format } from "date-fns";
import { Order } from "@/lib/types/orders.types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/buttons";

interface OrderTicketProps {
  order: Order;
  onClose: () => void;
}

const OrderTicket: React.FC<OrderTicketProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    // Créer le contenu HTML pour l'impression
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order.reference}</title>
          <style>
            @page {
              margin: 10mm;
              size: 80mm auto;
            }
            @media print {
              body { 
                font-family: 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.3;
                margin: 0;
                padding: 0;
                width: 80mm;
              }
              .no-print { display: none !important; }
            }
            body {
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 8px;
              width: 80mm;
              font-size: 12px;
              line-height: 1.3;
            }
            .receipt {
              text-align: center;
            }
            .header {
              margin-bottom: 10px;
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
              margin-bottom: 2px;
            }
            .section {
              margin: 10px 0;
              padding: 8px 0;
              border-bottom: 1px dashed #000;
              text-align: left;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 6px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
            }
            .item-name {
              flex: 1;
              padding-right: 8px;
            }
            .item-price {
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
              margin-top: 10px;
              text-align: center;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="title">MARMARA SPRA</div>
              <div class="info">Commande #${order.reference}</div>
              <div class="info">${format(new Date(order.date), "dd/MM/yyyy HH:mm")}</div>
              <div class="info">Statut: ${order.status.replace(/_/g, " ").toUpperCase()}</div>
            </div>

            <div class="section">
              <div class="section-title">Informations Client</div>
              ${order.userId ? `
                <div>${order.userId.firstName} ${order.userId.lastName}</div>
                <div>${order.userId.phone}</div>
              ` : '<div>Commande Invité</div>'}
              <div>Livraison: ${order.deliveryMethod}</div>
              <div>Paiement: ${order.payment}</div>
            </div>

            <div class="section">
              <div class="section-title">Articles commandés</div>
              ${order.items.map(item => `
                <div class="item">
                  <div class="item-name">${item.quantity}x ${item.platId?.name || item.packId?.name}</div>
                  <div class="item-price">${((item.platId?.price || item.packId?.price || 0) * item.quantity).toFixed(2)}€</div>
                </div>
              `).join('')}
              
              <div class="total">
                <div>TOTAL</div>
                <div>${order.amount.toFixed(2)}€</div>
              </div>
            </div>

            <div class="footer">
              Merci d'avoir choisi Marmara SPRA!<br>
              Imprimé le ${format(new Date(), "dd/MM/yyyy HH:mm")}
            </div>
          </div>
        </body>
      </html>
    `;

    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Attendre que le contenu soit chargé puis imprimer
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // Fermer la fenêtre après impression
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    } else {
      alert('Veuillez autoriser les pop-ups pour imprimer le ticket');
    }
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Ticket de commande #{order.reference}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Informations de la commande */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Informations générales</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Date:</span> {format(new Date(order.date), "dd/MM/yyyy HH:mm")}</p>
              <p><span className="font-medium">Statut:</span> 
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {order.status.replace(/_/g, " ").toUpperCase()}
                </span>
              </p>
              <p><span className="font-medium">Méthode de livraison:</span> {order.deliveryMethod}</p>
              <p><span className="font-medium">Statut paiement:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  order.payment === 'Paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.payment}
                </span>
              </p>
            </div>
          </div>

          {/* Informations client */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
            {order.userId ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.userId.firstName} {order.userId.lastName}</p>
                <p className="text-gray-600">{order.userId.email}</p>
                <p className="text-gray-600">{order.userId.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Commande invité</p>
            )}
          </div>

          {/* Articles commandés */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Articles commandés</h3>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.platId?.name || item.packId?.name}
                    </p>
                    <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {((item.platId?.price || item.packId?.price || 0) * item.quantity).toFixed(2)}€
                  </p>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">TOTAL</p>
                <p className="text-lg font-bold text-gray-900">{order.amount.toFixed(2)}€</p>
              </div>
            </div>
          </div>

          {/* Bouton d'impression */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handlePrint}
              className="w-full bg-[#FE724C] hover:bg-[#FE724C]/90"
              size="lg"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer le ticket
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderTicket;