export type MessageCategory = "Order" | "Benefit" | "Pharmacy" | "Support";

export type MemberMessage = {
  id: string;
  subject: string;
  preview: string;
  body: string;
  sender: string;
  date: string;
  category: MessageCategory;
  unread: boolean;
};

export const messages: MemberMessage[] = [
  {
    id: "msg-1",
    subject: "Your Atorvastatin order is being prepared",
    preview: "Order VYR-883921 is processing and is expected to arrive Aug 14.",
    body: "Your Atorvastatin 20 mg order is currently being prepared for shipment. Your estimated arrival date is Aug 14. Tracking details will appear once the carrier receives the package.",
    sender: "VeyraRx Home Delivery",
    date: "Aug 11, 2026",
    category: "Order",
    unread: true,
  },
  {
    id: "msg-2",
    subject: "Lisinopril refill is available",
    preview: "Your Lisinopril 10 mg prescription is eligible for refill.",
    body: "Your Lisinopril 10 mg prescription is now eligible for refill. You currently have 2 refills remaining. You can submit a refill from your prescription details page.",
    sender: "VeyraRx Prescription Services",
    date: "Aug 10, 2026",
    category: "Pharmacy",
    unread: true,
  },
  {
    id: "msg-3",
    subject: "2026 pharmacy benefit summary",
    preview: "Review your deductible progress and current pharmacy benefit information.",
    body: "Your 2026 VeyraChoice Plus pharmacy benefit is active. Your current deductible progress and medication coverage information are available in Benefits & Coverage.",
    sender: "VeyraRx Benefits",
    date: "Aug 7, 2026",
    category: "Benefit",
    unread: false,
  },
  {
    id: "msg-4",
    subject: "Preferred pharmacy updated",
    preview: "H-E-B Pharmacy is currently listed as your preferred pharmacy.",
    body: "H-E-B Pharmacy in San Antonio is currently listed as your preferred pharmacy. You can search participating locations or select a different preferred pharmacy from the Pharmacy page.",
    sender: "VeyraRx Member Support",
    date: "Aug 4, 2026",
    category: "Support",
    unread: false,
  },
];
