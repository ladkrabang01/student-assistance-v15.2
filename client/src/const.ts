export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Validate environment variables at startup
function validateEnv() {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl) {
    console.error(
      "Missing VITE_OAUTH_PORTAL_URL environment variable. OAuth login will not work."
    );
  }

  if (!appId) {
    console.error(
      "Missing VITE_APP_ID environment variable. OAuth login will not work."
    );
  }
}

// Run validation on module load
if (typeof window !== "undefined") {
  validateEnv();
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    console.error(
      "Cannot generate login URL: Missing required environment variables",
      { oauthPortalUrl, appId }
    );
    return "";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.error("Failed to generate login URL:", error);
    return "";
  }
};
