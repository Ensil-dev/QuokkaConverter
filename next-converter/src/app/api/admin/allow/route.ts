import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { addAllowedEmail, removeAllowedEmail } from '@/lib/allowedEmails';
import { isAdmin } from '@/lib/admin';

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const { email } = await request.json();
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: '이메일이 필요합니다.' }, { status: 400 });
  }

  await addAllowedEmail(email.trim());
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const { email } = await request.json();
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: '이메일이 필요합니다.' }, { status: 400 });
  }

  await removeAllowedEmail(email.trim());
  return NextResponse.json({ success: true });
}
