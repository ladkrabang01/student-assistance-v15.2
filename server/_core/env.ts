import { TRPCError } from "@trpc/server";

// List of required environment variables
const REQUIRED_ENV_VARS = [
  "VITE_APP_ID",
  "JWT_SECRET",
  "DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "OAUTH_SERVER_URL",
  "OWNER_OPEN_ID",
  "BUILT_IN_FORGE_API_URL",
  "BUILT_IN_FORGE_API_KEY",
];

// Validate environment variables on startup
function validateEnvironmentVariables() {
  const missingVars: string[] = [];

  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    if (!value || value.trim() === "") {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    const errorMsg = `Missing required environment variables: ${missingVars.join(", ")}`;
    console.error(`[ENV Validation Error] ${errorMsg}`);
    
    // In production, throw error to fail fast
    if (process.env.NODE_ENV === "production") {
      throw new Error(errorMsg);
    }
    
    // In development, just warn
    console.warn(`[ENV Warning] Some variables are missing. API calls may fail.`);
  }
}

// Run validation on module load
if (typeof process !== "undefined") {
  validateEnvironmentVariables();
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  tursoAuthToken: process.env.TURSO_AUTH_TOKEN ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

// Helper to check if a critical env var is missing
export function isCriticalEnvMissing(): boolean {
  return !ENV.appId || !ENV.cookieSecret || !ENV.databaseUrl || !ENV.oAuthServerUrl;
}

// Helper to throw error if critical env is missing
export function throwIfCriticalEnvMissing(context: string): void {
  if (isCriticalEnvMissing()) {
    const missing = [];
    if (!ENV.appId) missing.push("VITE_APP_ID");
    if (!ENV.cookieSecret) missing.push("JWT_SECRET");
    if (!ENV.databaseUrl) missing.push("DATABASE_URL");
    if (!ENV.oAuthServerUrl) missing.push("OAUTH_SERVER_URL");
    
    const errorMsg = `[${context}] Missing critical environment variables: ${missing.join(", ")}`;
    console.error(errorMsg);
    
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Server configuration error. Please contact administrator.",
      cause: errorMsg,
    });
  }
}
