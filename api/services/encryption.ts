import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Генерирует случайный ключ шифрования
 */
function generateKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Шифрует текст с помощью AES-256-CBC
 */
export function encryptText(text: string, customKey?: string): { encrypted: string; key: string } {
  const key = customKey || generateKey();
  const keyBuffer = Buffer.from(key, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Объединяем IV и зашифрованные данные
  const result = iv.toString('hex') + ':' + encrypted;

  return {
    encrypted: result,
    key,
  };
}

/**
 * Расшифровывает текст с помощью AES-256-CBC
 */
export function decryptText(encryptedText: string, key: string): string {
  const keyBuffer = Buffer.from(key, 'hex');
  const parts = encryptedText.split(':');

  if (parts.length !== 2) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

