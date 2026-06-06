# Complete Environment Variables Checklist for Vercel Deployment

## All Required Environment Variables (18 Total)

Copy and paste this checklist into your Vercel project settings. Check off each variable as you add it.

### Frontend Variables (VITE_* - Exposed to Browser)

These variables are built into the React app and visible in the browser.

| Variable | Required | Value | Where to Get | Status |
|----------|----------|-------|--------------|--------|
| `VITE_APP_ID` | ✅ YES | Your Manus App ID | Manus project settings | [ ] |
| `VITE_OAUTH_PORTAL_URL` | ✅ YES | `https://api.manus.im` | Manus documentation | [ ] |
| `VITE_FRONTEND_FORGE_API_URL` | ✅ YES | `https://forge.manus.im` | Manus documentation | [ ] |
| `VITE_FRONTEND_FORGE_API_KEY` | ✅ YES | Your frontend API key | Manus project settings | [ ] |
| `VITE_APP_TITLE` | ⚠️ Optional | `Student Assistance V15` | Your choice | [ ] |
| `VITE_APP_LOGO` | ⚠️ Optional | Logo URL | Your logo URL | [ ] |
| `VITE_ANALYTICS_ENDPOINT` | ⚠️ Optional | Analytics URL | Your analytics provider | [ ] |
| `VITE_ANALYTICS_WEBSITE_ID` | ⚠️ Optional | Analytics ID | Your analytics provider | [ ] |

### Backend Variables (Node.js Server - NOT Exposed)

These variables are only used on the server and never sent to the browser.

| Variable | Required | Value | Where to Get | Status |
|----------|----------|-------|--------------|--------|
| `DATABASE_URL` | ✅ YES | `libsql://xxx.turso.io?authToken=yyy` | Turso dashboard | [ ] |
| `TURSO_AUTH_TOKEN` | ✅ YES | Your Turso token | Turso dashboard | [ ] |
| `JWT_SECRET` | ✅ YES | Random 32-char string | Generate: `openssl rand -base64 32` | [ ] |
| `VITE_APP_ID` | ✅ YES | Same as frontend | Manus project settings | [ ] |
| `OAUTH_SERVER_URL` | ✅ YES | `https://api.manus.im` | Manus documentation | [ ] |
| `OWNER_OPEN_ID` | ✅ YES | Your Manus Open ID | Manus account settings | [ ] |
| `OWNER_NAME` | ✅ YES | Your name | Your choice | [ ] |
| `BUILT_IN_FORGE_API_URL` | ✅ YES | `https://forge.manus.im` | Manus documentation | [ ] |
| `BUILT_IN_FORGE_API_KEY` | ✅ YES | Your backend API key | Manus project settings | [ ] |
| `NODE_ENV` | ✅ YES | `production` | Set manually | [ ] |

## Step-by-Step Setup in Vercel

### 1. Open Vercel Project Settings
```
1. Go to https://vercel.com/dashboard
2. Click on your project: "student-assistance-v15-24"
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar
```

### 2. Add Each Variable
For each variable in the checklist above:
```
1. Click "Add New"
2. Enter Name: (e.g., VITE_APP_ID)
3. Enter Value: (the actual value)
4. Select Environments:
   ✅ Production
   ✅ Preview
   ✅ Development
5. Click "Save"
```

### 3. Redeploy After Adding Variables
```
1. Go to "Deployments" tab
2. Click the latest deployment
3. Click "Redeploy" button
4. Wait for build to complete
```

## Critical Environment Variables (Must Have)

These 4 variables are absolutely critical. Without them, the app will crash:

1. **VITE_APP_ID** - OAuth won't work without this
2. **DATABASE_URL** - Database connections will fail
3. **JWT_SECRET** - Session cookies won't work
4. **OAUTH_SERVER_URL** - Login will fail

## Getting Your Values

