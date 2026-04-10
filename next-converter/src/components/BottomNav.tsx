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
    // data-ep-id: EdgePlus SDK가 click event 그룹핑 anchor로 사용한다.
    // dynamic class name(Tailwind arbitrary, build hash) 때문에 selector 그룹핑이
    // 깨지는 것을 막기 위한 stable identifier. label은 i18n 번역어라 빌드/locale마다
    // 변할 수 있으므로 path 기반 stable id를 부여한다.
    const tabs = [
      { href: '/convert/media', icon: <FaImage size={20} />, label: t('media'), epId: 'nav-media' },
      { href: '/convert/gif', icon: <FaImages size={20} />, label: t('gif'), epId: 'nav-gif' },
      { href: '/convert/pdf', icon: <FaFilePdf size={20} />, label: t('pdf'), epId: 'nav-pdf' },
      { href: '/admin', icon: <FaUserShield size={20} />, label: t('admin'), adminOnly: true, epId: 'nav-admin' },
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
        {availableTabs.map(({ href, icon, label, epId }) => {
          const active = pathname === href || (href !== '/convert' && pathname.startsWith(href));
          return (
            <li key={href} className="m-0 p-0">
              <Link
                href={href as '/convert/media' | '/convert/gif' | '/convert/pdf' | '/admin'}
                data-ep-id={epId}
                className={`flex h-[80px] w-full flex-col items-center justify-center gap-y-1 text-sm transition-all duration-300 ease-in-out ${
                  active
                    ? 'scale-95 bg-zinc-800 text-[skyblue] ring-2 ring-purple-500 ring-offset-2'
                    : 'text-gray-400 hover:scale-105 hover:text-gray-100'
                }`}
              >
                {icon}
                <span className='pt-[8px] text-center'>{label}</span>
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
