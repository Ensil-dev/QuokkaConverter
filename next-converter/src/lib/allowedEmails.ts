import { ADMIN_EMAILS } from './admin';

const EDGE_CONFIG_URL = process.env.EDGE_CONFIG;
const EDGE_KEY = 'allowedEmails';

export async function getAllowedEmails(): Promise<string[]> {
  try {
    const emails = await fetchAllowedEmails();
    return Array.from(new Set([...emails, ...ADMIN_EMAILS]));
  } catch (err) {
    console.error('Failed to fetch allowed emails', err);
    return ADMIN_EMAILS;
  }
}

export async function addAllowedEmail(email: string): Promise<void> {
  const emails = await getAllowedEmails();
  if (!emails.includes(email)) {
    emails.push(email);
    const toUpdate = emails.filter((e) => !ADMIN_EMAILS.includes(e));
    await updateEdgeConfigAllowedEmails(toUpdate);
  }
}

export async function removeAllowedEmail(email: string): Promise<void> {
  const emails = (await getAllowedEmails()).filter((e) => e !== email);
  const toUpdate = emails.filter((e) => !ADMIN_EMAILS.includes(e));
  await updateEdgeConfigAllowedEmails(toUpdate);
}

async function fetchAllowedEmails(): Promise<string[]> {
  if (!EDGE_CONFIG_URL) {
    return [];
  }
  const res = await fetch(`${EDGE_CONFIG_URL}/item/${EDGE_KEY}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to read Edge Config');
  }
  const data = await res.json().catch(() => ({}));
  return (data?.value as string[]) || [];
}

async function updateEdgeConfigAllowedEmails(emails: string[]): Promise<void> {
  const id = process.env.EDGE_CONFIG_ID;
  const token = process.env.EDGE_CONFIG_TOKEN;
  if (!id || !token) {
    throw new Error('Missing Edge Config ID or token');
  }
  try {
    const res = await fetch(`https://api.vercel.com/v1/edge-config/${id}/items`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'upsert',
            key: EDGE_KEY,
            value: emails,
          },
        ],
      }),
    });
    if (!res.ok) {
      throw new Error('Failed to update Edge Config');
    }
  } catch (err) {
    console.error('Failed to update Edge Config', err);
    throw err;
  }
}
