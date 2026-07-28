import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'visitors.json');
try {
  const content = fs.readFileSync(filePath, 'utf-8');
  const visitors = JSON.parse(content);
  console.log("Total visitors in visitors.json:", visitors.length);
  const found = visitors.filter(v => 
    String(v.id).includes("V676") || 
    String(v.visitorId).includes("V676") ||
    String(v.fullName).toLowerCase().includes("ranjith")
  );
  console.log("Matching in visitors.json:", found);
} catch (error) {
  console.error("Error reading file:", error);
}
