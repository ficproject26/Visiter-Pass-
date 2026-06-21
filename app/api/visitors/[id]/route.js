import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { sendApprovalEmail } from '../../../../lib/services/emailService';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { approvalStatus, status, checkInTime, checkOutTime } = await req.json();

    const updateData = {};

    if (approvalStatus !== undefined) {
      const validApproval = ['PENDING', 'APPROVED', 'REJECTED'];
      const normalizedApproval = String(approvalStatus).toUpperCase();
      if (validApproval.includes(normalizedApproval)) {
        updateData.approvalStatus = normalizedApproval;
      }
    }

    if (status !== undefined) {
      const validStatus = ['PENDING', 'CHECKED_IN', 'CHECKED_OUT'];
      const normalizedStatus = String(status).toUpperCase();
      if (validStatus.includes(normalizedStatus)) {
        updateData.status = normalizedStatus;
      }
    }

    if (checkInTime !== undefined) updateData.checkInTime = checkInTime;
    if (checkOutTime !== undefined) updateData.checkOutTime = checkOutTime;

    const visitor = await prisma.visitor.update({
      where: { visitorId: id },
      data: updateData
    });

    if (updateData.approvalStatus === 'APPROVED') {
      sendApprovalEmail(visitor.email, visitor.fullName, visitor.personToMeet, visitor.visitorId)
        .catch(err => console.error('Email send failed (non-blocking):', err));
    }

    return NextResponse.json({
      ...visitor,
      id: visitor.visitorId
    });
  } catch (error) {
    console.error('PATCH /api/visitors/:id error:', error);
    return NextResponse.json({ error: 'Failed to update visitor' }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const visitor = await prisma.visitor.findUnique({
      where: { visitorId: id }
    });

    if (!visitor) {
      return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...visitor,
      id: visitor.visitorId
    });
  } catch (error) {
    console.error('GET /api/visitors/:id error:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor' }, { status: 500 });
  }
}
