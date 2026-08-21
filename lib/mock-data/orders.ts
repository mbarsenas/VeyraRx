export type OrderStatus = "Processing" | "Shipped" | "Delivered";

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
  strength: string;
  quantity: string;
  supply: string;
  status: OrderStatus;
  orderDate: string;
  estimatedArrival: string;
  deliveredDate?: string;
  deliveryMethod: string;
  deliveryAddress: string;
  trackingNumber?: string;
  carrier?: string;
  memberCost: string;
  timeline: OrderTimelineStep[];
};

export const orders: MedicationOrder[] = [
  {
    id: "order-atorvastatin-aug-2026",
    slug: "atorvastatin",
    orderNumber: "VYR-883921",
    medication: "Atorvastatin",
    strength: "20 mg",
    quantity: "90 tablets",
    supply: "90-day supply",
    status: "Processing",
    orderDate: "Aug 11, 2026",
    estimatedArrival: "Aug 14, 2026",
    deliveryMethod: "Standard home delivery",
    deliveryAddress: "San Antonio, TX 78258",
    memberCost: "$12.00",
    timeline: [
      { label: "Order received", detail: "Aug 11 - 5:58 PM", state: "complete" },
      { label: "Prescription verified", detail: "Aug 11 - 6:21 PM", state: "complete" },
      { label: "Processing", detail: "Medication is being prepared", state: "current" },
      { label: "Shipped", detail: "Tracking information will appear here", state: "upcoming" },
      { label: "Delivered", detail: "Expected Aug 14", state: "upcoming" },
    ],
  },
  {
    id: "order-lisinopril-jul-2026",
    slug: "lisinopril-jul-2026",
    orderNumber: "VYR-771204",
    medication: "Lisinopril",
    strength: "10 mg",
    quantity: "30 tablets",
    supply: "30-day supply",
    status: "Delivered",
    orderDate: "Jul 12, 2026",
    estimatedArrival: "Jul 13, 2026",
    deliveredDate: "Jul 13, 2026",
    deliveryMethod: "Pharmacy pickup",
    deliveryAddress: "H-E-B Pharmacy - San Antonio, TX",
    memberCost: "$8.00",
    timeline: [
      { label: "Order received", detail: "Jul 12 - 9:14 AM", state: "complete" },
      { label: "Prescription verified", detail: "Jul 12 - 9:42 AM", state: "complete" },
      { label: "Ready for pickup", detail: "Jul 12 - 2:18 PM", state: "complete" },
      { label: "Delivered", detail: "Picked up Jul 13", state: "complete" },
    ],
  },
  {
    id: "order-metformin-jun-2026",
    slug: "metformin-jun-2026",
    orderNumber: "VYR-663882",
    medication: "Metformin ER",
    strength: "500 mg",
    quantity: "180 tablets",
    supply: "90-day supply",
    status: "Delivered",
    orderDate: "Jun 28, 2026",
    estimatedArrival: "Jul 1, 2026",
    deliveredDate: "Jun 30, 2026",
    deliveryMethod: "Standard home delivery",
    deliveryAddress: "San Antonio, TX 78258",
    trackingNumber: "VX930184221US",
    carrier: "Veyra Delivery Network",
    memberCost: "$10.00",
    timeline: [
      { label: "Order received", detail: "Jun 28 - 10:02 AM", state: "complete" },
      { label: "Prescription verified", detail: "Jun 28 - 10:31 AM", state: "complete" },
      { label: "Shipped", detail: "Jun 29 - 8:07 AM", state: "complete" },
      { label: "Delivered", detail: "Jun 30 - 3:22 PM", state: "complete" },
    ],
  },
];

export const getOrderBySlug = (slug: string) => orders.find((order) => order.slug === slug);
