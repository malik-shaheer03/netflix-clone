# Security Headers Fix - Deployment Guide

## What Was Fixed

Your Netflix Clone was showing security warnings because it was missing essential security headers. This fix implements industry-standard security configurations.

### Security Headers Added

1. **X-Content-Type-Options: nosniff**
   - Prevents MIME-type sniffing attacks
   - Ensures browsers follow the correct content type

2. **X-Frame-Options: SAMEORIGIN**
   - Prevents clickjacking attacks
   - Only allows embedding in same-origin frames

3. **X-XSS-Protection: 1; mode=block**
   - Enables browser XSS protection
   - Blocks page if XSS attack is detected

4. **Strict-Transport-Security (HSTS)**
   - Forces HTTPS connections for 1 year
   - Prevents man-in-the-middle attacks

5. **Content-Security-Policy (CSP)**
   - Restricts resource loading origins
   - Prevents inline script injection
   - Configured for Firebase and TMDB APIs

6. **Referrer-Policy**
   - Controls referrer information
   - Only sends referrer on same-origin requests

7. **Permissions-Policy**
   - Disables unnecessary permissions (geolocation, camera, microphone)

## Deployment Steps for Vercel

### 1. Update Environment Variables
Add these to your Vercel project settings (Environment Variables):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value
NEXT_PUBLIC_TMDB_API_KEY=your_value
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app
```

### 2. Push Changes to GitHub
```bash
git add .
git commit -m "Security: Add comprehensive security headers and fix browser warnings"
git push origin main
```

### 3. Redeploy on Vercel
- Go to your Vercel dashboard
- Click "Deployments"
- Click "Redeploy" on the latest deployment, or push a new commit to trigger auto-deployment

### 4. Verify Security Headers
After deployment, verify headers using:
- https://securityheaders.com (paste your Vercel URL)
- Browser DevTools > Network tab > Response Headers

## What These Headers Protect Against

| Header | Protection |
|--------|-----------|
| X-Content-Type-Options | MIME sniffing attacks |
| X-Frame-Options | Clickjacking attacks |
| X-XSS-Protection | Cross-site scripting |
| HSTS | Man-in-the-middle attacks |
| CSP | Inline script injection, XSS |
| Referrer-Policy | Information leakage |
| Permissions-Policy | Unauthorized API access |

## Additional Security Recommendations

1. **Keep Dependencies Updated**
   ```bash
   npm outdated
   npm update
   ```

2. **Use HTTPS Only**
   - Vercel automatically uses HTTPS
   - Enable "Redirect to HTTPS" in Vercel settings

3. **Monitor Security**
   - Regular security audits with `npm audit`
   - Monitor Vercel analytics for suspicious activity

4. **Hide Sensitive Information**
   - Never commit `.env.local`
   - Use Vercel Environment Variables for all secrets

## Testing Locally

After these changes, test locally:
```bash
npm run build
npm run start
```

Visit `http://localhost:3000` and check browser console for any CSP warnings.

## Troubleshooting

### Issue: "Refused to load script/style"
**Solution**: Update CSP in `next.config.mjs` to include the blocked resource domain

### Issue: "Frame is blocked by X-Frame-Options"
**Solution**: This is expected behavior. Only allow embedding if necessary by changing `SAMEORIGIN` to specific origins

### Issue: Firebase not loading
**Solution**: Verify Firebase domains are included in CSP `connect-src` directive

---

Your site is now protected with modern security standards! ✅
