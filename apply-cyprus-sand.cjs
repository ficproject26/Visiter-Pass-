const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const replacements = [
  // Dark Backgrounds (Slate -> Cyprus)
  { search: /#0f172a/gi, replace: '#08262b' }, // slate-900 -> cyprus base
  { search: /#1e293b/gi, replace: '#0b333a' }, // slate-800 -> cyprus surface
  { search: /#334155/gi, replace: '#124851' }, // slate-700 -> cyprus raised
  
  // Light Backgrounds (Slate-50 -> Sand)
  { search: /#f8fafc/gi, replace: '#f5efe6' }, // slate-50 -> sand base
  { search: /#ffffff/gi, replace: '#fbfaf8' }, // white -> sand surface
  { search: /#f1f5f9/gi, replace: '#ebe0cd' }, // slate-100 -> sand raised
  { search: /#e2e8f0/gi, replace: '#dfceb3' }, // slate-200 -> sand dark border

  // Text Colors
  { search: /#94a3b8/gi, replace: '#8b9d99' }, // slate-400
  { search: /#64748b/gi, replace: '#637a77' }, // slate-500
  { search: /#475569/gi, replace: '#445b59' }, // slate-600

  // Accents (Teal -> Sand/Cyprus)
  // For dark mode, accent is sand. For light mode, accent is cyprus.
  // Wait, I replaced all accents with #0d9488 and #06b6d4 earlier.
  // In index.css, --dark-accent is #0d9488. I'll just change the css variables and classes.
  { search: /#0d9488/gi, replace: '#d6b68a' }, // teal-600 -> sand accent
  { search: /#06b6d4/gi, replace: '#c8a26c' }, // cyan-500 -> sand dark accent
  { search: /#0f766e/gi, replace: '#a37f4a' }, // teal-700
  { search: /#115e59/gi, replace: '#856335' }, // teal-800
];

const rgbaReplacements = [
  // Dark rgb base (15, 23, 42) -> (8, 38, 43)
  { search: /rgba\(15,\s*23,\s*42,/gi, replace: 'rgba(8, 38, 43,' },
  // Light rgb base (248, 250, 252) -> (245, 239, 230)
  { search: /rgba\(248,\s*250,\s*252,/gi, replace: 'rgba(245, 239, 230,' },
  // Teal rgb (13, 148, 136) -> Sand rgb (214, 182, 138)
  { search: /rgba\(13,\s*148,\s*136,/gi, replace: 'rgba(214, 182, 138,' },
  // Cyan rgb (6, 182, 212) -> Sand dark rgb (200, 162, 108)
  { search: /rgba\(6,\s*182,\s*212,/gi, replace: 'rgba(200, 162, 108,' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  rgbaReplacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  fs.writeFileSync(filePath, content, 'utf8');
}

processFile(path.join(dir, 'index.css'));
processFile(path.join(dir, 'components', 'Landing', 'LandingPage.css'));
processFile(path.join(dir, 'components', 'UI', 'ThemeToggle.css'));

// Now manually tweak index.css to ensure light theme accents are Cyprus instead of Sand.
let indexContent = fs.readFileSync(path.join(dir, 'index.css'), 'utf8');

// For light theme variables
indexContent = indexContent.replace(/--light-accent:\s*#d6b68a;/gi, '--light-accent: #0a3a42;');
indexContent = indexContent.replace(/--light-accent-2:\s*#c8a26c;/gi, '--light-accent-2: #0d4f59;');
indexContent = indexContent.replace(/--light-accent-glow:rgba\(214,\s*182,\s*138,\s*0\.15\);/gi, '--light-accent-glow:rgba(10, 58, 66, 0.15);');

// Buttons for light theme
indexContent = indexContent.replace(/\[data-theme="light"\] \.btn-primary \{\s*background: linear-gradient\(135deg, #d6b68a 0%, #a37f4a 100%\) !important;/g, '[data-theme="light"] .btn-primary {\n  background: linear-gradient(135deg, #0a3a42 0%, #0d4f59 100%) !important;');
indexContent = indexContent.replace(/\[data-theme="light"\] \.btn-primary:hover \{\s*background: linear-gradient\(135deg, #856335 0%, #d6b68a 100%\) !important;/g, '[data-theme="light"] .btn-primary:hover {\n  background: linear-gradient(135deg, #0d4f59 0%, #116875 100%) !important;');
indexContent = indexContent.replace(/\[data-theme="light"\] \.btn-primary:active \{\s*background: linear-gradient\(135deg, #a37f4a 0%, #d6b68a 100%\) !important;/g, '[data-theme="light"] .btn-primary:active {\n  background: linear-gradient(135deg, #082c33 0%, #0a3a42 100%) !important;');

fs.writeFileSync(path.join(dir, 'index.css'), indexContent, 'utf8');

console.log('Applied Cyprus and Sand theme.');
