import { getVisitors } from '../lib/dbHandler.js';

async function test() {
  try {
    console.log("Calling getVisitors()...");
    const visitors = await getVisitors();
    console.log("Total returned visitors:", visitors.length);
    const ranjith = visitors.find(v => v.fullName === "ranjith" || v.visitorId === "V676" || v.id === "V676");
    console.log("Ranjith visitor object:", ranjith);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
