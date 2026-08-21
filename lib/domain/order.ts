export type OrderStatus = "Processing" | "Ready for pickup" | "Shipped" | "Delivered" | "Cancelled";

export type MedicationOrder = {
  id: string;
  slug: string;
  orderNumber: string;
  medication: string;
  quantity: string;
  supply: string;
  status: OrderStatus;
  orderDate: string;
  deliveredDate?: string;
  deliveryMethod: string;
  trackingNumber?: string;
  carrier?: string;
  memberCost: string;
};
