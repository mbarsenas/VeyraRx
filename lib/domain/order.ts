export type OrderStatus = "Processing" | "Ready for pickup" | "Shipped" | "Delivered" | "Cancelled";

export type OrderTimelineStep = {
  label: string;
  detail: string;
  state: "complete" | "current" | "upcoming";
};

export type MedicationOrder = {
  id: string;
  slug: string;
  orderNumber: string;
  medication: string;
  quantity: string;
  supply: string;
  status: OrderStatus;
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  deliveryMethod: string;
  deliveryAddress?: string;
  trackingNumber?: string;
  carrier?: string;
  memberCost: string;
  timeline?: OrderTimelineStep[];
};
