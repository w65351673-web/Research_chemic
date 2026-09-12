import { NextResponse } from 'next/server';
import transporter, { STORE_EMAIL, FROM_EMAIL } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

const EURO = '\u20AC';

function money(value) {
  return `${EURO}${Number(value || 0).toFixed(2)}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, notes, cart, orderDetails } = body;

    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { error: 'Name, email, phone and shipping address are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    const totals = {
      subtotal: Number(orderDetails?.subtotal || 0),
      shipping: Number(orderDetails?.shipping || 0),
      tax: Number(orderDetails?.tax || 0),
      total: Number(orderDetails?.total || 0),
    };

    const reference = `BRC-${Date.now().toString(36).toUpperCase()}`;

    const timestamp = new Date().toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const items = cart.map((item) => {
      const price = Number(item.price ?? item.variant?.price ?? 0);
      const quantity = Number(item.quantity || 1);
      const grams = item.variant?.grams ?? item.variant?.quantity ?? null;
      return {
        name: item.name,
        grams,
        quantity,
        price,
        lineTotal: price * quantity,
      };
    });

    const itemsText = items
      .map(
        (item) =>
          `- ${item.name}${item.grams ? ` (${item.grams}g)` : ''} x${item.quantity} @ ${money(
            item.price
          )} = ${money(item.lineTotal)}`
      )
      .join('\n');

    const itemsHtml = items
      .map(
        (item) => `
          <tr>
            <td style="padding:10px;border-bottom:1px solid #eee;font-size:14px;color:#333;">
              ${escapeHtml(item.name)}${item.grams ? ` <span style="color:#888;">(${escapeHtml(item.grams)}g)</span>` : ''}
            </td>
            <td style="padding:10px;border-bottom:1px solid #eee;font-size:14px;color:#555;text-align:center;">${item.quantity}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;font-size:14px;color:#555;text-align:right;">${money(item.price)}</td>
            <td style="padding:10px;border-bottom:1px solid #eee;font-size:14px;color:#111;text-align:right;font-weight:600;">${money(item.lineTotal)}</td>
          </tr>`
      )
      .join('');

    const totalsHtml = `
      <tr><td colspan="3" style="padding:8px 10px;text-align:right;color:#666;font-size:14px;">Subtotal</td><td style="padding:8px 10px;text-align:right;font-size:14px;color:#111;">${money(totals.subtotal)}</td></tr>
      <tr><td colspan="3" style="padding:8px 10px;text-align:right;color:#666;font-size:14px;">Shipping</td><td style="padding:8px 10px;text-align:right;font-size:14px;color:#111;">${totals.shipping > 0 ? money(totals.shipping) : 'Free'}</td></tr>
      <tr><td colspan="3" style="padding:8px 10px;text-align:right;color:#666;font-size:14px;">Tax</td><td style="padding:8px 10px;text-align:right;font-size:14px;color:#111;">${money(totals.tax)}</td></tr>
      <tr><td colspan="3" style="padding:12px 10px;text-align:right;font-weight:700;color:#111;font-size:15px;border-top:2px solid #eee;">Total</td><td style="padding:12px 10px;text-align:right;font-weight:700;color:#0284c7;font-size:17px;border-top:2px solid #eee;">${money(totals.total)}</td></tr>`;

    const detailsText = `
Reference: ${reference}
Received: ${timestamp}

CUSTOMER DETAILS
Name: ${name}
Email: ${email}
Phone: ${phone}
Shipping Address: ${address}
${notes ? `Message: ${notes}` : ''}

ORDER ITEMS
${itemsText}

Subtotal: ${money(totals.subtotal)}
Shipping: ${totals.shipping > 0 ? money(totals.shipping) : 'Free'}
Tax: ${money(totals.tax)}
Total: ${money(totals.total)}
`;

    // 1. Notify the store
    const notification = await transporter.sendMail({
      from: `"BuyResearchChems Orders" <${FROM_EMAIL}>`,
      to: STORE_EMAIL,
      replyTo: email,
      subject: `New Order Request ${reference} - ${money(totals.total)}`,
      text: `NEW ORDER REQUEST\n=================\n${detailsText}\n---\nReply directly to this email to contact ${name}.`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:640px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#0284c7 100%);color:#fff;padding:28px 20px;text-align:center;">
      <h1 style="margin:0;font-size:22px;">New Order Request</h1>
      <p style="margin:6px 0 0;font-size:13px;opacity:.9;">Reference ${reference}</p>
    </div>
    <div style="padding:26px 20px;">
      <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:10px 15px;border-radius:5px;font-size:13px;color:#856404;margin-bottom:20px;">
        <strong>Received:</strong> ${escapeHtml(timestamp)}
      </div>

      <div style="background:#f8f9fa;border-left:4px solid #0284c7;padding:15px 20px;border-radius:5px;margin-bottom:22px;font-size:14px;color:#333;line-height:1.8;">
        <div><strong>Name:</strong> ${escapeHtml(name)}</div>
        <div><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#0284c7;text-decoration:none;">${escapeHtml(email)}</a></div>
        <div><strong>Phone:</strong> ${escapeHtml(phone)}</div>
        <div><strong>Shipping Address:</strong> ${escapeHtml(address)}</div>
        ${notes ? `<div><strong>Message:</strong> ${escapeHtml(notes)}</div>` : ''}
      </div>

      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;border-bottom:2px solid #eee;">Product</th>
            <th style="padding:10px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;border-bottom:2px solid #eee;">Qty</th>
            <th style="padding:10px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;border-bottom:2px solid #eee;">Price</th>
            <th style="padding:10px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;border-bottom:2px solid #eee;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}${totalsHtml}</tbody>
      </table>

      <center>
        <a href="mailto:${escapeHtml(email)}?subject=Re: Order ${reference}"
          style="display:inline-block;background:#0284c7;color:#fff;text-decoration:none;padding:12px 30px;border-radius:6px;font-weight:600;margin-top:24px;">
          Reply to ${escapeHtml(name)}
        </a>
      </center>
    </div>
    <div style="background:#f8f9fa;padding:18px;text-align:center;border-top:1px solid #e9ecef;">
      <p style="margin:4px 0;color:#6c757d;font-size:12px;"><strong>BuyResearchChems</strong> - Order request from website checkout</p>
    </div>
  </div>
</body>
</html>`,
    });

    // 2. Confirmation to the customer
    let confirmation = { messageId: 'not-sent', status: 'skipped' };
    try {
      confirmation = await transporter.sendMail({
        from: `"BuyResearchChems" <${FROM_EMAIL}>`,
        to: email,
        replyTo: STORE_EMAIL,
        subject: `Order request received (${reference}) - BuyResearchChems`,
        text: `Dear ${name},

Thank you for your order request with BuyResearchChems.

We have received your request and will reply within 24 hours with secure payment instructions.
${detailsText}
If you have any questions, reply to this email or contact ${STORE_EMAIL}.

Best regards,
The BuyResearchChems Team`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:640px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#0284c7 100%);color:#fff;padding:34px 20px;text-align:center;">
      <h1 style="margin:0;font-size:24px;">Order Request Received</h1>
      <p style="margin:8px 0 0;font-size:13px;opacity:.9;">Reference ${reference}</p>
    </div>
    <div style="padding:28px 20px;">
      <p style="font-size:17px;color:#333;margin:0 0 16px;">Dear <strong>${escapeHtml(name)}</strong>,</p>
      <p style="color:#555;line-height:1.6;margin:0 0 20px;">
        Thank you for your order request. Our team is reviewing it now and will contact you with secure payment instructions.
      </p>

      <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:14px 18px;border-radius:5px;text-align:center;margin-bottom:22px;">
        <p style="margin:0;color:#856404;font-size:14px;font-weight:600;">Expected response time: within 24 hours</p>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;border-bottom:2px solid #eee;">Product</th>
            <th style="padding:10px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;border-bottom:2px solid #eee;">Qty</th>
            <th style="padding:10px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;border-bottom:2px solid #eee;">Price</th>
            <th style="padding:10px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:#888;border-bottom:2px solid #eee;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}${totalsHtml}</tbody>
      </table>

      <div style="background:#f8f9fa;border-left:4px solid #0284c7;padding:15px 20px;border-radius:5px;margin-top:22px;font-size:14px;color:#333;line-height:1.8;">
        <div><strong>Phone:</strong> ${escapeHtml(phone)}</div>
        <div><strong>Shipping Address:</strong> ${escapeHtml(address)}</div>
        ${notes ? `<div><strong>Your message:</strong> ${escapeHtml(notes)}</div>` : ''}
      </div>

      <p style="color:#555;line-height:1.6;margin-top:22px;">
        Questions? Reply to this email or contact
        <a href="mailto:${STORE_EMAIL}" style="color:#0284c7;text-decoration:none;">${STORE_EMAIL}</a>.
      </p>
      <p style="color:#555;margin-top:18px;">Best regards,<br><strong>The BuyResearchChems Team</strong></p>
    </div>
    <div style="background:#f8f9fa;padding:22px;text-align:center;border-top:1px solid #e9ecef;">
      <div style="font-size:19px;font-weight:700;color:#0284c7;margin-bottom:8px;">BuyResearchChems</div>
      <p style="margin:4px 0;color:#6c757d;font-size:12px;">Premium Research Chemicals</p>
      <p style="margin-top:12px;font-size:11px;color:#999;">&copy; ${new Date().getFullYear()} BuyResearchChems. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
      });
    } catch (confirmError) {
      console.warn('Could not send customer confirmation:', confirmError.message);
      confirmation = { messageId: 'failed', status: 'error', error: confirmError.message };
    }

    return NextResponse.json({
      success: true,
      reference,
      message: 'Order request sent successfully',
      details: {
        notification: { messageId: notification.messageId, status: 'sent' },
        confirmation: { messageId: confirmation.messageId, status: confirmation.status || 'sent' },
      },
    });
  } catch (error) {
    console.error('Order request error:', error);
    return NextResponse.json(
      { error: 'Failed to send your order request. Please try again later.' },
      { status: 500 }
    );
  }
}
