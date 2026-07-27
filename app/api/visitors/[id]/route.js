import { NextResponse } from 'next/server';
import { getVisitors, updateVisitor } from '../../../../lib/dbHandler';
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
    if (body.arrivedAtGate !== undefined) updateData.arrivedAtGate = Boolean(body.arrivedAtGate);

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
    const visitors = await getVisitors();
    const cleanId = String(id).toUpperCase().replace(/-/g, "");

    const visitor = visitors.find(v => {
      const vId = String(v.id || v.visitorId || "").toUpperCase().replace(/-/g, "");
      return vId === cleanId;
    });

    if (!visitor) {
      return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...visitor,
      id: visitor.visitorId || visitor.id
    });
  } catch (error) {
    console.error('GET /api/visitors/:id error:', error);
    return NextResponse.json({ error: 'Failed to fetch visitor' }, { status: 500 });
  }
}

