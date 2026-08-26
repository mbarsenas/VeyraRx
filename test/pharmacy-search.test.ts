import assert from "node:assert/strict";
import test from "node:test";
import { pharmacyLocations } from "../lib/mock-data/pharmacies";
import { filterPharmacyLocations } from "../lib/pharmacy-search";

test("public pharmacy search matches ZIP code", () => {
  const results = filterPharmacyLocations(pharmacyLocations, "78209");
  assert.equal(results.length, 2);
  assert.ok(results.every((pharmacy) => pharmacy.cityStateZip.endsWith("78209")));
});

test("public pharmacy search matches pharmacy name without case sensitivity", () => {
  const results = filterPharmacyLocations(pharmacyLocations, "cVs");
  assert.equal(results.length, 1);
  assert.equal(results[0]?.name, "CVS Pharmacy");
});

test("public pharmacy search waits for a submitted location", () => {
  assert.deepEqual(filterPharmacyLocations(pharmacyLocations, "   "), []);
});
