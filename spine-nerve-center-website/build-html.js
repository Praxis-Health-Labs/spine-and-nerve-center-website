const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Read the layout template
const layoutPath = 'src/layouts/default.html';
const layoutTemplate = fs.readFileSync(layoutPath, 'utf8');

// Read all partials
const partials = {
  header: fs.readFileSync('src/partials/header.html', 'utf8'),
  footer: fs.readFileSync('src/partials/footer.html', 'utf8'),
  'mobile-menu': fs.existsSync('src/partials/mobile-menu.html') 
    ? fs.readFileSync('src/partials/mobile-menu.html', 'utf8')
    : ''
};

// Function to process a single HTML file
function processFile(inputPath, outputPath) {
  console.log(`Processing: ${inputPath}`);
  
  // Read the source file
  const content = fs.readFileSync(inputPath, 'utf8');
  
  // Extract front matter and body content
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    console.warn(`  ⚠️  No front matter found in ${inputPath}, skipping...`);
    return;
  }
  
  // Parse front matter
  const frontMatter = {};
  const frontMatterLines = match[1].split('\n');
  
  frontMatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontMatter[key] = value;
    }
  });
  
  // Get the page content (everything after front matter)
  const pageContent = match[2].trim();
  
  // Start with the layout template
  let html = layoutTemplate;
  
  // Replace front matter variables
  Object.keys(frontMatter).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, frontMatter[key]);
  });
  
  // Replace the body content - THIS IS THE KEY PART!
  html = html.replace('{{{body}}}', pageContent);
  
  // Replace partials
  Object.keys(partials).forEach(partialName => {
    const partialRegex = new RegExp(`{{>\\s*${partialName}\\s*}}`, 'g');
    html = html.replace(partialRegex, partials[partialName]);
  });
  
  // Create output directory if needed
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the processed file
  fs.writeFileSync(outputPath, html);
  console.log(`  ✅ Written to: ${outputPath}`);
  
  // Log file size to verify content was added
  const stats = fs.statSync(outputPath);
  const fileSizeInKb = (stats.size / 1024).toFixed(1);
  console.log(`  📊 File size: ${fileSizeInKb} KB`);
}

// Function to process a directory recursively
function processDirectory(inputDir, outputDir) {
  const items = fs.readdirSync(inputDir);
  
  items.forEach(item => {
    const inputPath = path.join(inputDir, item);
    const outputPath = path.join(outputDir, item);
    const stat = fs.statSync(inputPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }
      processDirectory(inputPath, outputPath);
    } else if (item.endsWith('.html')) {
      // Process HTML files
      processFile(inputPath, outputPath);
    }
  });
}

// Main build process
console.log('🚀 Starting HTML build...\n');
console.log('📁 Source: src/pages');
console.log('📁 Output: dist\n');

try {
  processDirectory('src/pages', 'dist');
  console.log('\n✨ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}