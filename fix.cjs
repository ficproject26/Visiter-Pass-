const fs = require('fs');
const path = require('path');
const dir = 'src/components/Landing';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Make root section backgrounds semi-transparent
  content = content.replace(/background: isDark \? \"rgba\(0,0,0,0\.18\)\" : \"#[A-Fa-f0-9]+\"/g, 'background: isDark ? "rgba(0,0,0,0.18)" : "rgba(247, 245, 240, 0.5)", backdropFilter: "blur(10px)"');
  
  // Make security section semi transparent
  content = content.replace(/background: isDark \? \"linear-gradient\((.*?)\)\" : \"rgba\(255,255,255,0\.4\)\"/g, 'background: isDark ? "linear-gradient($1)" : "rgba(255,255,255,0.4)", backdropFilter: "blur(10px)"');

  // Replace internal card #FFFFFF opaque backgrounds
  content = content.replace(/background: isDark \? \"(.*?)\" : \"#FFFFFF\"/g, 'background: isDark ? "$1" : "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(10px)"');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
}
