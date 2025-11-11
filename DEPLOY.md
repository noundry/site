# Netlify Deployment Checklist

## Before You Push

- [x] Build works locally: `npm run build` ✅
- [x] `dist/` folder contains all HTML files ✅
- [x] `netlify.toml` is in repo root ✅
- [x] Test page created: `build-test.html` ✅

## Netlify Dashboard Settings

### Check Your Site Settings

1. Go to: `https://app.netlify.com/sites/YOUR-SITE-NAME/settings/deploys`

2. Under **Build settings**, verify:

   ```
   Build command: npm run build
   Publish directory: dist
   ```

   **Important:** These can be:
   - Set in the dashboard (will override netlify.toml)
   - Left EMPTY (will use netlify.toml) ← Recommended
   - Set in netlify.toml (our approach)

### Recommendation

**Clear the dashboard settings** (leave them empty) so `netlify.toml` is the single source of truth.

## Deployment Steps

### Option 1: Push to Main (Production Deploy)

```bash
# Stage all changes
git add .

# Commit
git commit -m "Add Vite build system with template support"

# Push
git push origin main
```

Netlify will automatically:
1. Detect the push
2. Run `npm install`
3. Run `npm run build`
4. Publish the `dist/` directory

### Option 2: Test with Deploy Preview (Safer)

```bash
# Create a new branch
git checkout -b test-vite-setup

# Stage and commit
git add .
git commit -m "Add Vite build system with template support"

# Push to new branch
git push origin test-vite-setup
```

Then create a Pull Request on GitHub. Netlify will create a **Deploy Preview** that you can test before merging.

## After Deployment

### Verify Your Deployment

1. **Check the build test page:**
   - Visit: `https://your-site.netlify.app/build-test.html`
   - Should see a green success message
   - If you see this, everything works! ✅

2. **Check your homepage:**
   - Visit: `https://your-site.netlify.app/`
   - Verify it loads correctly

3. **Check the example template page:**
   - Visit: `https://your-site.netlify.app/example-template.html`
   - Verify header and footer are injected

4. **Check assets:**
   - Look for images, logos, favicons
   - Open browser dev tools → Network tab
   - Verify no 404 errors

### Netlify Build Log

If something goes wrong, check the build log in Netlify:

1. Go to **Deploys** tab
2. Click on the latest deploy
3. Click **Deploy log**

Look for:
- ✅ `npm install` succeeded
- ✅ `npm run build` succeeded
- ✅ Files published to `dist/`

## Common Issues

### Issue: "Build command not found"

**Cause:** Netlify doesn't see `netlify.toml` or dashboard settings are wrong

**Fix:**
- Verify `netlify.toml` is in repo root
- Check it's committed to git
- Clear dashboard build settings

### Issue: "No such file or directory: dist"

**Cause:** Build command failed or published wrong directory

**Fix:**
- Check build log for errors
- Verify `npm run build` works locally
- Ensure publish directory is `dist` not `dist/`

### Issue: "404 - Page Not Found"

**Cause:** HTML files not in published directory

**Fix:**
- Check build log shows: "✅ Build complete! 39 files processed"
- Verify `dist/` folder has HTML files
- Check publish directory is `dist`

### Issue: Assets (images, CSS) not loading

**Cause:** Asset paths are incorrect after build

**Fix:**
- Check asset paths in HTML use relative paths: `assets/logo.png`
- Verify `assets/` folder copied to `dist/`
- Check build log shows: "✓ Assets copied"

## Environment Variables

If you need environment variables in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Add your variables (e.g., API keys)
3. Access in your build script if needed

## Cleanup After Successful Deploy

Once everything works:

```bash
# Remove the test file
rm build-test.html
rm DEPLOY.md  # Optional: remove this checklist

# Commit
git add .
git commit -m "Remove test files"
git push
```

## Current Configuration Summary

- **Repository:** https://github.com/noundry/site.git
- **Build command:** `npm run build` (via build.js)
- **Publish directory:** `dist`
- **Node version:** 20 (specified in netlify.toml)
- **HTML pages:** 39 files
- **Assets:** In `assets/` folder
- **Template system:** Optional (use `<%= head %>`, `<%= header %>`, `<%= footer %>`)

## Need Help?

- Check Netlify build logs
- Review `SETUP.md` for template usage
- Test locally: `npm run build` then check `dist/` folder
