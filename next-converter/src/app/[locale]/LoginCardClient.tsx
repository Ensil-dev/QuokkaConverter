'use client';

import LoginCard from '@/components/LoginCard';
import { loginWithGoogle } from '@/lib/utils';

export default function LoginCardClient() {
  return <LoginCard onLogin={loginWithGoogle} />;
}
