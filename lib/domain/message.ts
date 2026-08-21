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
