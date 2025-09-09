'use client';
import React from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { FaImage, FaFilePdf, FaImages, FaUserShield } from 'react-icons/fa';
import { useAuth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { useTranslations } from 'next-intl';

const BottomNav = React.memo(function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const t = useTranslations('Navigation');

  const availableTabs = React.useMemo(() => {
    const tabs = [
      { href: '/convert/media', icon: <FaImage size={20} />, label: t('media') },
      { href: '/convert/gif', icon: <FaImages size={20} />, label: t('gif') },
      { href: '/convert/pdf', icon: <FaFilePdf size={20} />, label: t('pdf') },
      { href: '/admin', icon: <FaUserShield size={20} />, label: t('admin'), adminOnly: true },
    ];
    return tabs.filter(tab => !tab.adminOnly || isAdmin(user?.email));
  }, [t, user]);

  if (pathname === '/convert') {
    // convert 자체 페이지(예: 리디렉트 대상)일 경우만 숨김
    return null;
  }
  const colsClass = availableTabs.length === 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <nav className="bottom-nav z-10 h-[80px] w-full border-t bg-[var(--background)] shadow-md">
      <ul className={`m-0 grid w-full list-none ${colsClass} p-0`}>
        {availableTabs.map(({ href, icon, label }) => {
          const active = pathname === href || (href !== '/convert' && pathname.startsWith(href));
          return (
            <li key={href} className="m-0 p-0">
              <Link
                href={href as '/convert/media' | '/convert/gif' | '/convert/pdf' | '/admin'}
                className={`flex h-[80px] w-full flex-col items-center justify-center gap-y-1 text-sm transition-all duration-300 ease-in-out ${
                  active
                    ? 'scale-95 bg-zinc-800 text-[skyblue] ring-2 ring-purple-500 ring-offset-2'
                    : 'text-gray-400 hover:scale-105 hover:text-gray-100'
                }`}
              >
                {icon}
                <span className='pt-[8px]'>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

// BackExitHandler에서 사용하기 위해 export (임시 호환성)
export const tabs = [
  { href: '/convert/media', label: 'File Converter', adminOnly: false },
  { href: '/convert/gif', label: 'GIF Creator', adminOnly: false },
  { href: '/convert/pdf', label: 'PDF Manager', adminOnly: false },
  { href: '/admin', label: 'Admin Panel', adminOnly: true },
];

export default BottomNav;