### From Manus
1. Go to your Manus project dashboard
2. Look for "Settings" or "Configuration"
3. Find:
   - App ID (VITE_APP_ID)
   - API Keys (VITE_FRONTEND_FORGE_API_KEY, BUILT_IN_FORGE_API_KEY)
   - Your Open ID (OWNER_OPEN_ID)

### From Turso
1. Go to https://turso.tech/app
2. Click your database
3. Find:
   - Connection string (DATABASE_URL) - copy the full URL with ?authToken=
   - Auth token (TURSO_AUTH_TOKEN)

### Generate Yourself
For JWT_SECRET, run this command in terminal:
```bash
openssl rand -base64 32
```
Copy the output and paste it as JWT_SECRET value.

## Troubleshooting

### "Missing required environment variables" Error
- **Cause**: One or more env vars not set in Vercel
- **Fix**: Check the error message for which vars are missing, add them to Vercel

### "Unexpected token 'A', ... is not valid JSON" Error
- **Cause**: Backend crashed due to missing env vars, returned plain text
- **Fix**: Add all required environment variables and redeploy

### "Cannot connect to database" Error
- **Cause**: DATABASE_URL or TURSO_AUTH_TOKEN is wrong
- **Fix**: Verify the values in Turso dashboard, make sure ?authToken= is included

### "OAuth login doesn't work" Error
- **Cause**: VITE_APP_ID or OAUTH_SERVER_URL is missing/wrong
- **Fix**: Verify both values from Manus documentation

### "Cannot authenticate" Error
- **Cause**: JWT_SECRET is missing or changed
- **Fix**: Set JWT_SECRET to a consistent value (don't change it after users login)

## Environment Variables Validation

The application validates all critical environment variables on startup:
- If any critical var is missing in production, the app will fail to start
- If any critical var is missing in development, you'll see a warning

This is intentional - it ensures the app never runs with incomplete configuration.

## Security Notes

⚠️ **Important Security Practices**:
1. Never commit `.env` files to GitHub
2. Never share your environment variable values
3. Vercel automatically encrypts all environment variables
4. Use different values for production and development if possible
5. Rotate API keys periodically
6. Keep JWT_SECRET secret and consistent

## Quick Reference

**Minimum variables to get started:**
- VITE_APP_ID
- VITE_OAUTH_PORTAL_URL
- DATABASE_URL
- TURSO_AUTH_TOKEN
- JWT_SECRET
- OAUTH_SERVER_URL
- BUILT_IN_FORGE_API_URL
- BUILT_IN_FORGE_API_KEY
- OWNER_OPEN_ID
- OWNER_NAME

**Optional but recommended:**
- VITE_APP_TITLE
- VITE_APP_LOGO
- NODE_ENV (set to "production")

## Verification After Setup

After adding all variables and redeploying:

1. **Check Vercel Logs**:
   - Go to Deployments → Latest → View Logs
   - Should NOT see "Missing required environment variables"

2. **Test in Browser**:
   - Open your Vercel URL
   - Should see the login page (not an error)
   - Try clicking "เข้าสู่ระบบ" button
   - Should redirect to Manus OAuth login (not error)

3. **Check Console**:
   - Open browser DevTools (F12)
   - Go to Console tab
   - Should NOT see "Missing VITE_OAUTH_PORTAL_URL" or similar errors

## Still Having Issues?

If you've added all variables and still seeing errors:

1. **Check the exact error message** in Vercel logs
2. **Verify each value** matches exactly (no extra spaces)
3. **Redeploy** after adding variables (changes don't apply automatically)
4. **Clear browser cache** (Ctrl+Shift+Delete or Cmd+Shift+Delete)
5. **Wait 5 minutes** for Vercel CDN to update

If issues persist, check:
- Are the values correct? (copy-paste from source)
- Are the variable names spelled correctly? (case-sensitive)
- Did you select all three environments? (Production, Preview, Development)
- Did you click "Redeploy" after adding variables?
