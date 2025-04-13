import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_KEY);

// Email sender configuration
const FROM_EMAIL = "onboarding@resend.dev"; // Using verified Resend domain for development
const DEFAULT_SUBJECT_PREFIX = "Barangay Bahay Toro - ";

// Email templates for different certificate statuses
type EmailTemplateProps = {
  recipientName: string;
  certificateType: string;
  referenceNumber: string;
  notes?: string;
};

export const emailTemplates = {
  rejected: ({ recipientName, certificateType, referenceNumber, notes }: EmailTemplateProps) => ({
    subject: `${DEFAULT_SUBJECT_PREFIX}Certificate Request Rejected`,
    html: `
      <div>
        <h1>Certificate Request Rejected</h1>
        <p>Dear ${recipientName},</p>
        <p>We regret to inform you that your request for a ${certificateType} (Reference Number: ${referenceNumber}) has been rejected.</p>
        ${notes ? `<p><strong>Reason:</strong> ${notes}</p>` : ""}
        <p>If you have any questions or need further clarification, please contact Barangay Bahay Toro office or visit us during office hours.</p>
        <p>Thank you for your understanding.</p>
        <p>Regards,<br>Barangay Bahay Toro Administration</p>
      </div>
    `,
  }),
  
  awaitingPayment: ({ recipientName, certificateType, referenceNumber }: EmailTemplateProps) => ({
    subject: `${DEFAULT_SUBJECT_PREFIX}Certificate Request Approved - Payment Required`,
    html: `
      <div>
        <h1>Certificate Request Approved</h1>
        <p>Dear ${recipientName},</p>
        <p>Great news! Your request for a ${certificateType} (Reference Number: ${referenceNumber}) has been approved.</p>
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Please proceed with the payment to continue the processing of your certificate.</li>
          <li>You can pay online through our dashboard at <a href="https://bahaytoro.gov.ph/dashboard/certificates">https://bahaytoro.gov.ph/dashboard/certificates</a></li>
          <li>Alternatively, you can visit the Barangay Bahay Toro office during business hours to make your payment in person.</li>
        </ol>
        <p>If you have any questions, please contact our office.</p>
        <p>Thank you for your cooperation.</p>
        <p>Regards,<br>Barangay Bahay Toro Administration</p>
      </div>
    `,
  }),
  
  readyForPickup: ({ recipientName, certificateType, referenceNumber }: EmailTemplateProps) => ({
    subject: `${DEFAULT_SUBJECT_PREFIX}Certificate Ready for Pickup`,
    html: `
      <div>
        <h1>Certificate Ready for Pickup</h1>
        <p>Dear ${recipientName},</p>
        <p>We're pleased to inform you that your ${certificateType} (Reference Number: ${referenceNumber}) is now ready for pickup at the Barangay Bahay Toro office.</p>
        <p><strong>Important Information:</strong></p>
        <ul>
          <li>Please bring a valid ID for verification purposes.</li>
          <li>Office Hours: Monday to Friday, 8:00 AM to 5:00 PM</li>
          <li>The certificate will be available for pickup for 30 days.</li>
        </ul>
        <p>If you have any questions, please contact our office.</p>
        <p>Thank you for your patience.</p>
        <p>Regards,<br>Barangay Bahay Toro Administration</p>
      </div>
    `,
  }),
  
  inTransit: ({ recipientName, certificateType, referenceNumber }: EmailTemplateProps) => ({
    subject: `${DEFAULT_SUBJECT_PREFIX}Certificate In Transit`,
    html: `
      <div>
        <h1>Certificate In Transit</h1>
        <p>Dear ${recipientName},</p>
        <p>We're pleased to inform you that your ${certificateType} (Reference Number: ${referenceNumber}) is now in transit and will be delivered to your registered address soon.</p>
        <p>Please ensure that someone is available to receive the document. If you have any questions or need to update your delivery address, please contact our office immediately.</p>
        <p>Thank you for your patience.</p>
        <p>Regards,<br>Barangay Bahay Toro Administration</p>
      </div>
    `,
  }),
};

// Function to send emails
export async function sendEmail({
  to,
  templateName,
  templateProps,
}: {
  to: string;
  templateName: keyof typeof emailTemplates;
  templateProps: EmailTemplateProps;
}) {
  try {
    const template = emailTemplates[templateName](templateProps);
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}