import { updateVisitor, getVisitorById } from '../lib/dbHandler.js';

async function test() {
  try {
    console.log("Testing updateVisitor for V676 with status CHECKED_OUT...");
    const result = await updateVisitor("V676", {
      status: "CHECKED_OUT",
      checkOutTime: "17:00"
    });
    console.log("Update result:", result);

    const fetched = await getVisitorById("V676");
    console.log("Fetched visitor after update:", fetched ? { id: fetched.id, status: fetched.status, checkOutTime: fetched.checkOutTime } : "Not found");
  } catch (err) {
    console.error("Test error:", err);
  }
}

test();
