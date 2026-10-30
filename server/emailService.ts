import nodemailer from 'nodemailer';

export interface EmailDispatchResult {
  status: 'sent' | 'failed' | 'unconfigured_simulated';
  recipient: string;
  subject: string;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export interface EmailPayload {
  to?: string;
  subject: string;
  text: string;
  html: string;
}

const DEFAULT_ALERT_EMAIL = process.env.BUSINESS_ALERT_EMAIL || 'ejiroekuruemu@gmail.com';

/**
 * Checks whether live SMTP credentials are present in environment variables.
 */
export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

/**
 * Returns the configured business alert email recipient.
 */
export function getBusinessAlertEmail(): string {
  return process.env.BUSINESS_ALERT_EMAIL || DEFAULT_ALERT_EMAIL;
}

/**
 * Dispatches an automated email notification to the business alert address.
 * Accurately tracks whether delivery was sent via real SMTP or recorded as unconfigured/simulated.
 * NEVER falsely claims an email was sent if SMTP was unconfigured or failed.
 */
export async function sendBusinessAlert(payload: EmailPayload): Promise<EmailDispatchResult> {
  const recipient = payload.to || getBusinessAlertEmail();
  const timestamp = new Date().toISOString();

  // If SMTP is not configured with host and credentials
  if (!isSmtpConfigured()) {
    console.log(`[EMAIL NOTICE] Real SMTP credentials not configured in environment. Notification logged for ${recipient}: "${payload.subject}"`);
    return {
      status: 'unconfigured_simulated',
      recipient,
      subject: payload.subject,
      timestamp,
      error: 'SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) not configured in environment. Notification logged in system for administrative review.'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const fromAddress = process.env.SMTP_FROM || `DKWEENS DELIGHTS ENTERPRISES <${process.env.SMTP_USER}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    console.log(`[EMAIL DISPATCH SUCCESS] Alert sent to ${recipient}. MessageId: ${info.messageId}`);
    return {
      status: 'sent',
      recipient,
      subject: payload.subject,
      messageId: info.messageId,
      timestamp
    };
  } catch (error: any) {
    console.error(`[EMAIL DISPATCH FAILURE] Failed to send email to ${recipient}:`, error);
    return {
      status: 'failed',
      recipient,
      subject: payload.subject,
      error: error.message || 'SMTP transport failure',
      timestamp
    };
  }
}
