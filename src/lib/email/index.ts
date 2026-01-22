import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Generic email sending function
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text, from } = options;

  await transporter.sendMail({
    from: from || process.env.EMAIL_FROM || 'noreply@garderoba-pro.ro',
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for plain text fallback
  });

  console.log('[EMAIL SENT]', { to, subject });
}
