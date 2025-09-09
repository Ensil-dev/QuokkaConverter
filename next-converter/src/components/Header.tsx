'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/auth';
import { useTranslations } from 'next-intl';
import LanguageSegmentControl from '@/components/LanguageSegmentControl';

interface HeaderProps {
  subtitle: string;
}

const Header = React.memo(function Header({ subtitle }: HeaderProps) {
  const { session } = useAuth();
  const t = useTranslations('Auth');

  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1 className="select-none">QuokkaConverter</h1>
          <LanguageSegmentControl />
          <div className="header-actions">
            {session && (
              <div className="user-info">
                <span className="user-email">{session.user?.email}</span>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="logout-btn">
                  {t('signOut')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="subtitle">{subtitle}</p>
    </>
  );
});

export default Header;
