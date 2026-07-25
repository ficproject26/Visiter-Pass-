import fs from 'fs';
import path from 'path';
import { prisma } from './prisma.js';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile(filename, defaultVal = []) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf-8');
    return defaultVal;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultVal;
  }
}

function writeJsonFile(filename, data) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Timeout helper for Prisma calls
async function withTimeout(promise, ms = 2000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('DB Timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function getVisitors() {
  try {
    const dbVisitors = await withTimeout(prisma.visitor.findMany({ orderBy: { createdAt: 'desc' } }), 1500);
    if (Array.isArray(dbVisitors) && dbVisitors.length > 0) {
      return dbVisitors.map(v => ({ ...v, id: v.visitorId }));
    }
  } catch (err) {
    console.warn("Prisma unavailable, falling back to local file storage.");
  }
  const fileVisitors = readJsonFile('visitors.json', []);
  return fileVisitors.map(v => ({ ...v, id: v.visitorId || v.id }));
}

export async function createVisitor(data) {
  let createdVisitor = null;
  
  // Try Prisma DB insertion first
  try {
    let tenant = await withTimeout(prisma.tenant.findFirst(), 1000).catch(() => null);
    if (!tenant) {
      tenant = await withTimeout(prisma.tenant.create({ data: { name: 'Default Tenant', domain: 'default.com' } }), 1000).catch(() => null);
    }

    if (tenant) {
      const parsedDate = data.visitDate ? new Date(data.visitDate) : new Date();
      createdVisitor = await withTimeout(prisma.visitor.create({
        data: {
          visitorId: data.id || data.visitorId || `V${Math.floor(Math.random() * 900) + 100}`,
          tenantId: tenant.id,
          visitorType: data.visitorType || 'Guest Visitor',
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || 'Male',
          idType: data.idType || '',
          idNumber: data.idNumber || '',
          idProofUrl: data.idProof || null,
          photoUrl: data.photo || null,
          purpose: data.purpose || '',
          personToMeet: data.personToMeet || '',
          department: data.department || '',
          branch: data.branch || '',
          visitDate: parsedDate,
          checkInTime: data.checkInTime || '',
          checkOutTime: null,
          vehicleNumber: data.vehicleNumber || null,
          companyName: data.companyName || data.interviewDomain || null,
          positionApplied: data.positionApplied || data.interviewRole || null,
          meetingAgenda: data.meetingAgenda || null,
          status: (data.status || 'PENDING').toUpperCase(),
          approvalStatus: (data.approvalStatus || 'PENDING').toUpperCase()
        }
      }), 1500);
    }
  } catch (err) {
    console.warn("Prisma save failed/timed out, saving to local JSON storage:", err.message);
  }

  // Always sync to local file storage for 100% availability
  const visitors = readJsonFile('visitors.json', []);
  const newRecord = {
    id: data.id || data.visitorId || (createdVisitor ? createdVisitor.visitorId : `V${Math.floor(Math.random() * 900) + 100}`),
    visitorId: data.id || data.visitorId || (createdVisitor ? createdVisitor.visitorId : `V${Math.floor(Math.random() * 900) + 100}`),
    visitorType: data.visitorType || 'Guest Visitor',
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    gender: data.gender || 'Male',
    idType: data.idType || '',
    idNumber: data.idNumber || '',
    idProofUrl: data.idProof || null,
    photoUrl: data.photo || null,
    purpose: data.purpose || '',
    interviewDomain: data.interviewDomain || data.companyName || '',
    interviewRole: data.interviewRole || data.positionApplied || '',
    personToMeet: data.personToMeet || '',
    department: data.department || '',
    branch: data.branch || '',
    visitDate: data.visitDate || new Date().toISOString().slice(0, 10),
    checkInTime: data.checkInTime || '',
    checkOutTime: data.checkOutTime || null,
    vehicleNumber: data.vehicleNumber || null,
    companyName: data.companyName || data.interviewDomain || null,
    positionApplied: data.positionApplied || data.interviewRole || null,
    status: (data.status || 'PENDING').toUpperCase(),
    approvalStatus: (data.approvalStatus || 'PENDING').toUpperCase(),
    createdAt: new Date().toISOString()
  };

  visitors.unshift(newRecord);
  writeJsonFile('visitors.json', visitors);

  return newRecord;
}

export async function updateVisitor(id, updates) {
  let updatedVisitor = null;
  try {
    updatedVisitor = await withTimeout(prisma.visitor.update({
      where: { visitorId: id },
      data: updates
    }), 1500).catch(() => null);
  } catch (err) {}

  const visitors = readJsonFile('visitors.json', []);
  const index = visitors.findIndex(v => (v.id === id || v.visitorId === id));
  if (index !== -1) {
    visitors[index] = { ...visitors[index], ...updates };
    writeJsonFile('visitors.json', visitors);
    return visitors[index];
  }
  return updatedVisitor || { id, ...updates };
}
