const fs = require('fs');
const path = require('path');

const replacements = [
  // Dark Backgrounds
  { search: /#1C1008/ig, replace: '#0f172a' },
  { search: /#251508/ig, replace: '#1e293b' },
  { search: /#301c0c/ig, replace: '#334155' },
  { search: /#2A160A/ig, replace: '#0f172a' },
  
  // Light Backgrounds
  { search: /#F7F5F0/ig, replace: '#f8fafc' },
  { search: /#EFEDE8/ig, replace: '#f1f5f9' },
  { search: /#F0EDE6/ig, replace: '#f1f5f9' },
  { search: /#EBE8E0/ig, replace: '#e2e8f0' },
  
  // Dark Text / Light Base
  { search: /#FAF6F0/ig, replace: '#f8fafc' },
  { search: /rgba\(250,\s*246,\s*240,/ig, replace: 'rgba(248, 250, 252,' },
  
  // Light Text
  { search: /#5C4A35/ig, replace: '#334155' },
  { search: /#9C8B78/ig, replace: '#64748b' },
  { search: /#6B4F2E/ig, replace: '#475569' },
  { search: /#3D2B1A/ig, replace: '#94a3b8' },
  
  // Accents (Amber -> Teal)
  { search: /#D4891A/ig, replace: '#0d9488' },
  { search: /#E8A020/ig, replace: '#0f766e' },
  { search: /#C07810/ig, replace: '#115e59' },
  { search: /rgba\(212,\s*137,\s*26,/ig, replace: 'rgba(13, 148, 136,' },
  
  // Borders
  { search: /rgba\(255,\s*220,\s*150,/ig, replace: 'rgba(255, 255, 255,' },
  { search: /rgba\(60,\s*40,\s*20,/ig, replace: 'rgba(15, 23, 42,' },
  
  // Cyan tweaks
  { search: /#00B4D8/ig, replace: '#06b6d4' },
  { search: /rgba\(0,\s*180,\s*216,/ig, replace: 'rgba(6, 182, 212,' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
}

const dir = path.join(__dirname, 'src');

processFile(path.join(dir, 'index.css'));
processFile(path.join(dir, 'components', 'Landing', 'LandingPage.css'));
processFile(path.join(dir, 'components', 'UI', 'ThemeToggle.css'));

console.log('Done replacing colors.');
