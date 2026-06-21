import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const mapped = visitors.map((v) => ({
      ...v,
      id: v.visitorId
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json({ error: 'No tenant configured' }, { status: 400 });
    }

    let parsedDate = new Date();
    if (data.visitDate) {
      const d = new Date(data.visitDate);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    const visitor = await prisma.visitor.create({
      data: {
        visitorId: data.id || `V${Math.floor(Math.random() * 900) + 100}`,
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
        companyName: data.companyName || null,
        positionApplied: data.positionApplied || null,
        meetingAgenda: data.meetingAgenda || null,
        status: 'PENDING',
        approvalStatus: 'PENDING'
      }
    });

    return NextResponse.json({
      ...visitor,
      id: visitor.visitorId
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to register visitor' }, { status: 500 });
  }
}
