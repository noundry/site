import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Read template files
const headTemplate = readFileSync(resolve(process.cwd(), 'templates/head.html'), 'utf-8');
const headerTemplate = readFileSync(resolve(process.cwd(), 'templates/header.html'), 'utf-8');
const footerTemplate = readFileSync(resolve(process.cwd(), 'templates/footer.html'), 'utf-8');

// Custom plugin to inject templates using string replacement
const injectTemplatesPlugin = () => {
  return {
    name: 'inject-templates',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        // Replace template placeholders
        let result = html;
        result = result.replace(/<%= head %>/g, headTemplate);
        result = result.replace(/<%= header %>/g, headerTemplate);
        result = result.replace(/<%= footer %>/g, footerTemplate);

        return result;
      }
    }
  };
};

export default defineConfig({
  plugins: [
    injectTemplatesPlugin()
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // Start with just the example template to test
        'example-template': resolve(process.cwd(), 'example-template.html')
      }
    }
  },
  server: {
    open: true
  }
});
