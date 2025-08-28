import fs from 'fs/promises';
import path from 'path';
import { ADMIN_EMAIL } from './admin';

const filePath = path.join(process.cwd(), 'src/data/allowedEmails.json');

async function readFileEmails(): Promise<string[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as string[];
  } catch {
    return [];
  }
}

export async function getAllowedEmails(): Promise<string[]> {
  const envEmails = process.env.ALLOWED_EMAILS?.split(',').map(e => e.trim()).filter(Boolean) ?? [];
  if (process.env.NODE_ENV === 'production') {
    return Array.from(new Set<string>([...envEmails, ADMIN_EMAIL]));
  }
  const fileEmails = await readFileEmails();
  return Array.from(new Set<string>([...envEmails, ...fileEmails, ADMIN_EMAIL]));
}

export async function addAllowedEmail(email: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  const fileEmails = await readFileEmails();
  if (!fileEmails.includes(email)) {
    fileEmails.push(email);
    await fs.writeFile(filePath, JSON.stringify(fileEmails, null, 2));
  }
}
