const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  path.join(__dirname, 'src/index.css'),
  path.join(__dirname, 'src/components/Landing/LandingPage.css'),
  path.join(__dirname, 'src/components/Landing/ParallaxHero.jsx')
];

const replacements = [
  { regex: /rgba\(\s*214\s*,\s*182\s*,\s*138/g, replacement: 'rgba(99, 102, 241' },
  { regex: /rgba\(\s*200\s*,\s*162\s*,\s*108/g, replacement: 'rgba(129, 140, 248' },
  { regex: /#d6b68a/gi, replacement: '#6366F1' },
  { regex: /#c8a26c/gi, replacement: '#818CF8' },
  { regex: /#08262b/gi, replacement: '#0B0F19' },
  { regex: /rgba\(\s*8\s*,\s*38\s*,\s*43/g, replacement: 'rgba(11, 15, 25' },
  { regex: /rgba\(\s*28\s*,\s*16\s*,\s*8/g, replacement: 'rgba(11, 15, 25' },
  { regex: /#f5efe6/gi, replacement: '#F8FAFC' },
  { regex: /rgba\(\s*245\s*,\s*239\s*,\s*230/g, replacement: 'rgba(248, 250, 252' },
  
  // Also update ParallaxHero specific colors
  { regex: /#00D4FF/gi, replacement: '#818CF8' }, // Indigo
  { regex: /#14B8A6/gi, replacement: '#C084FC' }, // Violet
  { regex: /rgba\(\s*0\s*,\s*212\s*,\s*255/g, replacement: 'rgba(129, 140, 248' },
  { regex: /rgba\(\s*20\s*,\s*184\s*,\s*166/g, replacement: 'rgba(192, 132, 252' },
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.warn(`File not found: ${file}`);
  }
});
