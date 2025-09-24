import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function testEmail() {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER,
      subject: 'SMTP Test Email',
      text: 'Merhaba, bu bir test e-postasıdır.',
    });
    console.log('Email başarıyla gönderildi!');
  } catch (err) {
    console.error('Email gönderilemedi:', err);
  }
}

testEmail();
