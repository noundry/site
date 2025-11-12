import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

console.log('🧹 Cleaning up duplicate meta tags...\n');

// Get all HTML files
const files = readdirSync(process.cwd()).filter(f =>
  f.endsWith('.html') &&
  !f.startsWith('build-test')
);

let cleanedCount = 0;

files.forEach(file => {
  try {
    const filePath = resolve(process.cwd(), file);
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Check if file uses head template
    if (content.includes('<%= head %>')) {
      let original = content;

      // Remove lines 4-5 if they contain the duplicate meta tags
      // Pattern: Remove meta charset and viewport that come BEFORE <%= head %>
      content = content.replace(
        /(<head>\s*)\s*<meta charset="UTF-8">\s*<meta name="viewport"[^>]*>\s*(\s*<title>)/gi,
        '$1$2'
      );

      if (content !== original) {
        modified = true;
      }
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Cleaned: ${file}`);
      cleanedCount++;
    }
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

console.log(`\n✅ Cleaned ${cleanedCount} file(s).`);

if (cleanedCount > 0) {
  console.log('\n🔍 Run build to see the changes:');
  console.log('   npm run build');
}
