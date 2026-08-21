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

export const pharmacyLocations: PharmacyLocation[] = [
  {
    id: "heb-wurzbach",
    name: "H-E-B Pharmacy",
    slug: "heb-wurzbach",
    address: "9900 Wurzbach Rd",
    cityStateZip: "San Antonio, TX 78230",
    distance: "2.4 miles",
    phone: "(210) 555-0142",
    hours: "8:00 AM - 8:00 PM",
    networkStatus: "Preferred",
    pickup: true,
    ninetyDayEligible: true,
    driveThru: true,
  },
  {
    id: "cvs-medical",
    name: "CVS Pharmacy",
    slug: "cvs-medical-center",
    address: "7950 Floyd Curl Dr",
    cityStateZip: "San Antonio, TX 78229",
    distance: "3.1 miles",
    phone: "(210) 555-0178",
    hours: "9:00 AM - 9:00 PM",
    networkStatus: "In network",
    pickup: true,
    ninetyDayEligible: true,
    driveThru: false,
  },
  {
    id: "walgreens-huebner",
    name: "Walgreens Pharmacy",
    slug: "walgreens-huebner",
    address: "11707 Huebner Rd",
    cityStateZip: "San Antonio, TX 78230",
    distance: "4.6 miles",
    phone: "(210) 555-0194",
    hours: "8:00 AM - 10:00 PM",
    networkStatus: "In network",
    pickup: true,
    ninetyDayEligible: false,
    driveThru: true,
  },
  {
    id: "community-oakdell",
    name: "Community Care Pharmacy",
    slug: "community-care-oakdell",
    address: "4212 Medical Dr",
    cityStateZip: "San Antonio, TX 78229",
    distance: "5.8 miles",
    phone: "(210) 555-0111",
    hours: "9:00 AM - 6:00 PM",
    networkStatus: "Out of network",
    pickup: true,
    ninetyDayEligible: false,
    driveThru: false,
  },
];
