export const MOCK_VISITORS = [
  { id: "V001", fullName: "Arjun Mehta", phone: "9876543210", email: "arjun@email.com", idType: "Aadhaar", idNumber: "1234-5678-9012", purpose: "Business Meeting", personToMeet: "Priya Sharma", department: "Engineering", branch: "Bangalore", visitDate: "2026-06-15", checkInTime: "09:30", vehicleNumber: "KA01AB1234", emergencyContact: "9876501234", status: "checked-in", approvalStatus: "approved", checkOutTime: null, photo: null },
  { id: "V002", fullName: "Sneha Rao", phone: "9123456780", email: "sneha.rao@corp.com", idType: "PAN Card", idNumber: "ABCDE1234F", purpose: "Interview", personToMeet: "Vikram Nair", department: "HR", branch: "Bangalore", visitDate: "2026-06-15", checkInTime: "10:15", vehicleNumber: "", emergencyContact: "9123400000", status: "checked-in", approvalStatus: "approved", checkOutTime: null, photo: null },
  { id: "V003", fullName: "Rajan Patel", phone: "9988776655", email: "rajan.p@mail.com", idType: "Passport", idNumber: "J1234567", purpose: "Vendor Visit", personToMeet: "Ananya Krishnan", department: "Finance", branch: "Krishnagiri Main", visitDate: "2026-06-14", checkInTime: "14:00", vehicleNumber: "MH04CD5678", emergencyContact: "9988700000", status: "checked-out", approvalStatus: "approved", checkOutTime: "16:30", photo: null },
  { id: "V004", fullName: "Divya Menon", phone: "9871234560", email: "divya.m@personal.com", idType: "Aadhaar", idNumber: "9876-5432-1098", purpose: "Client Meeting", personToMeet: "Sanjay Gupta", department: "Sales", branch: "Palacode", visitDate: "2026-06-15", checkInTime: "11:00", vehicleNumber: "KA05EF9012", emergencyContact: "9871200000", status: "pending", approvalStatus: "pending", checkOutTime: null, photo: null },
  { id: "V005", fullName: "Karan Singh", phone: "9765432100", email: "karan.s@mail.com", idType: "Driving License", idNumber: "DL0120200012345", purpose: "Delivery", personToMeet: "Reception", department: "Operations", branch: "Tirupattur", visitDate: "2026-06-15", checkInTime: "08:45", vehicleNumber: "KA02GH3456", emergencyContact: "9765400000", status: "checked-out", approvalStatus: "approved", checkOutTime: "09:10", photo: null },
  { id: "V006", fullName: "Meera Iyer", phone: "9654321000", email: "meera.i@corp.com", idType: "Voter ID", idNumber: "ABC1234567", purpose: "Audit", personToMeet: "CFO Office", department: "Finance", branch: "Chennai", visitDate: "2026-06-13", checkInTime: "10:00", vehicleNumber: "", emergencyContact: "9654300000", status: "checked-out", approvalStatus: "approved", checkOutTime: "17:00", photo: null },
];

export const DEPARTMENTS = ["Admin", "Security", "HR"];

export const DEPARTMENT_ROLES = {
  "Admin": ["Administrator", "Office Manager", "Executive Assistant", "Sub Admin"],
  "Security": ["Security Officer", "Security Guard", "Security Supervisor", "Security Manager"],
  "HR": ["HR Manager", "Recruiter", "HR Coordinator", "HR Business Partner"],
  "Sub Admin": ["Sub Administrator", "Assistant Manager"]
};

export const BRANCHES = ["Krishnagiri Main", "Chennai", "Bangalore", "Palacode", "Tirupattur"];
export const ID_TYPES = ["Aadhaar", "PAN Card", "Passport", "Driving License", "Voter ID"];
export const PURPOSES = ["Business Meeting", "Interview", "Vendor Visit", "Client Meeting", "Delivery", "Audit", "Training", "Personal"];
export const VISITOR_TYPES = ["Interview Candidate", "Client", "Business Partner", "Vendor", "Service Engineer", "Delivery Personnel", "Guest Visitor"];

export const generateId = () => "V" + String(Math.floor(Math.random() * 900) + 100);
