'use client';
import { useSession, signOut } from 'next-auth/react';

interface HeaderProps {
  subtitle: string;
}

export default function Header({ subtitle }: HeaderProps) {
  const { data: session } = useSession();
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
}
