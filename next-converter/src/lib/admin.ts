export const ADMIN_EMAILS =
  process.env.ALLOWED_EMAILS?.split(',').map(e => e.trim()).filter(Boolean) ??
  ['dlwjd164@gmail.com'];

export function isAdmin(email?: string | null): boolean {
  return email ? ADMIN_EMAILS.includes(email) : false;
}
