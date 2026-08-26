import type { PharmacyLocation } from "@/lib/domain/pharmacy";

export function filterPharmacyLocations(pharmacies: PharmacyLocation[], query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return [];

  return pharmacies.filter((pharmacy) =>
    [pharmacy.name, pharmacy.address, pharmacy.cityStateZip].some((field) =>
      field.toLowerCase().includes(value)
    )
  );
}
