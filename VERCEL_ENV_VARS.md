# Production Environment Variables Checklist

## Critical Variables for Vercel Deployment

### Authentication (Required)

```bash
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://cloakroom-26.vercel.app
```

**Important:**
- `NEXTAUTH_SECRET` must be a secure random string (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL` must match your production domain exactly (no trailing slash)
- Both must be set in Vercel Project Settings → Environment Variables

### Database (Required)

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cloakroom?retryWrites=true&w=majority
```

### How to Set in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable for **Production** environment
4. Redeploy after adding variables

### Verify Deployment

After setting variables:
1. Go to **Deployments** tab
2. Click on latest deployment
3. Check **Build Logs** for any auth errors
4. Check **Function Logs** for runtime errors

### Common Issues

**Problem:** Login works but redirects back to login page
- **Cause:** `NEXTAUTH_URL` not set or incorrect
- **Fix:** Set to exact production URL: `https://cloakroom-26.vercel.app`

**Problem:** "Configuration error" on login
- **Cause:** `NEXTAUTH_SECRET` not set
- **Fix:** Generate and set secret: `openssl rand -base64 32`

**Problem:** Cookies not persisting
- **Cause:** Cookie settings incompatible with domain
- **Fix:** Ensure `trustHost: true` in auth config (already set)

### Testing Checklist

- [ ] Can access /admin/login
- [ ] Can submit login form
- [ ] After login, redirected to /admin (not back to /admin/login)
- [ ] /api/auth/session returns user data
- [ ] Can access protected admin pages
- [ ] Logout works correctly
