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
