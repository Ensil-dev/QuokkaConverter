'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/auth';
import { useTranslations } from 'next-intl';

export interface UserAuthProps {
  onSignOut?: () => void;
  callbackUrl?: string;
  className?: string;
}

export default function UserAuth({
  onSignOut,
  callbackUrl = '/',
  className = ''
}: UserAuthProps) {
  const { session } = useAuth();
  const t = useTranslations('Auth');

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      signOut({ callbackUrl });
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className={`user-info ${className}`}>
      <span className="user-email">{session.user?.email}</span>
      <button onClick={handleSignOut} className="logout-btn">
        {t('signOut')}
      </button>
    </div>
  );
}