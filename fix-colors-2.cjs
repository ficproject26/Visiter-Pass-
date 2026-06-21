const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Landing/LandingPage.css');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the backgrounds that were causing the muddy brown
content = content.replace(/rgba\(245,\s*240,\s*232,\s*0\.3\)/g, 'rgba(255, 255, 255, 0.03)');
content = content.replace(/rgba\(28,\s*16,\s*8,\s*0\.3\)/g, 'rgba(0, 0, 0, 0.03)');
content = content.replace(/rgba\(37,\s*21,\s*8,\s*0\.3\)/g, 'rgba(0, 0, 0, 0.03)');
content = content.replace(/rgba\(235,\s*232,\s*224,\s*0\.3\)/g, 'rgba(0, 0, 0, 0.03)');
content = content.replace(/rgba\(250,\s*246,\s*240,\s*0\.3\)/g, 'rgba(0, 0, 0, 0.03)');
content = content.replace(/rgba\(28,\s*16,\s*8,\s*0\.92\)/g, 'rgba(15, 23, 42, 0.92)');

// 2. Fix inverted text colors for dark and light
content = content.replace(/\.dark \.section-header h2\s*\{\s*color:\s*#0f172a;\s*\}/g, '.dark .section-header h2 { color: #f8fafc; }');
content = content.replace(/\.light \.section-header h2\s*\{\s*color:\s*#f8fafc;\s*\}/g, '.light .section-header h2 { color: #0f172a; }');

content = content.replace(/\.dark \.section-header p\s*\{\s*color:\s*#475569;\s*\}/g, '.dark .section-header p { color: #94a3b8; }');
content = content.replace(/\.light \.section-header p\s*\{\s*color:\s*rgba\(248, 250, 252, 0\.65\);\s*\}/g, '.light .section-header p { color: #475569; }');

content = content.replace(/\.dark \.how-it-works-step h3\s*\{\s*color:\s*#0f172a;\s*\}/g, '.dark .how-it-works-step h3 { color: #f8fafc; }');
content = content.replace(/\.light \.how-it-works-step h3\s*\{\s*color:\s*#f8fafc;\s*\}/g, '.light .how-it-works-step h3 { color: #0f172a; }');

content = content.replace(/\.dark \.how-it-works-step p\s*\{\s*color:\s*#475569;\s*\}/g, '.dark .how-it-works-step p { color: #94a3b8; }');
content = content.replace(/\.light \.how-it-works-step p\s*\{\s*color:\s*rgba\(248, 250, 252, 0\.6\);\s*\}/g, '.light .how-it-works-step p { color: #475569; }');

content = content.replace(/\.dark \.testimonial-card\s*\{\s*background:\s*rgba\(255, 255, 255, 0\.75\);/g, '.dark .testimonial-card {\n  background: rgba(255, 255, 255, 0.05);');
content = content.replace(/\.light \.testimonial-card\s*\{\s*background:\s*rgba\(255, 255, 255, 0\.06\);/g, '.light .testimonial-card {\n  background: rgba(255, 255, 255, 0.8);');

content = content.replace(/\.dark \.testimonial-quote\s*\{\s*color:\s*#94a3b8;\s*\}/g, '.dark .testimonial-quote { color: #cbd5e1; }');
content = content.replace(/\.light \.testimonial-quote\s*\{\s*color:\s*rgba\(248, 250, 252, 0\.8\);\s*\}/g, '.light .testimonial-quote { color: #334155; }');

content = content.replace(/\.dark \.testimonial-author\s*\{\s*color:\s*#0f172a;\s*\}/g, '.dark .testimonial-author { color: #f8fafc; }');
content = content.replace(/\.light \.testimonial-author\s*\{\s*color:\s*#f8fafc;\s*\}/g, '.light .testimonial-author { color: #0f172a; }');

content = content.replace(/\.dark \.faq-toggle-btn\s*\{\s*color:\s*#0f172a;\s*\}/g, '.dark .faq-toggle-btn { color: #f8fafc; }');
content = content.replace(/\.light \.faq-toggle-btn\s*\{\s*color:\s*#f8fafc;\s*\}/g, '.light .faq-toggle-btn { color: #0f172a; }');

content = content.replace(/\.dark \.faq-answer\s*\{\s*color:\s*rgba\(248, 250, 252, 0\.65\);\s*\}/g, '.dark .faq-answer { color: #cbd5e1; }');

content = content.replace(/\.dark \.footer-column h5\s*\{\s*color:\s*#0f172a;\s*\}/g, '.dark .footer-column h5 { color: #f8fafc; }');
content = content.replace(/\.light \.footer-column h5\s*\{\s*color:\s*#f8fafc;\s*\}/g, '.light .footer-column h5 { color: #0f172a; }');

fs.writeFileSync(file, content, 'utf8');

const indexFile = path.join(__dirname, 'src/index.css');
let indexContent = fs.readFileSync(indexFile, 'utf8');
indexContent = indexContent.replace(/rgba\(28,\s*16,\s*8,\s*0\.45\)/g, 'rgba(0, 0, 0, 0.45)');
fs.writeFileSync(indexFile, indexContent, 'utf8');

console.log('Fixed inverted text and backgrounds.');
