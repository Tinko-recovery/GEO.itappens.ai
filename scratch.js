const fs = require('fs');
const envStr = fs.readFileSync('.env', 'utf-8');
for (const line of envStr.split('\n')) {
  if (line.includes('=')) {
    const [k, ...v] = line.split('=');
    let val = v.join('=').trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    process.env[k.trim()] = val;
  }
}
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

async function main() {
  console.log("Testing DB connection...");
  const prisma = new PrismaClient();
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.emailOTP.upsert({
      where: { email: 'test@example.com' },
      update: { otp, expiresAt, verified: false },
      create: { email: 'test@example.com', otp, expiresAt, verified: false },
    });
    console.log("DB upsert success.");
  } catch (err) {
    console.error("DB Error:", err.message || err);
  }

  console.log("Testing Nodemailer...");
  try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
    await transporter.verify();
    console.log("Nodemailer verify success.");
  } catch (err) {
    console.error("Nodemailer Error:", err.message || err);
  }
}
main().finally(() => process.exit(0));
