import { NextResponse } from 'next/server';
import { updateVisitor } from '../../../../lib/dbHandler';
import { sendApprovalEmail } from '../../../../lib/services/emailService';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData = {};
    if (body.approvalStatus !== undefined) updateData.approvalStatus = String(body.approvalStatus).toUpperCase();
    if (body.status !== undefined) updateData.status = String(body.status).toUpperCase();
    if (body.checkInTime !== undefined) updateData.checkInTime = body.checkInTime;
    if (body.checkOutTime !== undefined) updateData.checkOutTime = body.checkOutTime;

    const visitor = await updateVisitor(id, updateData);

    if (updateData.approvalStatus === 'APPROVED' && visitor?.email) {
      sendApprovalEmail(visitor.email, visitor.fullName, visitor.personToMeet, visitor.visitorId || id)
        .catch(err => console.error('Email send failed (non-blocking):', err));
    }

    return NextResponse.json({
      ...visitor,
      id: visitor.visitorId || id
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
