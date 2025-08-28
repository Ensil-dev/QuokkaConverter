import { ADMIN_EMAIL } from './admin';

const VERCEL_API_BASE = 'https://api.vercel.com';

export async function getAllowedEmails(): Promise<string[]> {
  const envEmails = process.env.ALLOWED_EMAILS?.split(',').map(e => e.trim()).filter(Boolean) ?? [];
  return Array.from(new Set<string>([...envEmails, ADMIN_EMAIL]));
}

export async function addAllowedEmail(email: string): Promise<void> {
  const emails = await getAllowedEmails();
  if (!emails.includes(email)) {
    emails.push(email);
    const toUpdate = emails.filter(e => e !== ADMIN_EMAIL);
    try {
      await updateVercelAllowedEmails(toUpdate);
      process.env.ALLOWED_EMAILS = toUpdate.join(',');
    } catch (err) {
      console.error('Failed to add allowed email', err);
      throw err;
    }
  }
}

export async function removeAllowedEmail(email: string): Promise<void> {
  const emails = (await getAllowedEmails()).filter(e => e !== email);
  const toUpdate = emails.filter(e => e !== ADMIN_EMAIL);
  try {
    await updateVercelAllowedEmails(toUpdate);
    process.env.ALLOWED_EMAILS = toUpdate.join(',');
  } catch (err) {
    console.error('Failed to remove allowed email', err);
    throw err;
  }
}

async function updateVercelAllowedEmails(emails: string[]): Promise<void> {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const token = process.env.VERCEL_TOKEN;
  if (!projectId || !token) {
    throw new Error('Missing Vercel project ID or token');
  }
  try {
    const listRes = await fetch(`${VERCEL_API_BASE}/v9/projects/${projectId}/env`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!listRes.ok) {
      throw new Error('Failed to fetch Vercel env list');
    }
    const listData = await listRes.json().catch(() => ({}));
    const envVar = (listData as { envs?: { id: string; key: string; target: string[] }[] }).envs?.find(
      e => e.key === 'ALLOWED_EMAILS'
    );
    if (envVar) {
      const deleteRes = await fetch(`${VERCEL_API_BASE}/v9/projects/${projectId}/env/${envVar.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!deleteRes.ok) {
        throw new Error('Failed to delete existing Vercel env');
      }
    }
    const createRes = await fetch(`${VERCEL_API_BASE}/v9/projects/${projectId}/env`, {
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
    if (!createRes.ok) {
      throw new Error('Failed to create Vercel env');
    }
  } catch (err) {
    console.error('Failed to update Vercel env', err);
    throw err;
  }
}
