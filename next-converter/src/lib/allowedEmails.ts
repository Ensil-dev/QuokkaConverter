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
  const fileEmails = await readFileEmails();
  const set = new Set<string>([...envEmails, ...fileEmails, ADMIN_EMAIL]);
  return Array.from(set);
}

export async function addAllowedEmail(email: string): Promise<void> {
  const fileEmails = await readFileEmails();
  if (!fileEmails.includes(email)) {
    fileEmails.push(email);
    await fs.writeFile(filePath, JSON.stringify(fileEmails, null, 2));
  }
}
