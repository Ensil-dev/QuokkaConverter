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
  try {
    await addAllowedEmail(email.trim());
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
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
  try {
    await removeAllowedEmail(email.trim());
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : '서버 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
