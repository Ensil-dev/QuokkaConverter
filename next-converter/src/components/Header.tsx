'use client';
import React from 'react';
import { LanguageSelector, UserAuth } from '@/components/ui';

interface HeaderProps {
  subtitle: string;
}

const Header = React.memo(function Header({ subtitle }: HeaderProps) {
  return (
    <>
      <div className="header">
        <div className="header-content">
          <h1 className="text-[40px] select-none">QuokkaConverter</h1>
          <div className="header-right">
            <div className="header-top-right">
              <LanguageSelector variant="segment" />
            </div>
            <div className="header-bottom-right">
              <UserAuth />
            </div>
          </div>
        </div>
      </div>
      <p className="subtitle">{subtitle}</p>
    </>
  );
});

export default Header;
