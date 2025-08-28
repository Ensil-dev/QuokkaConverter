import fs from 'fs/promises';
import path from 'path';
import { ADMIN_EMAIL } from './admin';

const VERCEL_API_BASE = 'https://api.vercel.com';

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
    const emails = await getAllowedEmails();
    if (!emails.includes(email)) {
      emails.push(email);
      await updateVercelAllowedEmails(emails);
    }
    return;
  }
  const fileEmails = await readFileEmails();
  if (!fileEmails.includes(email)) {
    fileEmails.push(email);
    await fs.writeFile(filePath, JSON.stringify(fileEmails, null, 2));
  }
}

export async function removeAllowedEmail(email: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    const emails = (await getAllowedEmails()).filter(e => e !== email);
    await updateVercelAllowedEmails(emails);
    return;
  }
  const fileEmails = await readFileEmails();
  const updated = fileEmails.filter(e => e !== email);
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
}

async function updateVercelAllowedEmails(emails: string[]): Promise<void> {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const token = process.env.VERCEL_TOKEN;
  if (!projectId || !token) {
    return;
  }
  try {
    const listRes = await fetch(`${VERCEL_API_BASE}/v9/projects/${projectId}/env`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const listData = await listRes.json().catch(() => ({}));
    const envVar = (listData as { envs?: { id: string; key: string; target: string[] }[] }).envs?.find(
      e => e.key === 'ALLOWED_EMAILS'
    );
    if (envVar) {
      await fetch(`${VERCEL_API_BASE}/v9/projects/${projectId}/env/${envVar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    await fetch(`${VERCEL_API_BASE}/v9/projects/${projectId}/env`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'ALLOWED_EMAILS',
        value: emails.join(','),
        target: ['production'],
      }),
    });
  } catch (err) {
    console.error('Failed to update Vercel env', err);
  }
}
