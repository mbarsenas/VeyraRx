export type PharmacyNetworkStatus = "Preferred" | "In network" | "Out of network";

export type PharmacyLocation = {
  id: string;
  name: string;
  slug: string;
  address: string;
  cityStateZip: string;
  distance: string;
  phone: string;
  hours: string;
  networkStatus: PharmacyNetworkStatus;
  pickup: boolean;
  ninetyDayEligible: boolean;
  driveThru: boolean;
};
