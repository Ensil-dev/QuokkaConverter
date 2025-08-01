'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/auth';

interface HeaderProps {
  subtitle: string;
}

const Header = React.memo(function Header({ subtitle }: HeaderProps) {
  const { session } = useAuth();
  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1 className="select-none">QuokkaConverter</h1>
          {session && (
            <div className="user-info">
              <span className="user-email">{session.user?.email}</span>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="logout-btn">
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="subtitle">{subtitle}</p>
    </>
  );
});

export default Header;
