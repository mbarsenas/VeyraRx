export const productionDataProviderPolicy = {
  productionProvider: "postgres" as const,
  mockProviderAllowedEnvironments: ["development", "test"] as const,
};
