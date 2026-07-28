import fs from 'fs';
import path from 'path';
import { prisma } from './prisma.js';

const DATA_DIR = path.join(process.cwd(), 'data');
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
  } catch (err) {
    // Suppress read-only filesystem errors in Vercel serverless
  }
}

function readJsonFile(filename, defaultVal = []) {
  if (inMemoryCache[filename]) {
    return inMemoryCache[filename];
  }
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryCache[filename] = parsed;
      return parsed;
    }
  } catch (err) {
    // Read failed or file read-only
  }
  inMemoryCache[filename] = defaultVal;
  return defaultVal;
}

function writeJsonFile(filename, data) {
  inMemoryCache[filename] = data;
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn(`Local file write suppressed (${err.code || err.message}) - data stored in memory.`);
  }
}

// Timeout helper for Prisma calls - 8000ms for reliable Vercel Serverless DB access
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
    let tenant = await prisma.tenant.findFirst().catch(() => null);
    if (!tenant) {
      tenant = await prisma.tenant.create({ data: { name: 'Default Tenant', domain: 'default.com' } }).catch(() => null);
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

export async function getVisitors() {
  const fileVisitors = readJsonFile('visitors.json', []);
  let dbVisitors = [];

  try {
    const fetched = await withTimeout(prisma.visitor.findMany({
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
    }), 8000);

    if (Array.isArray(fetched)) {
      dbVisitors = fetched.map(v => ({
        ...v,
        id: v.visitorId || v.id
      }));
    }
  } catch (err) {
    console.warn("Prisma unavailable/timed out, using local storage:", err.message);
  }

  const mergedMap = new Map();

  for (const v of fileVisitors) {
    const key = String(v.visitorId || v.id || '').toUpperCase().replace(/-/g, "");
    if (key) {
      mergedMap.set(key, { ...v, id: v.visitorId || v.id });
    }
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
  return combined;
}

export async function createVisitor(data) {
  try {
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
      idProofUrl: data.idProof || null,
      photoUrl: data.photo || null,
      purpose: data.purpose || 'Meeting',
      interviewDomain: data.interviewDomain || data.companyName || '',
      interviewRole: data.interviewRole || data.positionApplied || '',
      personToMeet: data.personToMeet || 'Branch Admin',
      department: data.department || 'General',
      branch: data.branch || 'Main Location',
      visitDate: data.visitDate || new Date().toISOString().slice(0, 10),
      checkInTime: data.checkInTime || '',
      checkOutTime: data.checkOutTime || null,
      vehicleNumber: data.vehicleNumber || null,
      companyName: data.companyName || data.interviewDomain || null,
      positionApplied: data.positionApplied || data.interviewRole || null,
      status: 'PENDING',
      approvalStatus: 'PENDING',
      arrivedAtGate: data.arrivedAtGate !== undefined ? Boolean(data.arrivedAtGate) : false,
      createdAt: new Date().toISOString()
    };

    const visitors = readJsonFile('visitors.json', []);
    visitors.unshift(newRecord);
    writeJsonFile('visitors.json', visitors);

    try {
      const tenantId = await getOrCreateTenantId();
      const rawDate = data.visitDate ? new Date(data.visitDate) : new Date();
      const parsedDate = isNaN(rawDate.getTime()) ? new Date() : rawDate;

      // Strict Prisma Enum validation mapping
      let statusEnum = 'PENDING';
      const statusStr = String(data.status || '').toUpperCase();
      if (statusStr.includes('CHECKED_IN') || statusStr.includes('CHECKIN')) statusEnum = 'CHECKED_IN';
      else if (statusStr.includes('CHECKED_OUT') || statusStr.includes('CHECKOUT')) statusEnum = 'CHECKED_OUT';

      let approvalStatusEnum = 'PENDING';
      const approvalStr = String(data.approvalStatus || '').toUpperCase();
      if (approvalStr.includes('APPROV')) approvalStatusEnum = 'APPROVED';
      else if (approvalStr.includes('REJECT')) approvalStatusEnum = 'REJECTED';

      const dbCreated = await withTimeout(prisma.visitor.create({
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
          idProofUrl: data.idProof || null,
          photoUrl: data.photo || null,
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
      }), 4000).catch(err => {
        console.error("Prisma visitor.create error:", err.message);
        return null;
      });

      if (dbCreated) {
        console.log("Successfully persisted visitor in MongoDB Atlas:", dbCreated.visitorId);
      }
    } catch (err) {
      console.error("MongoDB Atlas insertion exception:", err.message);
    }

    return newRecord;
  } catch (outerErr) {
    console.error("Fatal createVisitor error:", outerErr);
    const fallbackId = `V${Math.floor(Math.random() * 900) + 100}`;
    return {
      id: fallbackId,
      visitorId: fallbackId,
      fullName: data.fullName || 'Visitor',
      status: 'PENDING',
      approvalStatus: 'PENDING',
      createdAt: new Date().toISOString()
    };
  }
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
    }), 1200).catch(() => null);

    if (target) {
      await withTimeout(prisma.visitor.update({
        where: { id: target.id },
        data: dbUpdates
      }), 2000).catch(() => null);
    }
  } catch (err) {
    console.warn("Prisma update failed:", err.message);
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
    }), 1200).catch(() => null);

    if (dbVisitor) {
      return {
        ...dbVisitor,
        id: dbVisitor.visitorId || dbVisitor.id,
        photo: dbVisitor.photoUrl || dbVisitor.photo,
        idProof: dbVisitor.idProofUrl || dbVisitor.idProof
      };
    }
  } catch (err) {
    console.warn("Prisma unavailable for single fetch:", err.message);
  }

  return null;
}

export async function getBranches() {
  const fileBranches = readJsonFile('branches.json', []);
  let dbBranches = [];
  try {
    const fetched = await withTimeout(prisma.branch.findMany(), 3000).catch(() => []);
    if (fetched && fetched.length > 0) {
      dbBranches = fetched;
    }
  } catch (err) {
    console.warn("Prisma branch.findMany error:", err.message);
  }

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
    const dbCreated = await withTimeout(prisma.branch.create({
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
    }), 4000).catch(err => {
      console.error("Prisma branch.create error:", err.message);
      return null;
    });

    if (dbCreated) {
      console.log("Successfully persisted branch in MongoDB Atlas:", dbCreated.name);
    }
  } catch (err) {
    console.error("MongoDB Atlas branch creation exception:", err.message);
  }

  return newRecord;
}

export async function getEmployees() {
  const fileEmps = readJsonFile('employees.json', []);
  let dbEmps = [];
  try {
    const fetched = await withTimeout(prisma.employee.findMany(), 3000).catch(() => []);
    if (fetched && fetched.length > 0) {
      dbEmps = fetched;
    }
  } catch (err) {
    console.warn("Prisma employee.findMany error:", err.message);
  }

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

  const combined = Array.from(mergedMap.values());
  return combined;
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
    const dbCreated = await withTimeout(prisma.employee.create({
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
    }), 4000).catch(err => {
      console.error("Prisma employee.create error:", err.message);
      return null;
    });

    if (dbCreated) {
      console.log("Successfully persisted employee in MongoDB Atlas:", dbCreated.email);
    }
  } catch (err) {
    console.error("MongoDB Atlas employee creation exception:", err.message);
  }

  return newRecord;
}
