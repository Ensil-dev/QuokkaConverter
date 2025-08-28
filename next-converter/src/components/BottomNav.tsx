'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaImage, FaFilePdf, FaImages, FaUserShield } from 'react-icons/fa';
import { useAuth } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';

export const tabs = [
  { href: '/convert/media', icon: <FaImage size={20} />, label: '확장자 변환' },
  { href: '/convert/gif', icon: <FaImages size={20} />, label: 'GIF 생성' },
  { href: '/convert/pdf', icon: <FaFilePdf size={20} />, label: 'PDF 관리' },
  { href: '/admin', icon: <FaUserShield size={20} />, label: 'Admin 대시보드', adminOnly: true },
];


const BottomNav = React.memo(function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const availableTabs = React.useMemo(
    () => tabs.filter(tab => !tab.adminOnly || isAdmin(user?.email)),
    [user]
  );

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
                href={href}
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

export default BottomNav;
