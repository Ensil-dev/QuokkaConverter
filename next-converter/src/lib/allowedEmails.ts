import fs from 'fs/promises';
import path from 'path';
import { ADMIN_EMAIL } from './admin';
import { getDb } from './firebaseAdmin';

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
  const db = await getDb();
  let dbEmails: string[] = [];
  if (db) {
    const snapshot = await db.collection('allowedEmails').get();
    dbEmails = snapshot.docs.map((doc: { id: string }) => doc.id);
  } else {
    dbEmails = await readFileEmails();
  }
  const set = new Set<string>([...envEmails, ...dbEmails, ADMIN_EMAIL]);
  return Array.from(set);
}

export async function addAllowedEmail(email: string): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.collection('allowedEmails').doc(email).set({ createdAt: Date.now() });
    return;
  }
  const fileEmails = await readFileEmails();
  if (!fileEmails.includes(email)) {
    fileEmails.push(email);
    await fs.writeFile(filePath, JSON.stringify(fileEmails, null, 2));
  }
}
