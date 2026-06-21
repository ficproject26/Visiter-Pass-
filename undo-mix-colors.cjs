const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');
const indexFile = path.join(dir, 'index.css');

let content = fs.readFileSync(indexFile, 'utf8');

// Reverse 1. Hero Gradient Text
// Dark mode
content = content.replace(/linear-gradient\(90deg, #f5efe6 0%, #d6b68a 50%, #0a3a42 100%\)/g, 'linear-gradient(90deg, #f5efe6 0%, #c8a26c 60%, #d6b68a 100%)');
// Light mode
content = content.replace(/linear-gradient\(90deg, #0a3a42 0%, #08262b 50%, #d6b68a 100%\)/g, 'linear-gradient(90deg, #d6b68a 0%, #c8a26c 100%)');

// Reverse 2. Security Gradient Text
content = content.replace(/linear-gradient\(90deg, #d6b68a, #0a3a42\)/g, 'linear-gradient(90deg, #d6b68a, #c8a26c)');
content = content.replace(/linear-gradient\(90deg, #d6b68a, #0a3a42, #d6b68a\)/g, 'linear-gradient(90deg, #d6b68a, #a37f4a, #d6b68a)');

// Reverse 3. Primary Button Dark
content = content.replace(/\[data-theme="dark"\] \.btn-primary\s*\{\s*background: linear-gradient\(135deg, #0a3a42 0%, #d6b68a 100%\) !important;/g, '[data-theme="dark"] .btn-primary {\n  background: linear-gradient(135deg, #d6b68a 0%, #a37f4a 100%) !important;');
content = content.replace(/\[data-theme="dark"\] \.btn-primary:hover\s*\{\s*background: linear-gradient\(135deg, #0d4f59 0%, #c8a26c 100%\) !important;/g, '[data-theme="dark"] .btn-primary:hover {\n  background: linear-gradient(135deg, #856335 0%, #d6b68a 100%) !important;');
content = content.replace(/\[data-theme="dark"\] \.btn-primary:active\s*\{\s*background: linear-gradient\(135deg, #082c33 0%, #a37f4a 100%\) !important;/g, '[data-theme="dark"] .btn-primary:active {\n  background: linear-gradient(135deg, #a37f4a 0%, #d6b68a 100%) !important;');

// Reverse 4. Primary Button Light
content = content.replace(/\[data-theme="light"\] \.btn-primary\s*\{\s*background: linear-gradient\(135deg, #d6b68a 0%, #0a3a42 100%\) !important;/g, '[data-theme="light"] .btn-primary {\n  background: linear-gradient(135deg, #0a3a42 0%, #0d4f59 100%) !important;');
content = content.replace(/\[data-theme="light"\] \.btn-primary:hover\s*\{\s*background: linear-gradient\(135deg, #c8a26c 0%, #0d4f59 100%\) !important;/g, '[data-theme="light"] .btn-primary:hover {\n  background: linear-gradient(135deg, #0d4f59 0%, #116875 100%) !important;');
content = content.replace(/\[data-theme="light"\] \.btn-primary:active\s*\{\s*background: linear-gradient\(135deg, #a37f4a 0%, #082c33 100%\) !important;/g, '[data-theme="light"] .btn-primary:active {\n  background: linear-gradient(135deg, #082c33 0%, #0a3a42 100%) !important;');

// Reverse 5. Generic .btn-primary (Fallback)
content = content.replace(/\.btn-primary\s*\{\s*background: linear-gradient\(135deg, #0a3a42 0%, #d6b68a 100%\);/g, '.btn-primary {\n  background: linear-gradient(135deg, #d6b68a 0%, #0891b2 100%);');
content = content.replace(/\.btn-primary:hover\s*\{\s*transform: translateY\(-1px\);\s*background: linear-gradient\(135deg, #0d4f59 0%, #c8a26c 100%\);/g, '.btn-primary:hover {\n  transform: translateY(-1px);\n  background: linear-gradient(135deg, #a37f4a 0%, #0e7490 100%);');

fs.writeFileSync(indexFile, content, 'utf8');

// Update LandingPage.css step-number gradient
const landingFile = path.join(dir, 'components', 'Landing', 'LandingPage.css');
let landingContent = fs.readFileSync(landingFile, 'utf8');
landingContent = landingContent.replace(/background: linear-gradient\(135deg, #0a3a42, #d6b68a\);/g, 'background: linear-gradient(135deg, #d6b68a, #a37f4a);');
fs.writeFileSync(landingFile, landingContent, 'utf8');

console.log('Undid mixed colors successfully');
