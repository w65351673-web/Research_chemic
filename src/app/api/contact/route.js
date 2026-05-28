import { NextResponse } from 'next/server';
import postmarkClient from '@/lib/postmark';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate form data
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get current timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Send email using Postmark
    const emailResult = await postmarkClient.sendEmail({
      From: 'info@buyresearchchems.com',
      To: 'info@buyresearchchems.com',
      ReplyTo: email, // Add Reply-To header with the sender's email
      Subject: `🔔 New Contact Form: ${subject}`,
      TextBody: `
NEW CONTACT FORM SUBMISSION
===========================

From: ${name}
Email: ${email}
Subject: ${subject}
Received: ${timestamp}

MESSAGE:
--------
${message}

---
Reply directly to this email to respond to ${name}.
      `,
      HtmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #134e4a 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 20px;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #dc2626;
      padding: 15px 20px;
      margin-bottom: 20px;
      border-radius: 5px;
    }
    .info-row {
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      font-weight: 600;
      color: #333;
      min-width: 80px;
      font-size: 14px;
    }
    .info-value {
      color: #555;
      font-size: 14px;
      word-break: break-word;
    }
    .message-box {
      background-color: #ffffff;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .message-box h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }
    .message-content {
      color: #555;
      line-height: 1.6;
      font-size: 14px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .action-button {
      display: inline-block;
      background: linear-gradient(135deg, #dc2626 0%, #134e4a 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 5px;
      font-weight: 600;
      margin-top: 20px;
      text-align: center;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 5px 0;
      color: #6c757d;
      font-size: 12px;
    }
    .timestamp {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 10px 15px;
      margin: 20px 0;
      border-radius: 5px;
      font-size: 13px;
      color: #856404;
    }
    .priority-badge {
      display: inline-block;
      background-color: #28a745;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>🔔 New Contact Form Submission</h1>
      <p>BuyResearchChems Contact Form</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Timestamp -->
      <div class="timestamp">
        ⏰ <strong>Received:</strong> ${timestamp}
      </div>

      <!-- Contact Information -->
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">👤 Name:</span>
          <span class="info-value"><strong>${name}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">📧 Email:</span>
          <span class="info-value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">📝 Subject:</span>
          <span class="info-value"><strong>${subject}</strong></span>
        </div>
      </div>

      <!-- Message -->
      <div class="message-box">
        <h3>💬 Message Content:</h3>
        <div class="message-content">${message}</div>
      </div>

      <!-- Action Button -->
      <center>
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="action-button">
          ✉️ Reply to ${name}
        </a>
      </center>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>BuyResearchChems</strong> - Premium Research Chemicals</p>
      <p>This email was sent from your website contact form</p>
      <p style="margin-top: 10px;">
        <a href="https://buyresearchchems.com" style="color: #dc2626; text-decoration: none;">Visit Website</a> |
        <a href="https://buyresearchchems.com/admin" style="color: #dc2626; text-decoration: none;">Admin Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
      MessageStream: 'outbound'
    });
    
    console.log('Notification email sent successfully:', emailResult.MessageID);

    // Store the user's email in the notification for replying
    // Add the user's email to the notification email for easy reply
    emailResult.To = email;
    
    let confirmationResult = { MessageID: 'not-sent', status: 'skipped' };
    
    // Check if user email is same domain (Postmark sandbox restriction)
    const userDomain = email.split('@')[1];
    const canSendConfirmation = true;
    
    // Try to send confirmation email to the user (only if same domain or Postmark is approved)
    if (canSendConfirmation) {
      try {
        confirmationResult = await postmarkClient.sendEmail({
            From: 'info@buyresearchchems.com',
            To: email,
            Subject: '✅ We received your message - BuyResearchChems',
          TextBody: `
Dear ${name},

Thank you for contacting BuyResearchChems!

We have successfully received your message and our team will review it shortly. You can expect a response within 24-48 hours.

YOUR MESSAGE DETAILS:
Subject: ${subject}
Message: ${message}
Sent: ${timestamp}

If you have any urgent questions, please don't hesitate to reach out to us directly at info@buyresearchchems.com.

Best regards,
The BuyResearchChems Team

---
BuyResearchChems - Premium Research Chemicals
Website: https://buyresearchchems.com
          `,
          HtmlBody: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #134e4a 100%);
      color: #ffffff;
      padding: 40px 20px;
      text-align: center;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 20px;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .message-summary {
      background-color: #f8f9fa;
      border-left: 4px solid #28a745;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .message-summary h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
    }
    .summary-item {
      margin-bottom: 10px;
      font-size: 14px;
      color: #555;
    }
    .summary-label {
      font-weight: 600;
      color: #333;
    }
    .info-box {
      background-color: #e7f3ff;
      border-left: 4px solid #0066cc;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .info-box p {
      margin: 0;
      color: #004085;
      font-size: 14px;
      line-height: 1.6;
    }
    .response-time {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 5px;
      text-align: center;
    }
    .response-time p {
      margin: 0;
      color: #856404;
      font-size: 14px;
      font-weight: 600;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 25px 20px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer-logo {
      font-size: 20px;
      font-weight: 700;
      color: #dc2626;
      margin-bottom: 10px;
    }
    .footer p {
      margin: 5px 0;
      color: #6c757d;
      font-size: 13px;
    }
    .footer-links {
      margin-top: 15px;
    }
    .footer-links a {
      color: #dc2626;
      text-decoration: none;
      margin: 0 10px;
      font-size: 13px;
    }
    .social-icons {
      margin-top: 15px;
    }
    .social-icons a {
      display: inline-block;
      margin: 0 5px;
      color: #667eea;
      text-decoration: none;
      font-size: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>Message Received!</h1>
      <p>We'll get back to you soon</p>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Dear <strong>${name}</strong>,</p>
      
      <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
        Thank you for reaching out to <strong>BuyResearchChems</strong>! We have successfully received your message and our team is reviewing it.
      </p>

      <!-- Response Time -->
      <div class="response-time">
        <p>⏱️ Expected Response Time: <strong>24-48 hours</strong></p>
      </div>

      <!-- Message Summary -->
      <div class="message-summary">
        <h3>📋 Your Message Summary</h3>
        <div class="summary-item">
          <span class="summary-label">Subject:</span> ${subject}
        </div>
        <div class="summary-item">
          <span class="summary-label">Sent:</span> ${timestamp}
        </div>
        <div class="summary-item" style="margin-top: 15px;">
          <span class="summary-label">Message:</span><br>
          <div style="margin-top: 8px; padding: 10px; background: white; border-radius: 4px; white-space: pre-wrap;">${message}</div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="info-box">
        <p>
          <strong>💡 Need urgent assistance?</strong><br>
          Contact us directly at <a href="mailto:info@buyresearchchems.com" style="color: #dc2626;">info@buyresearchchems.com</a>
        </p>
      </div>

      <p style="color: #555; line-height: 1.6; margin-top: 20px;">
        We appreciate your interest in our premium research chemicals and look forward to assisting you.
      </p>

      <p style="color: #555; margin-top: 20px;">
        Best regards,<br>
        <strong>The BuyResearchChems Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo" style="color: #dc2626;">BuyResearchChems</div>
      <p><strong>Premium Research Chemicals</strong></p>
      <p style="margin-top: 10px;">This is an automated confirmation email.</p>
      
      <div class="footer-links">
        <a href="https://buyresearchchems.com">Visit Website</a> |
        <a href="https://buyresearchchems.com/products">Browse Products</a> |
        <a href="https://buyresearchchems.com/about">About Us</a>
      </div>

      <p style="margin-top: 15px; font-size: 11px; color: #999;">
        © ${new Date().getFullYear()} BuyResearchChems. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
          `,
          MessageStream: 'outbound'
        });
        
        console.log('Confirmation email sent successfully:', confirmationResult.MessageID);
      } catch (confirmError) {
        console.warn('Could not send confirmation email:', confirmError.message);
        confirmationResult = { 
          MessageID: 'failed', 
          status: 'error', 
          error: confirmError.message 
        };
      }
    } else {
      console.log(`Skipping confirmation email to ${email} - Postmark account pending approval (sandbox mode)`);
      confirmationResult = { 
        MessageID: 'skipped', 
        status: 'skipped',
        reason: 'Postmark sandbox mode - only same domain emails allowed'
      };
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully', 
      details: {
        notificationEmail: {
          messageId: emailResult.MessageID,
          status: 'sent'
        },
        confirmationEmail: {
          messageId: confirmationResult.MessageID,
          status: confirmationResult.status || 'sent',
          recipient: email,
          reason: confirmationResult.reason || null
        }
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
