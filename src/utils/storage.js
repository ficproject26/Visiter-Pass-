import { MOCK_VISITORS } from "../constants/visitorConstants";

const STORAGE_KEY = "visitoros_records";

export function loadVisitors() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_VISITORS));
      return MOCK_VISITORS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read visitors from local storage:", error);
    return MOCK_VISITORS;
  }
}

export function saveVisitors(visitors) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
  } catch (error) {
    console.error("Failed to save visitors to local storage:", error);
  }
}

export function resetVisitors() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_VISITORS));
    return MOCK_VISITORS;
  } catch (error) {
    console.error("Failed to reset local storage:", error);
    return MOCK_VISITORS;
  }
}

export function exportToCSV(visitors) {
  if (!visitors || !visitors.length) return;

  const headers = [
    "ID", "Full Name", "Phone", "Email", "ID Type", "ID Number", 
    "Purpose", "Person to Meet", "Department", "Branch", 
    "Visit Date", "Check-in Time", "Check-out Time", "Vehicle Number", 
    "Emergency Contact", "Status", "Approval Status"
  ];

  const rows = visitors.map(v => [
    v.id,
    `"${(v.fullName||'').replace(/"/g, '""')}"`,
    v.phone,
    v.email || "",
    v.idType,
    v.idNumber,
    v.purpose,
    `"${(v.personToMeet||'').replace(/"/g, '""')}"`,
    v.department,
    v.branch,
    v.visitDate,
    v.checkInTime || "",
    v.checkOutTime || "",
    v.vehicleNumber || "",
    v.emergencyContact,
    v.status,
    v.approvalStatus
  ]);

  const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `visitor_logs_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link); // Required for FF
  
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
