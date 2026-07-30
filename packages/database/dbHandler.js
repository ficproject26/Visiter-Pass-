import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const inMemoryCache = {
  'visitors.json': null,
  'employees.json': null,
  'branches.json': null,
};

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {}
}

function readJsonFile(filename, defaultVal = []) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryCache[filename] = parsed;
      return parsed;
    }
  } catch (err) {}
  return inMemoryCache[filename] || defaultVal;
}

function writeJsonFile(filename, data) {
  inMemoryCache[filename] = data;
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`Local file write warning (${err.message}) - cached in memory.`);
  }
}

async function withTimeout(promise, ms = 8000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('DB Timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

let cachedTenantId = null;

async function getOrCreateTenantId() {
  if (cachedTenantId) return cachedTenantId;
  try {
    let tenant = await withTimeout(prisma.tenant.findFirst(), 5000).catch(() => null);
    if (!tenant) {
      tenant = await withTimeout(prisma.tenant.create({ data: { name: 'Default Tenant', domain: 'default.com' } }), 5000).catch(() => null);
    }
    if (tenant) {
      cachedTenantId = tenant.id;
      return cachedTenantId;
    }
  } catch (err) {
    console.warn("Error getting tenantId:", err.message);
  }
  return 'default-tenant-id';
}

// ----------------------------------------------------
// VISITORS (Zero-Loss Dual Pipeline)
// ----------------------------------------------------

export async function getVisitors() {
  const fileVisitors = readJsonFile('visitors.json', []);

  const dbPromise = prisma.visitor.findMany({
    select: {
      id: true,
      visitorId: true,
      tenantId: true,
      visitorType: true,
      fullName: true,
      email: true,
      phone: true,
      gender: true,
      idType: true,
      idNumber: true,
      purpose: true,
      personToMeet: true,
      department: true,
      branch: true,
      visitDate: true,
      checkInTime: true,
      checkOutTime: true,
      vehicleNumber: true,
      companyName: true,
      positionApplied: true,
      interviewDomain: true,
      interviewRole: true,
      meetingAgenda: true,
      status: true,
      approvalStatus: true,
      riskScore: true,
      arrivedAtGate: true,
      createdAt: true,
      updatedAt: true
    }
  }).catch(() => []);

  const fastDb = await Promise.race([
    dbPromise,
    new Promise(resolve => setTimeout(() => resolve(null), 800))
  ]);

  let dbVisitors = [];
  if (Array.isArray(fastDb) && fastDb.length > 0) {
    dbVisitors = fastDb.map(v => ({ ...v, id: v.visitorId || v.id }));
  }

  const mergedMap = new Map();
  for (const v of fileVisitors) {
    const key = String(v.visitorId || v.id || '').toUpperCase().replace(/-/g, "");
    if (key) mergedMap.set(key, { ...v, id: v.visitorId || v.id });
  }

  for (const v of dbVisitors) {
    const key = String(v.visitorId || v.id || '').toUpperCase().replace(/-/g, "");
    if (key) {
      const existing = mergedMap.get(key) || {};
      mergedMap.set(key, { ...existing, ...v, id: v.visitorId || v.id });
    }
  }

  const combined = Array.from(mergedMap.values());
  combined.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  if (combined.length > 0) {
    writeJsonFile('visitors.json', combined);
  }
  return combined;
}

export async function createVisitor(data) {
  const visitorId = data.id || data.visitorId || `V${Math.floor(Math.random() * 900) + 100}`;
  
  const newRecord = {
    id: visitorId,
    visitorId: visitorId,
    visitorType: data.visitorType || 'Guest Visitor',
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    gender: data.gender || 'Male',
    idType: data.idType || 'Aadhaar',
    idNumber: data.idNumber || '',
    idProofUrl: data.idProof || data.idProofUrl || null,
    photoUrl: data.photo || data.photoUrl || null,
    photo: data.photo || data.photoUrl || null,
    idProof: data.idProof || data.idProofUrl || null,
    purpose: data.purpose || 'Meeting',
    interviewDomain: data.interviewDomain || data.companyName || '',
    interviewRole: data.interviewRole || data.positionApplied || '',
    personToMeet: data.personToMeet || 'Branch Admin',
    department: data.department || 'General',
    branch: data.branch || 'Main Location',
    visitDate: data.visitDate || new Date().toISOString().slice(0, 10),
    checkInTime: data.checkInTime || '',
    checkOutTime: null,
    vehicleNumber: data.vehicleNumber || null,
    companyName: data.companyName || data.interviewDomain || null,
    positionApplied: data.positionApplied || data.interviewRole || null,
    status: 'PENDING',
    approvalStatus: 'PENDING',
    arrivedAtGate: data.arrivedAtGate !== undefined ? Boolean(data.arrivedAtGate) : false,
    createdAt: new Date().toISOString()
  };

  // 1. Immediately save to local JSON file so it's NEVER lost
  const visitors = readJsonFile('visitors.json', []);
  visitors.unshift(newRecord);
  writeJsonFile('visitors.json', visitors);

  // 2. Also persist to MongoDB Atlas Cloud Database
  try {
    const tenantId = await getOrCreateTenantId();
    const rawDate = data.visitDate ? new Date(data.visitDate) : new Date();
    const parsedDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;

    let statusEnum = 'PENDING';
    const statusStr = String(data.status || '').toUpperCase();
    if (statusStr.includes('CHECKED_IN') || statusStr.includes('CHECKIN')) statusEnum = 'CHECKED_IN';
    else if (statusStr.includes('CHECKED_OUT') || statusStr.includes('CHECKOUT')) statusEnum = 'CHECKED_OUT';

    let approvalStatusEnum = 'PENDING';
    const approvalStr = String(data.approvalStatus || '').toUpperCase();
    if (approvalStr.includes('APPROV')) approvalStatusEnum = 'APPROVED';
    else if (approvalStr.includes('REJECT')) approvalStatusEnum = 'REJECTED';

    await withTimeout(prisma.visitor.create({
      data: {
        visitorId: visitorId,
        tenantId: tenantId,
        visitorType: data.visitorType || 'Guest Visitor',
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || 'Male',
        idType: data.idType || 'Aadhaar',
        idNumber: data.idNumber || '',
        idProofUrl: data.idProof || data.idProofUrl || null,
        photoUrl: data.photo || data.photoUrl || null,
        purpose: data.purpose || 'Meeting',
        personToMeet: data.personToMeet || 'Branch Admin',
        department: data.department || 'General',
        branch: data.branch || 'Main Location',
        visitDate: parsedDate,
        checkInTime: data.checkInTime || '',
        checkOutTime: null,
        vehicleNumber: data.vehicleNumber || null,
        companyName: data.companyName || data.interviewDomain || null,
        positionApplied: data.positionApplied || data.interviewRole || null,
        meetingAgenda: data.meetingAgenda || null,
        status: statusEnum,
        approvalStatus: approvalStatusEnum,
        arrivedAtGate: data.arrivedAtGate !== undefined ? Boolean(data.arrivedAtGate) : false
      }
    }), 2000).catch(err => {
      console.warn("MongoDB Atlas background insertion warning:", err.message);
    });
  } catch (err) {
    console.warn("MongoDB Atlas insertion exception:", err.message);
  }

  return newRecord;
}

export async function updateVisitor(id, updates) {
  const dbUpdates = { ...updates };
  if (dbUpdates.status !== undefined) {
    dbUpdates.status = String(dbUpdates.status).toUpperCase().replace(/-/g, '_');
  }
  if (dbUpdates.approvalStatus !== undefined) {
    dbUpdates.approvalStatus = String(dbUpdates.approvalStatus).toUpperCase().replace(/-/g, '_');
  }
  if (dbUpdates.visitDate !== undefined) {
    dbUpdates.visitDate = new Date(dbUpdates.visitDate);
  }

  const cleanId = String(id).toUpperCase().replace(/-/g, "");

  const visitors = readJsonFile('visitors.json', []);
  const index = visitors.findIndex(v => (
    v.id === id || v.visitorId === id ||
    (v.visitorId && String(v.visitorId).toUpperCase().replace(/-/g, "") === cleanId) ||
    (v.id && String(v.id).toUpperCase().replace(/-/g, "") === cleanId)
  ));

  let updatedRecord = null;
  if (index !== -1) {
    visitors[index] = { ...visitors[index], ...updates };
    writeJsonFile('visitors.json', visitors);
    updatedRecord = visitors[index];
  }

  try {
    const target = await withTimeout(prisma.visitor.findFirst({
      where: {
        OR: [
          { visitorId: id },
          { visitorId: cleanId },
          { id: id }
        ]
      }
    }), 1500).catch(() => null);

    if (target) {
      await withTimeout(prisma.visitor.update({
        where: { id: target.id },
        data: dbUpdates
      }), 1500).catch(() => null);
    }
  } catch (err) {
    console.warn("Prisma update warning:", err.message);
  }

  return updatedRecord || { id, ...updates };
}

export async function getVisitorById(id) {
  if (!id) return null;
  const cleanId = String(id).toUpperCase().replace(/-/g, "");

  const fileVisitors = readJsonFile('visitors.json', []);
  const fileV = fileVisitors.find(x => {
    const vId1 = String(x.id || "").toUpperCase().replace(/-/g, "");
    const vId2 = String(x.visitorId || "").toUpperCase().replace(/-/g, "");
    return x.id === id || x.visitorId === id || vId1 === cleanId || vId2 === cleanId;
  });

  if (fileV) {
    return {
      ...fileV,
      id: fileV.visitorId || fileV.id,
      photo: fileV.photoUrl || fileV.photo,
      idProof: fileV.idProofUrl || fileV.idProof
    };
  }

  try {
    const dbVisitor = await withTimeout(prisma.visitor.findFirst({
      where: {
        OR: [
          { visitorId: id },
          { visitorId: cleanId },
          { id: id }
        ]
      }
    }), 1500).catch(() => null);

    if (dbVisitor) {
      return {
        ...dbVisitor,
        id: dbVisitor.visitorId || dbVisitor.id,
        photo: dbVisitor.photoUrl || dbVisitor.photo,
        idProof: dbVisitor.idProofUrl || dbVisitor.idProof
      };
    }
  } catch (err) {
    console.warn("Prisma getVisitorById warning:", err.message);
  }

  return null;
}

// ----------------------------------------------------
// BRANCHES (Dual Pipeline)
// ----------------------------------------------------

export async function getBranches() {
  const fileBranches = readJsonFile('branches.json', []);
  let dbBranches = [];

  try {
    const fetched = await withTimeout(prisma.branch.findMany(), 1500).catch(() => []);
    if (fetched && fetched.length > 0) {
      dbBranches = fetched;
    }
  } catch (err) {}

  const mergedMap = new Map();
  for (const b of fileBranches) {
    if (b.name) mergedMap.set(b.name.toLowerCase(), b);
  }
  for (const b of dbBranches) {
    if (b.name) mergedMap.set(b.name.toLowerCase(), { ...b, id: b.id });
  }

  const combined = Array.from(mergedMap.values());
  combined.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return combined;
}

export async function createBranch(data) {
  const branchId = data.id || `BR-${Math.floor(Math.random() * 900) + 100}`;
  const newRecord = {
    id: branchId,
    name: data.name || '',
    type: data.type || 'Branch',
    address: data.address || '',
    city: data.city || (data.name ? data.name.split(' ')[0] : 'City'),
    state: data.state || '',
    pincode: data.pincode || '',
    manager: data.manager || '',
    phone: data.phone || '',
    email: data.email || '',
    password: data.password || '',
    capacity: data.capacity || '100',
    status: 'active',
    createdAt: new Date().toISOString()
  };

  const branches = readJsonFile('branches.json', []);
  branches.unshift(newRecord);
  writeJsonFile('branches.json', branches);

  try {
    await withTimeout(prisma.branch.create({
      data: {
        name: data.name || '',
        type: data.type || 'Branch',
        address: data.address || '',
        city: data.city || (data.name ? data.name.split(' ')[0] : 'City'),
        state: data.state || '',
        pincode: data.pincode || '',
        manager: data.manager || '',
        phone: data.phone || '',
        email: data.email || '',
        password: data.password || null,
        capacity: data.capacity || '100',
        status: 'active'
      }
    }), 1500).catch(() => null);
  } catch (err) {}

  return newRecord;
}

// ----------------------------------------------------
// EMPLOYEES (Dual Pipeline)
// ----------------------------------------------------

export async function getEmployees() {
  const fileEmps = readJsonFile('employees.json', []);
  let dbEmps = [];

  try {
    const fetched = await withTimeout(prisma.employee.findMany(), 1500).catch(() => []);
    if (fetched && fetched.length > 0) {
      dbEmps = fetched;
    }
  } catch (err) {}

  const mergedMap = new Map();
  for (const e of fileEmps) {
    const key = (e.email || e.id || '').toLowerCase();
    if (key) mergedMap.set(key, e);
  }
  for (const e of dbEmps) {
    const key = (e.email || e.empId || e.id || '').toLowerCase();
    if (key) {
      mergedMap.set(key, {
        ...e,
        id: e.empId || e.id,
        photo: e.photoUrl || e.photo
      });
    }
  }

  return Array.from(mergedMap.values());
}

export async function createEmployee(data) {
  const empId = data.id || data.empId || `EMP-${Math.floor(Math.random() * 900000) + 100000}`;
  const newRecord = {
    id: empId,
    empId: empId,
    name: data.name || '',
    email: data.email || '',
    password: data.password || 'password123',
    role: data.role || 'Security Officer',
    department: data.department || 'Security',
    location: data.location || 'Bangalore HQ',
    status: data.status || 'active',
    photo: data.photo || null,
    createdAt: new Date().toISOString()
  };

  const employees = readJsonFile('employees.json', []);
  employees.unshift(newRecord);
  writeJsonFile('employees.json', employees);

  try {
    await withTimeout(prisma.employee.create({
      data: {
        empId: empId,
        name: data.name || '',
        email: data.email || '',
        password: data.password || 'password123',
        role: data.role || 'Security Officer',
        department: data.department || 'Security',
        location: data.location || 'Bangalore HQ',
        status: data.status || 'active',
        photoUrl: data.photo || null
      }
    }), 1500).catch(() => null);
  } catch (err) {}

  return newRecord;
}

export async function updateEmployee(id, updates) {
  if (!id) return null;
  const cleanId = String(id).toUpperCase().replace(/-/g, "");

  const employees = readJsonFile('employees.json', []);
  const index = employees.findIndex(x => {
    const eId1 = String(x.id || "").toUpperCase().replace(/-/g, "");
    const eId2 = String(x.empId || "").toUpperCase().replace(/-/g, "");
    return x.id === id || x.empId === id || eId1 === cleanId || eId2 === cleanId;
  });

  let updatedRecord = null;
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates };
    writeJsonFile('employees.json', employees);
    updatedRecord = employees[index];
  }

  try {
    const target = await withTimeout(prisma.employee.findFirst({
      where: {
        OR: [
          { empId: id },
          { empId: cleanId },
          { id: id }
        ]
      }
    }), 3000).catch(() => null);

    if (target) {
      const dbUpdates = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.password !== undefined) dbUpdates.password = updates.password;
      if (updates.role !== undefined) dbUpdates.role = updates.role;
      if (updates.department !== undefined) dbUpdates.department = updates.department;
      if (updates.location !== undefined || updates.branch !== undefined) dbUpdates.location = updates.location || updates.branch;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.photo !== undefined || updates.photoUrl !== undefined) dbUpdates.photoUrl = updates.photo || updates.photoUrl;

      const updatedPrisma = await withTimeout(prisma.employee.update({
        where: { id: target.id },
        data: dbUpdates
      }), 3000).catch(() => null);

      if (updatedPrisma) {
        updatedRecord = {
          ...updatedPrisma,
          id: updatedPrisma.empId || updatedPrisma.id,
          photo: updatedPrisma.photoUrl
        };
      }
    }
  } catch (err) {
    console.warn("Prisma employee update warning:", err.message);
  }

  return updatedRecord || { id, ...updates };
}

export async function deleteEmployee(id) {
  if (!id) return false;
  const cleanId = String(id).toUpperCase().replace(/-/g, "");

  let employees = readJsonFile('employees.json', []);
  employees = employees.filter(x => {
    const eId1 = String(x.id || "").toUpperCase().replace(/-/g, "");
    const eId2 = String(x.empId || "").toUpperCase().replace(/-/g, "");
    return x.id !== id && x.empId !== id && eId1 !== cleanId && eId2 !== cleanId;
  });
  writeJsonFile('employees.json', employees);

  try {
    const target = await withTimeout(prisma.employee.findFirst({
      where: {
        OR: [
          { empId: id },
          { empId: cleanId },
          { id: id }
        ]
      }
    }), 3000).catch(() => null);

    if (target) {
      await withTimeout(prisma.employee.delete({
        where: { id: target.id }
      }), 3000).catch(() => null);
    }
  } catch (err) {}

  return true;
}
