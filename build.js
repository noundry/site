import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, cpSync, rmSync } from 'fs';
import { resolve, join } from 'path';

console.log('🏗️  Building site...\n');

// Clean dist directory
if (existsSync('dist')) {
  rmSync('dist', { recursive: true });
}
mkdirSync('dist');

// Read templates
const headTemplate = readFileSync('templates/head.html', 'utf-8');
const headerTemplate = readFileSync('templates/header.html', 'utf-8');
const footerTemplate = readFileSync('templates/footer.html', 'utf-8');

// Get all HTML files
const htmlFiles = readdirSync('.').filter(f => f.endsWith('.html'));

console.log(`📄 Processing ${htmlFiles.length} HTML files...\n`);

let processedCount = 0;

htmlFiles.forEach(file => {
  try {
    let content = readFileSync(file, 'utf-8');

    // Check if file uses template placeholders
    if (content.includes('<%= head %>') ||
        content.includes('<%= header %>') ||
        content.includes('<%= footer %>')) {

      // Replace template placeholders
      content = content.replace(/<%= head %>/g, headTemplate);
      content = content.replace(/<%= header %>/g, headerTemplate);
      content = content.replace(/<%= footer %>/g, footerTemplate);

      console.log(`✓ ${file} (with templates)`);
    } else {
      console.log(`✓ ${file} (no templates)`);
    }

    // Write to dist
    writeFileSync(join('dist', file), content, 'utf-8');
    processedCount++;

  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

// Copy assets directory
if (existsSync('assets')) {
  console.log('\n📦 Copying assets...');
  cpSync('assets', 'dist/assets', { recursive: true });
  console.log('✓ Assets copied');
}

console.log(`\n✅ Build complete! ${processedCount} files processed.`);
console.log(`📁 Output directory: dist/`);
console.log(`\n🚀 Ready to deploy to Netlify!`);
