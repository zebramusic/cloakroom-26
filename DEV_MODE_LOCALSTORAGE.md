# localStorage Fix for Node.js v25+

## Issue (FIXED ✅)

Node.js v25.3.0 introduced experimental webstorage API that conflicts with Next.js development mode, causing:
```
TypeError: localStorage.getItem is not a function
Warning: `--localstorage-file` was provided without a valid path
GET / 500
```

## Root Cause

Node.js v25+ has experimental `localStorage` implementation enabled by default, but it's incompatible with Next.js's SSR environment. The implementation exists as an object but `getItem`/`setItem` are not proper functions.

## Solution ✅

Disable Node.js experimental webstorage in development:

**package.json:**
```json
"scripts": {
  "dev": "NODE_OPTIONS='--no-experimental-webstorage' next dev",
  "build": "next build",
  "start": "next start"
}
```

## Verification

```bash
npm run dev
# ✅ No localStorage errors
# ✅ GET / 200
# ✅ All features working
```

## Impact

- ✅ **Development mode**: Works perfectly, no errors
- ✅ **Production build**: Unaffected (doesn't use this flag)
- ✅ **Browser functionality**: Cart persists, all features operational
- ✅ **Vercel deployment**: No impact (production build used)

## Why This Works

The `--no-experimental-webstorage` flag tells Node.js to not load its experimental localStorage implementation, allowing our client-side localStorage code to work without interference during SSR.

## Alternative Solutions (if needed)

If you can't modify `package.json`, set the environment variable directly:
```bash
export NODE_OPTIONS='--no-experimental-webstorage'
npm run dev
```

Or use an older Node version (< v25):
```bash
nvm use 20  # or 22
npm run dev
```

## Related Files

- `package.json` - Contains the fix in dev script
- `src/lib/store/cart.store.ts` - Cart store with SSR-safe localStorage
- `src/components/shared/CartStoreHydration.tsx` - Client-side hydration

## Status: RESOLVED ✅

Development mode now works without any localStorage errors.
