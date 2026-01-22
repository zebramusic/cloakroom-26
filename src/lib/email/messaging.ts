import { sendEmail } from "./index";

interface NewThreadEmailOptions {
  customerEmail: string;
  customerName: string;
  subject: string;
  initialMessage: string;
  threadId: string;
  type: "order_support" | "general_support";
}

interface NewMessageEmailOptions {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  threadSubject: string;
  messageBody: string;
  threadId: string;
}

/**
 * Send email to admin when customer creates new thread
 */
export async function sendNewThreadEmailToAdmin(
  options: NewThreadEmailOptions,
): Promise<void> {
  const { customerEmail, customerName, subject, initialMessage, threadId, type } = options;
  const adminEmail = process.env.EMAIL_ADMIN || "support@garderoba-pro.ro";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6d28d9; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .message-box { background: white; padding: 20px; border-left: 4px solid #6d28d9; margin: 20px 0; }
        .button { display: inline-block; background: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Customer Support Request</h1>
        </div>
        <div class="content">
          <p><strong>New conversation started</strong></p>
          <p><span class="badge">${type === "order_support" ? "Order Support" : "General Support"}</span></p>
          
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          
          <div class="message-box">
            <p><strong>Initial Message:</strong></p>
            <p>${initialMessage.replace(/\n/g, "<br>")}</p>
          </div>

          <a href="${appUrl}/admin/support/${threadId}" class="button">
            View & Respond
          </a>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            This is an automated notification. Please respond to the customer through the admin panel.
          </p>
        </div>
        <div class="footer">
          <p>Garderobă Pro - Customer Support System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `New Support Request: ${subject}`,
    html,
  });
}

/**
 * Send email when new message is received (both customer and admin)
 */
export async function sendNewMessageEmail(
  options: NewMessageEmailOptions,
): Promise<void> {
  const {
    recipientEmail,
    recipientName,
    senderName,
    threadSubject,
    messageBody,
    threadId,
  } = options;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6d28d9; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .message-box { background: white; padding: 20px; border-left: 4px solid #6d28d9; margin: 20px 0; }
        .button { display: inline-block; background: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Message</h1>
        </div>
        <div class="content">
          <p>Hi ${recipientName},</p>
          <p><strong>${senderName}</strong> sent you a new message in: <strong>${threadSubject}</strong></p>
          
          <div class="message-box">
            <p>${messageBody.replace(/\n/g, "<br>")}</p>
          </div>

          <a href="${appUrl}/account/messages/${threadId}" class="button">
            View & Reply
          </a>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            You can reply to this message directly from your account dashboard.
          </p>
        </div>
        <div class="footer">
          <p>Garderobă Pro - Customer Support</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: recipientEmail,
    subject: `New message in: ${threadSubject}`,
    html,
  });
}

/**
 * Send confirmation email to customer when they create a new thread
 */
export async function sendThreadCreatedConfirmation(
  options: NewThreadEmailOptions,
): Promise<void> {
  const { customerEmail, customerName, subject, threadId } = options;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6d28d9; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; background: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>We've Received Your Message</h1>
        </div>
        <div class="content">
          <p>Hi ${customerName},</p>
          <p>Thank you for contacting us! We've received your message regarding: <strong>${subject}</strong></p>
          
          <p>Our support team will review your request and respond as soon as possible, typically within 24 hours.</p>

          <a href="${appUrl}/account/messages/${threadId}" class="button">
            View Your Conversation
          </a>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            You can track and respond to this conversation from your account dashboard at any time.
          </p>
        </div>
        <div class="footer">
          <p>Garderobă Pro - Customer Support</p>
          <p>If you didn't create this request, please contact us immediately.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: customerEmail,
    subject: `Support Request Received: ${subject}`,
    html,
  });
}
