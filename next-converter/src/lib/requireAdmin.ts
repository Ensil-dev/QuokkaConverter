import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from './admin';

export default async function requireAdmin() {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    redirect('/');
  }
  return session;
}
