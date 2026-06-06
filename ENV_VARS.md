# Environment Variables Required for Vercel Deployment

## Frontend Environment Variables (VITE_*)

These variables are used by the React frontend and must be set in Vercel project settings:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_APP_ID` | ✅ Yes | Manus OAuth Application ID | `your-app-id-here` |
| `VITE_OAUTH_PORTAL_URL` | ✅ Yes | Manus OAuth Portal URL | `https://api.manus.im` |
| `VITE_FRONTEND_FORGE_API_URL` | ✅ Yes | Manus Built-in APIs URL for frontend | `https://forge.manus.im` |
| `VITE_FRONTEND_FORGE_API_KEY` | ✅ Yes | Bearer token for frontend Manus APIs | `your-frontend-key` |
| `VITE_ANALYTICS_ENDPOINT` | ⚠️ Optional | Analytics endpoint URL | `https://analytics.manus.im` |
| `VITE_ANALYTICS_WEBSITE_ID` | ⚠️ Optional | Analytics website ID | `your-website-id` |
| `VITE_APP_TITLE` | ⚠️ Optional | Website title | `Student Assistance V15` |
| `VITE_APP_LOGO` | ⚠️ Optional | Website logo URL | `https://example.com/logo.png` |

## Backend Environment Variables

These variables are used by the Node.js backend and must be set in Vercel project settings:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | Turso/LibSQL database connection string | `libsql://xxx.turso.io?authToken=yyy` |
| `TURSO_AUTH_TOKEN` | ✅ Yes | Turso authentication token | `your-turso-token` |
| `JWT_SECRET` | ✅ Yes | Secret for session cookie signing | `your-jwt-secret` |
| `VITE_APP_ID` | ✅ Yes | Manus OAuth Application ID (same as frontend) | `your-app-id-here` |
| `OAUTH_SERVER_URL` | ✅ Yes | Manus OAuth Server URL | `https://api.manus.im` |
| `OWNER_OPEN_ID` | ✅ Yes | Owner's Manus Open ID | `owner-open-id` |
| `OWNER_NAME` | ✅ Yes | Owner's name | `Your Name` |
| `BUILT_IN_FORGE_API_URL` | ✅ Yes | Manus Built-in APIs URL for backend | `https://forge.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | ✅ Yes | Bearer token for backend Manus APIs | `your-backend-key` |
| `NODE_ENV` | ✅ Yes | Environment mode | `production` |

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select which environments it applies to (Production, Preview, Development)
5. Click **Save**
6. Redeploy your project

## Troubleshooting

### "TypeError: Invalid URL" Error
- **Cause**: `VITE_OAUTH_PORTAL_URL` or `VITE_APP_ID` is missing or undefined
- **Fix**: Ensure both variables are set in Vercel Environment Variables

### "Cannot connect to database" Error
- **Cause**: `DATABASE_URL` or `TURSO_AUTH_TOKEN` is missing
- **Fix**: Verify Turso database credentials are correctly set

### Login button doesn't work
- **Cause**: `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`, or `OAUTH_SERVER_URL` is missing
- **Fix**: Check all OAuth-related environment variables are set

## Getting Your Values

### From Manus
- `VITE_APP_ID`: From Manus project settings
- `VITE_OAUTH_PORTAL_URL`: Usually `https://api.manus.im`
- `OAUTH_SERVER_URL`: Usually `https://api.manus.im`
- `BUILT_IN_FORGE_API_URL`: Usually `https://forge.manus.im`
- `VITE_FRONTEND_FORGE_API_KEY`: From Manus project settings
- `BUILT_IN_FORGE_API_KEY`: From Manus project settings
- `OWNER_OPEN_ID`: From Manus account settings
- `OWNER_NAME`: Your name

### From Turso
- `DATABASE_URL`: From Turso database connection string
- `TURSO_AUTH_TOKEN`: From Turso authentication token

### Generate Yourself
- `JWT_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`)
