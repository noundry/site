import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { resolve } from 'path';

console.log('🔄 Converting HTML files to use templates...\n');

// Create backup directory
if (!existsSync('html-backup')) {
  mkdirSync('html-backup');
}

// Get all HTML files except our example templates
const files = readdirSync(process.cwd()).filter(f =>
  f.endsWith('.html') &&
  !f.startsWith('example-') &&
  !f.startsWith('build-test')
);

console.log(`Found ${files.length} HTML files to convert...\n`);

// Backup all files first
files.forEach(file => {
  copyFileSync(file, `html-backup/${file}`);
});
console.log('✓ Backup created in html-backup/ directory\n');

let convertedCount = 0;

files.forEach(file => {
  try {
    const filePath = resolve(process.cwd(), file);
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Step 1: Replace the head content (between </title> and </head>) with <%= head %>
    const headPattern = /(<title>.*?<\/title>)([\s\S]*?)(<\/head>)/i;
    if (headPattern.test(content)) {
      content = content.replace(headPattern, (match, titleTag, headContent, closeHead) => {
        // Check if not already using template
        if (!headContent.includes('<%= head %>')) {
          modified = true;
          return `${titleTag}\n    <%= head %>\n${closeHead}`;
        }
        return match;
      });
    }

    // Step 2: Replace navigation/header (from <!-- Navigation --> to </nav> including mobile menu)
    const navPattern = /\s*<!-- Navigation -->[\s\S]*?<\/nav>\s*/i;
    if (navPattern.test(content)) {
      content = content.replace(navPattern, (match) => {
        // Check if not already using template
        if (!match.includes('<%= header %>')) {
          modified = true;
          return '\n    <%= header %>\n\n    ';
        }
        return match;
      });
    }

    // Step 3: Replace footer (from <!-- Footer --> to end of body/html)
    const footerPattern = /\s*<!-- Footer -->[\s\S]*?(<\/body>\s*<\/html>)/i;
    if (footerPattern.test(content)) {
      content = content.replace(footerPattern, (match, closingTags) => {
        // Check if not already using template
        if (!match.includes('<%= footer %>')) {
          modified = true;
          return `\n    <%= footer %>\n${closingTags}`;
        }
        return match;
      });
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ Converted: ${file}`);
      convertedCount++;
    } else {
      console.log(`- Skipped (already using templates or no matches): ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

console.log(`\n✅ Completed! Converted ${convertedCount} file(s).`);
console.log('📁 Original files backed up to html-backup/');
console.log('\n🔍 Next steps:');
console.log('1. Run: npm run build');
console.log('2. Check dist/ folder');
console.log('3. If something looks wrong, restore from html-backup/');
