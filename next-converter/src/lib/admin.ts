export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dlwjd164@gmail.com';

export function isAdmin(email?: string | null): boolean {
  return email === ADMIN_EMAIL;
}
