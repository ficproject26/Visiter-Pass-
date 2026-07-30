import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from './prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

function readJsonFile(filename, defaultVal = []) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {}
  return defaultVal;
}

let cachedTenantId = null;

async function getOrCreateTenantId() {
  if (cachedTenantId) return cachedTenantId;
  try {
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({ data: { name: 'Default Tenant', domain: 'default.com' } });
    }
    if (tenant) {
      cachedTenantId = tenant.id;
      return cachedTenantId;
    }
  } catch (err) {
    console.warn("Error getting tenantId from MongoDB Atlas:", err.message);
  }
  return 'default-tenant-id';
}

// ----------------------------------------------------
// VISITORS (Direct MongoDB Atlas Queries)
// ----------------------------------------------------

export async function getVisitors() {
  try {
    const fetched = await prisma.visitor.findMany({
      orderBy: { createdAt: 'desc' },
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
        idProofUrl: true,
        photoUrl: true,
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
    });

    return fetched.map(v => ({
      ...v,
      id: v.visitorId || v.id,
      photo: v.photoUrl,
      idProof: v.idProofUrl
    }));
  } catch (err) {
    console.error("MongoDB Atlas getVisitors error:", err.message);
    const fileVisitors = readJsonFile('visitors.json', []);
    return fileVisitors.map(v => ({ ...v, id: v.visitorId || v.id }));
  }
}

export async function createVisitor(data) {
  try {
    const visitorId = data.id || data.visitorId || `V${Math.floor(Math.random() * 900) + 100}`;
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

    const created = await prisma.visitor.create({
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
    });

    console.log("Successfully created visitor in MongoDB Atlas:", created.visitorId);

    return {
      ...created,
      id: created.visitorId || created.id,
      photo: created.photoUrl,
      idProof: created.idProofUrl
    };
  } catch (err) {
    console.error("MongoDB Atlas createVisitor error:", err.message);
    throw err;
  }
}

export async function updateVisitor(id, updates) {
  try {
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

    const target = await prisma.visitor.findFirst({
      where: {
        OR: [
          { visitorId: id },
          { visitorId: cleanId },
          { id: id }
        ]
      }
    });

    if (target) {
      const updated = await prisma.visitor.update({
        where: { id: target.id },
        data: dbUpdates
      });
      return {
        ...updated,
        id: updated.visitorId || updated.id
      };
    }
  } catch (err) {
    console.error("MongoDB Atlas updateVisitor error:", err.message);
  }
  return { id, ...updates };
}

export async function getVisitorById(id) {
  if (!id) return null;
  const cleanId = String(id).toUpperCase().replace(/-/g, "");

  try {
    const dbVisitor = await prisma.visitor.findFirst({
      where: {
        OR: [
          { visitorId: id },
          { visitorId: cleanId },
          { id: id }
        ]
      }
    });

    if (dbVisitor) {
      return {
        ...dbVisitor,
        id: dbVisitor.visitorId || dbVisitor.id,
        photo: dbVisitor.photoUrl || dbVisitor.photo,
        idProof: dbVisitor.idProofUrl || dbVisitor.idProof
      };
    }
  } catch (err) {
    console.error("MongoDB Atlas getVisitorById error:", err.message);
  }

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

  return null;
}

// ----------------------------------------------------
// BRANCHES (Direct MongoDB Atlas Queries)
// ----------------------------------------------------

export async function getBranches() {
  try {
    const fetched = await prisma.branch.findMany({
      orderBy: { createdAt: 'desc' }
    });
    if (fetched && fetched.length > 0) {
      return fetched.map(b => ({ ...b, id: b.id }));
    }
  } catch (err) {
    console.error("MongoDB Atlas getBranches error:", err.message);
  }
  return readJsonFile('branches.json', []);
}

export async function createBranch(data) {
  try {
    const created = await prisma.branch.create({
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
    });
    console.log("Successfully created branch in MongoDB Atlas:", created.name);
    return created;
  } catch (err) {
    console.error("MongoDB Atlas createBranch error:", err.message);
    throw err;
  }
}

// ----------------------------------------------------
// EMPLOYEES (Direct MongoDB Atlas Queries)
// ----------------------------------------------------

export async function getEmployees() {
  try {
    const fetched = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' }
    });
    if (fetched && fetched.length > 0) {
      return fetched.map(e => ({
        ...e,
        id: e.empId || e.id,
        photo: e.photoUrl || e.photo
      }));
    }
  } catch (err) {
    console.error("MongoDB Atlas getEmployees error:", err.message);
  }
  return readJsonFile('employees.json', []);
}

export async function createEmployee(data) {
  try {
    const empId = data.id || data.empId || `EMP-${Math.floor(Math.random() * 900000) + 100000}`;
    const created = await prisma.employee.create({
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
    });
    console.log("Successfully created employee in MongoDB Atlas:", created.email);
    return {
      ...created,
      id: created.empId || created.id,
      photo: created.photoUrl
    };
  } catch (err) {
    console.error("MongoDB Atlas createEmployee error:", err.message);
    throw err;
  }
}
