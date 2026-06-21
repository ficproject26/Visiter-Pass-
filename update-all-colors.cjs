const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
        results.push(filePath);
      }
    }
  });
  return results;
};

const replacements = [
  { regex: /rgba\(\s*214\s*,\s*182\s*,\s*138/g, replacement: 'rgba(99, 102, 241' },
  { regex: /rgba\(\s*200\s*,\s*162\s*,\s*108/g, replacement: 'rgba(129, 140, 248' },
  { regex: /#d6b68a/gi, replacement: '#6366F1' },
  { regex: /#c8a26c/gi, replacement: '#818CF8' },
  { regex: /#08262b/gi, replacement: '#0B0F19' },
  { regex: /#0b333a/gi, replacement: '#111827' },
  { regex: /#124851/gi, replacement: '#1F2937' },
  { regex: /rgba\(\s*8\s*,\s*38\s*,\s*43/g, replacement: 'rgba(11, 15, 25' },
  { regex: /rgba\(\s*28\s*,\s*16\s*,\s*8/g, replacement: 'rgba(11, 15, 25' },
  { regex: /#f5efe6/gi, replacement: '#F8FAFC' },
  { regex: /#fbfaf8/gi, replacement: '#FFFFFF' },
  { regex: /#ebe0cd/gi, replacement: '#F1F5F9' },
  { regex: /rgba\(\s*245\s*,\s*239\s*,\s*230/g, replacement: 'rgba(248, 250, 252' },
  
  // Also update ParallaxHero specific colors
  { regex: /#00D4FF/gi, replacement: '#818CF8' }, // Indigo
  { regex: /#14B8A6/gi, replacement: '#C084FC' }, // Violet
  { regex: /rgba\(\s*0\s*,\s*212\s*,\s*255/g, replacement: 'rgba(129, 140, 248' },
  { regex: /rgba\(\s*20\s*,\s*184\s*,\s*166/g, replacement: 'rgba(192, 132, 252' },
];

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
