const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendContactEmail = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"ElectroMart Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    replyTo: email,
    subject: `[ElectroMart Contact] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%); padding: 30px; border-radius: 8px 8px 0 0;">
          <h1 style="color: #00d4ff; margin: 0; font-size: 24px;">⚡ ElectroMart</h1>
          <p style="color: #a0a0b8; margin: 5px 0 0;">New Contact Form Submission</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333; width: 100px;">From:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;"><a href="mailto:${email}" style="color: #00d4ff;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Subject:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px;">
            <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
            <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #00d4ff; color: #555; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">This email was sent from the ElectroMart contact form. Reply directly to this email to respond to ${name}.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };