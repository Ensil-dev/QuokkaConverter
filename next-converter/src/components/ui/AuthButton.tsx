'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/lib/auth';
import { useTranslations } from 'next-intl';
import { loginWithGoogle } from '@/lib/utils';

export interface AuthButtonProps {
  variant?: 'default' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  showEmail?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  className?: string;
  loginText?: string;
  logoutText?: string;
}

export default function AuthButton({
  variant = 'default',
  size = 'md',
  showEmail = true,
  onLogin = loginWithGoogle,
  onLogout,
  className = '',
  loginText,
  logoutText
}: AuthButtonProps) {
  const { session, status } = useAuth();
  const t = useTranslations('Auth');

  const defaultLoginText = loginText || t('signIn', { fallback: '로그인' });
  const defaultLogoutText = logoutText || t('signOut', { fallback: '로그아웃' });

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      signOut({ callbackUrl: '/' });
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-sm px-3 py-1.5';
      case 'lg': return 'text-lg px-6 py-3';
      default: return 'text-base px-4 py-2';
    }
  };

  const getButtonClasses = (isLogout = false) => {
    const baseClasses = `
      inline-flex items-center gap-2 font-medium rounded-md 
      transition-all duration-200 cursor-pointer border
      ${getSizeClasses()}
    `;

    if (isLogout) {
      return `${baseClasses} 
        bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300
        dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30
      `;
    }

    return `${baseClasses}
      bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300
      dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30
    `;
  };

  if (status === 'loading') {
    return (
      <div className={`${getSizeClasses()} ${className}`}>
        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded dark:bg-gray-700"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <button
        onClick={onLogin}
        className={`${getButtonClasses()} ${className}`}
        aria-label={defaultLoginText}
      >
        {variant !== 'icon-only' && (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {variant !== 'compact' && defaultLoginText}
          </>
        )}
        {variant === 'icon-only' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleLogout}
        className={`${getButtonClasses(true)} ${className}`}
        aria-label={defaultLogoutText}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        {defaultLogoutText}
      </button>
    );
  }

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleLogout}
        className={`${getButtonClasses(true)} ${className}`}
        aria-label={defaultLogoutText}
        title={`${session.user?.email} - ${defaultLogoutText}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    );
  }

  // Default variant - show user info and logout button
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showEmail && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {session.user?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {session.user?.email}
          </span>
        </div>
      )}
      <button
        onClick={handleLogout}
        className={`${getButtonClasses(true)}`}
        aria-label={defaultLogoutText}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        {defaultLogoutText}
      </button>
    </div>
  );
}