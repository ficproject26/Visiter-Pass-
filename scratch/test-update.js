import { updateVisitor } from '../lib/dbHandler.js';
import fs from 'fs';
import path from 'path';

async function test() {
  try {
    const id = "V676";
    const updates = { approvalStatus: "APPROVED" };
    console.log(`Calling updateVisitor(${id}, ${JSON.stringify(updates)})...`);
    
    // Read before
    const filePath = path.join(process.cwd(), 'data', 'visitors.json');
    let visitors = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let recordBefore = visitors.find(v => v.visitorId === id);
    console.log("Before update in visitors.json:", recordBefore?.approvalStatus);

    const result = await updateVisitor(id, updates);
    console.log("Result returned from updateVisitor:", result);

    // Read after
    visitors = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let recordAfter = visitors.find(v => v.visitorId === id);
    console.log("After update in visitors.json:", recordAfter?.approvalStatus);

  } catch (error) {
    console.error("Error:", error);
  }
}

test();
