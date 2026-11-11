const nodeMailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.emailSend,
        pass: process.env.mdpSend
    }
});

// Branding (modifiable via .env, valeurs par défaut sinon)
const COMPANY_NAME = process.env.COMPANY_NAME || 'Our Platform';
const APP_URL = process.env.APP_URL || 'https://www.example.com';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || process.env.emailSend;

// Protège le HTML contre l'injection via les données utilisateur
const escapeHtml = (str = '') =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

// Layout commun réutilisable pour tous les emails
const baseTemplate = ({ title, preheader, content }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <tr>
            <td align="center" style="background-color:#1e3a8a; padding:28px 20px;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; letter-spacing:0.5px;">${COMPANY_NAME}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 40px; color:#1f2937; font-size:16px; line-height:1.6;">
              ${content}
            </td>
          </tr>

          <tr>
            <td align="center" style="background-color:#f9fafb; padding:20px 30px; font-size:12px; line-height:1.5; color:#9ca3af; border-top:1px solid #e5e7eb;">
              Need help? Contact us at
              <a href="mailto:${SUPPORT_EMAIL}" style="color:#6b7280;">${SUPPORT_EMAIL}</a><br />
              © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// Function to send an email
const sendEmail = async (to, subject, html, text) => {
    try {
        const mailOptions = {
            from: `"${COMPANY_NAME}" <${process.env.emailSend}>`,
            to,
            subject,
            html,
            text, // version texte brut (meilleure délivrabilité)
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // permet à l'appelant de gérer l'échec
    }
};

//types Email
// Email welcome message for new users
const sendWelcomeEmail = async (to, name) => {
    const safeName = escapeHtml(name);
    const subject = `Welcome to ${COMPANY_NAME}`;

    const html = baseTemplate({
        title: subject,
        preheader: `Welcome ${safeName}! Your account is ready.`,
        content: `
          <h2 style="margin:0 0 20px; font-size:20px; color:#111827;">Hello ${safeName},</h2>

          <p style="margin:0 0 16px;">
            Thank you for joining ${COMPANY_NAME}. Your account has been created successfully,
            and you can now access all the features of our platform.
          </p>

          <p style="margin:0 0 24px;">
            To get started, simply log in to your account:
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 28px;">
            <tr>
              <td align="center" style="background-color:#2563eb; border-radius:6px;">
                <a href="${APP_URL}/login"
                   style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:16px; font-weight:bold; text-decoration:none;">
                  Access my account
                </a>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 16px;">
            If you have any questions, our team is happy to help — just reply to this email.
          </p>

          <p style="margin:0;">
            Kind regards,<br />
            <strong>The ${COMPANY_NAME} Team</strong>
          </p>`,
    });

    const text =
        `Hello ${name},\n\n` +
        `Thank you for joining ${COMPANY_NAME}. Your account has been created successfully.\n\n` +
        `Log in here: ${APP_URL}/login\n\n` +
        `If you have any questions, just reply to this email.\n\n` +
        `Kind regards,\nThe ${COMPANY_NAME} Team`;

    return sendEmail(to, subject, html, text);
};

//Email de réinitialisation du mot de passe
const forgotPasswordEmail = async (to, name, resetLink) => {
    const safeName = escapeHtml(name);
    const subject = `Password Reset Request for ${COMPANY_NAME}`;
    const html = baseTemplate({
        title: subject,
        preheader: `Hello ${safeName}, you requested a password reset.`,
        content: `
          <h2 style="margin:0 0 20px; font-size:20px; color:#111827;">Hello ${safeName},</h2>
          <p style="margin:0 0 16px;">
            We received a request to reset your password for your ${COMPANY_NAME} account.
            If you did not make this request, please ignore this email. 
          </p>
          <p style="margin:0 0 24px;">
            To reset your password, click the button below: 
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 28px;">
            <tr>
              <td align="center" style="background-color:#2563eb; border-radius:6px;">
                <a href="${resetLink}"
                   style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:16px; font-weight:bold; text-decoration:none;">
                  Reset Password
                </a>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 16px;">
            If you have any questions, our team is happy to help — just reply to this email.
          </p>

          <p style="margin:0;">
            Kind regards,<br />
            <strong>The ${COMPANY_NAME} Team</strong>
          </p>`,
    });

    const text =
        `Hello ${name},\n\n` +
        `Thank you for joining ${COMPANY_NAME}. Your account has been created successfully.\n\n` +
        `Log in here: ${process.env.APP_URL}/login\n\n` +
        `If you have any questions, just reply to this email.\n\n` +
        `Kind regards,\nThe ${COMPANY_NAME} Team`;

    return sendEmail(to, subject, html, text);
};

module.exports = { sendEmail, sendWelcomeEmail, forgotPasswordEmail };