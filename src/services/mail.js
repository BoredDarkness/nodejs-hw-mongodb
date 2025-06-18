import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendResetEmail(to, token) {
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link valid 5 minutes.</p>`,
  });
  return info;
}
