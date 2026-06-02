import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// Ensure the secret is exactly 32 bytes for aes-256-gcm
const getSecretKey = () => {
  const secret = process.env.AUTH0_SECRET || 'default-secret-do-not-use-in-prod';
  return crypto.createHash('sha256').update(String(secret)).digest('base64').substring(0, 32);
};

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(hash: string): string {
  const parts = hash.split(':');
  if (parts.length !== 3) throw new Error('Invalid encryption format');

  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = Buffer.from(parts[2], 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, getSecretKey(), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
