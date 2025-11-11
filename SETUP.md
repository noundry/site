# Noundry Site - Vite Setup Guide

This project uses Vite with a custom template system for building a multi-page static site for deployment to Netlify.

## Project Structure

```
.
├── templates/          # Shared template components
│   ├── head.html      # Common <head> content (meta tags, scripts, styles)
│   ├── header.html    # Navigation bar
│   └── footer.html    # Site footer
├── assets/            # Static assets (images, fonts, etc.)
├── *.html             # Your HTML pages
├── build.js           # Custom build script
├── vite.config.js     # Vite configuration (for dev server)
├── netlify.toml       # Netlify deployment configuration
└── package.json       # Project dependencies and scripts
```

## Template System

### How It Works

The template system uses placeholders in your HTML files that get replaced with shared components during the build process:

- `<%= head %>` - Injects common head content
- `<%= header %>` - Injects the navigation header
- `<%= footer %>` - Injects the site footer

### Creating a New Page with Templates

Create a new HTML file with this structure:

```html
<!DOCTYPE html>
<html lang="en" x-data="{ darkMode: false }" x-init="$watch('darkMode', val => localStorage.setItem('darkMode', val))" :class="{ 'dark': darkMode }">
<head>
    <title>Your Page Title - Noundry</title>
    <%= head %>
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
    <%= header %>

    <!-- Your page-specific content goes here -->
    <section class="pt-20 pb-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1>Your Content</h1>
        </div>
    </section>

    <%= footer %>
</body>
</html>
```

See `example-template.html` for a working example.

### Updating Templates

To update the header, footer, or head content for all pages:

1. Edit the corresponding file in the `templates/` directory
2. Run `npm run build` - changes will apply to all pages that use templates

### Converting Existing Pages

Your existing HTML pages work as-is without templates. To add template support:

1. Replace the `<head>` content (after `<title>`) with `<%= head %>`
2. Replace the navigation section with `<%= header %>`
3. Replace the footer section with `<%= footer %>`

## Available Commands

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Build using Vite (alternative)
npm run build:vite

# Preview production build locally
npm run preview
```

## Development

```bash
# Start the dev server
npm run dev
```

The development server will start at http://localhost:5173 with hot module reloading.

## Building for Production

```bash
npm run build
```

This runs the custom `build.js` script which:
1. Creates a fresh `dist/` directory
2. Processes all HTML files
3. Injects templates where placeholders exist
4. Copies the `assets/` directory
5. Outputs everything to `dist/`

The `dist/` folder is ready for deployment.

## Deploying to Netlify

### Option 1: Connect Git Repository (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Log in to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your Git provider and select your repository
5. Netlify will auto-detect the `netlify.toml` configuration
6. Click "Deploy site"

Netlify will automatically:
- Run `npm run build` on each push
- Publish the `dist/` directory
- Set up continuous deployment

### Option 2: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your site
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Custom Domain

After deployment:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow Netlify's DNS configuration instructions

## Netlify Configuration

The `netlify.toml` file includes:

- Build command: `npm run build`
- Publish directory: `dist`
- Security headers
- Asset caching (1 year for static assets)

You can customize redirects, headers, and other settings in `netlify.toml`.

## Notes

- The build script handles all HTML files in the root directory
- Template injection is simple string replacement (no strict HTML parsing)
- Existing pages without template placeholders are copied as-is
- The Vite dev server (`npm run dev`) works for development
- The custom build script is used for production builds

## Troubleshooting

### Build Issues

If you encounter build errors:
1. Check that all template files exist in `templates/`
2. Ensure placeholders use exact syntax: `<%= head %>`, `<%= header %>`, `<%= footer %>`
3. Run `npm run build` to see detailed error messages

### Assets Not Loading

- Ensure assets are in the `assets/` directory
- Check asset paths use relative URLs (e.g., `assets/image.png`)
- After build, verify assets copied to `dist/assets/`

### Changes Not Reflecting

- Clear browser cache or do a hard refresh (Ctrl+F5)
- Check that you're editing source files, not files in `dist/`
- Rebuild: `npm run build`

## Need Help?

- Check the example file: `example-template.html`
- Review existing templates in `templates/` directory
- Consult [Netlify Documentation](https://docs.netlify.com)
