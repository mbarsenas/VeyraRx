export type CommunicationPreference = "Email" | "Text" | "Phone";

export type MemberProfile = {
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  communicationPreference: CommunicationPreference;
  paperless: boolean;
  refillReminders: boolean;
  orderUpdates: boolean;
};

export const memberProfile: MemberProfile = {
  email: "mark@example.com",
  phone: "(210) 555-0148",
  address1: "1234 Example Way",
  address2: "",
  city: "San Antonio",
  state: "TX",
  postalCode: "78205",
  communicationPreference: "Email",
  paperless: true,
  refillReminders: true,
  orderUpdates: true,
};
