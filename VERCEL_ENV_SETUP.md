# Vercel Environment Variables Setup Checklist

## Complete List of Required Environment Variables

Copy and paste this checklist into your Vercel project settings. Mark each one as you add it.

### Frontend Variables (VITE_*)
These are exposed to the browser and must be set for the React app to work.

- [ ] `VITE_APP_ID` - Manus OAuth Application ID
  - Where to get: Manus project settings
  - Example: `your-manus-app-id`

- [ ] `VITE_APP_TITLE` - Website title displayed in browser tab
  - Where to get: Your choice
  - Example: `Student Assistance V15`

- [ ] `VITE_APP_LOGO` - Website logo URL
  - Where to get: Your logo URL or Manus storage
  - Example: `https://example.com/logo.png`

- [ ] `VITE_OAUTH_PORTAL_URL` - Manus OAuth login portal
  - Where to get: Manus documentation (usually fixed)
  - Example: `https://api.manus.im`

- [ ] `VITE_FRONTEND_FORGE_API_URL` - Manus APIs endpoint for frontend
  - Where to get: Manus documentation
  - Example: `https://forge.manus.im`

- [ ] `VITE_FRONTEND_FORGE_API_KEY` - Bearer token for frontend API calls
  - Where to get: Manus project settings
  - Example: `your-frontend-api-key`

- [ ] `VITE_ANALYTICS_ENDPOINT` - Analytics service endpoint (optional)
  - Where to get: Your analytics provider
  - Example: `https://analytics.example.com`

- [ ] `VITE_ANALYTICS_WEBSITE_ID` - Analytics website ID (optional)
  - Where to get: Your analytics provider
  - Example: `your-website-id`

### Backend Variables (Node.js Server)
These are only used on the server and NOT exposed to the browser.

- [ ] `DATABASE_URL` - Turso/LibSQL database connection string
  - Where to get: Turso dashboard
  - Example: `libsql://xxx.turso.io?authToken=yyy`
  - ⚠️ **CRITICAL**: Must include `?authToken=` parameter

- [ ] `TURSO_AUTH_TOKEN` - Turso authentication token
  - Where to get: Turso dashboard
  - Example: `your-turso-auth-token`

- [ ] `JWT_SECRET` - Secret for signing session cookies
  - Where to get: Generate a random string
  - Example: `your-random-secret-key-min-32-chars`
  - Generate: `openssl rand -base64 32`

- [ ] `VITE_APP_ID` - Same as frontend (Manus OAuth App ID)
  - Where to get: Manus project settings
  - Example: `your-manus-app-id`

- [ ] `OAUTH_SERVER_URL` - Manus OAuth server endpoint
  - Where to get: Manus documentation
  - Example: `https://api.manus.im`

- [ ] `OWNER_OPEN_ID` - Your Manus account Open ID
  - Where to get: Manus account settings
  - Example: `your-open-id`

- [ ] `OWNER_NAME` - Your name (displayed in notifications)
  - Where to get: Your choice
  - Example: `Your Name`

- [ ] `BUILT_IN_FORGE_API_URL` - Manus APIs endpoint for backend
  - Where to get: Manus documentation
  - Example: `https://forge.manus.im`

- [ ] `BUILT_IN_FORGE_API_KEY` - Bearer token for backend API calls
  - Where to get: Manus project settings
  - Example: `your-backend-api-key`

- [ ] `NODE_ENV` - Environment mode (set to `production` for Vercel)
  - Where to get: Set manually
  - Example: `production`

## How to Add Environment Variables in Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project name
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. For each variable:
   - Enter the **Name** (e.g., `VITE_APP_ID`)
   - Enter the **Value**
   - Select which environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**
6. After adding all variables, click **Redeploy** to rebuild with new env vars

## Verification Steps

After setting all variables:

1. **Redeploy** the project in Vercel
2. **Check browser console** for errors (F12 → Console tab)
3. **Test login button** - should not show "Missing Configuration" alert
4. **Test register** - should not return JSON parsing errors
5. **Check Vercel logs** - go to Deployments → click latest → View Logs

## Common Issues & Fixes

### "TypeError: Invalid URL" in browser console
- **Cause**: `VITE_OAUTH_PORTAL_URL` or `VITE_APP_ID` is missing
- **Fix**: Add both variables and redeploy

### "Missing VITE_OAUTH_PORTAL_URL" in console
- **Cause**: Frontend env var not set
- **Fix**: Add `VITE_OAUTH_PORTAL_URL` to Vercel Environment Variables

### "Unexpected token 'A', ... is not valid JSON" error
- **Cause**: Backend returning plain text instead of JSON (usually error message)
- **Fix**: Check Vercel logs for actual error, add missing backend env vars

### "Cannot connect to database" error
- **Cause**: `DATABASE_URL` or `TURSO_AUTH_TOKEN` missing/incorrect
- **Fix**: Verify Turso credentials, ensure `?authToken=` is in DATABASE_URL

### Login doesn't work after register
- **Cause**: `OAUTH_SERVER_URL` or `VITE_OAUTH_PORTAL_URL` incorrect
- **Fix**: Verify both OAuth URLs are correct from Manus documentation

## Getting Help

If you're missing values:
1. Check Manus project settings for API keys and App ID
2. Check Turso dashboard for database credentials
3. Check your Manus account settings for OWNER_OPEN_ID
4. Generate JWT_SECRET: `openssl rand -base64 32`

## Security Notes

⚠️ **Important**: 
- Never commit `.env` files to GitHub
- Keep `JWT_SECRET` and API keys secret
- Vercel automatically encrypts environment variables
- Don't share your Vercel environment variable values
