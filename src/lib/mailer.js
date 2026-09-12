import nodemailer from 'nodemailer';

// Gmail SMTP transporter.
// Required env vars in .env.local:
//   GMAIL_USER          - your Gmail address, e.g. info@gmail.com
//   GMAIL_APP_PASSWORD  - a Google App Password (NOT your normal Gmail password).
//                         Create one at https://myaccount.google.com/apppasswords
//                         (requires 2-Step Verification enabled on the account).
//   ORDER_NOTIFY_EMAIL  - optional, where order notifications are sent.
//                         Defaults to order@researchchems.online.

const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

const createMockTransporter = () => {
  console.warn('WARNING: GMAIL_USER or GMAIL_APP_PASSWORD not set. Using mock mailer.');
  return {
    sendMail: async (options) => {
      console.log('MOCK EMAIL SENT:', {
        from: options.from,
        to: options.to,
        subject: options.subject,
      });
      return { messageId: 'mock-message-id' };
    },
  };
};

const transporter =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
        },
      })
    : createMockTransporter();

export const STORE_EMAIL = process.env.ORDER_NOTIFY_EMAIL || 'order@researchchems.online';
export const FROM_EMAIL = process.env.FROM_EMAIL || GMAIL_USER || 'order@researchchems.online';

export default transporter;
