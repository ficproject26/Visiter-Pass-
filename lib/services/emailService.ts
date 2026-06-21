import { Resend } from 'resend';

// Use a mock token if not provided. In production, this throws without a real API key
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_token');

export const sendRegistrationEmail = async (visitorEmail: string, visitorName: string, passId: string) => {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Mock] Sending Registration Confirmation to ${visitorEmail} for ${visitorName} (Pass: ${passId})`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Connectvisit Security <onboarding@resend.dev>',
      to: visitorEmail,
      subject: 'Registration Received - Connectvisit',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Registration Received</h2>
          <p>Hi ${visitorName},</p>
          <p>Your visitor registration has been received successfully. Your Pass ID is <strong>${passId}</strong>.</p>
          <p>Please wait for host approval. You will receive another email containing your digital pass once approved.</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">Connectvisit Security Team</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend error:", error);
    return { success: false, error };
  }
};

export const sendApprovalEmail = async (visitorEmail: string, visitorName: string, hostName: string, passId: string) => {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Mock] Sending Approval Email to ${visitorEmail} (Pass ID: ${passId}) approved by Host: ${hostName}`);
    return { success: true, mock: true };
  }

  try {
    const downloadUrl = `http://localhost:5173/download-pass?id=${passId}`;
    const data = await resend.emails.send({
      from: 'Connectvisit Security <onboarding@resend.dev>',
      to: visitorEmail,
      subject: 'Visitor Pass Approved - Connectvisit',
      html: `
        <div style="font-family: sans-serif; padding: 25px; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0d9488; margin-top: 0;">Visitor Pass Approved</h2>
          <p>Hi <strong>${visitorName}</strong>,</p>
          <p>Your registration request to meet host <strong>${hostName}</strong> has been successfully approved.</p>
          <p>You can access, view, and download/print your digital pass on our website at any time using the link below:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${downloadUrl}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">
              Download Digital Pass
            </a>
          </div>
          <p style="font-size: 13px; color: #64748b;">Alternatively, copy and paste this URL into your browser:<br/>
          <a href="${downloadUrl}" style="color: #0891b2;">${downloadUrl}</a></p>
          <p>Please present this digital pass QR code at the reception desk upon your arrival for quick clearance.</p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;"/>
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">Connectvisit Security System • Automated Notification</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend approval email error:", error);
    return { success: false, error };
  }
};
