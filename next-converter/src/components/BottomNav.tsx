'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaImage, FaFilePdf } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (pathname === '/convert') return null;

  const tabs = [
    { href: '/convert/media', icon: <FaImage size={20} />, label: '미디어' },
    { href: '/convert/pdf', icon: <FaFilePdf size={20} />, label: 'PDF' },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 border-t border-neutral-700 bg-neutral-900 shadow-md transition-all duration-300 ease-in-out ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
    >
      <ul className="flex justify-center gap-x-6 py-2">
        {tabs.map(({ href, icon, label }) => {
          const active = pathname === href || (href !== '/convert' && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex min-h-[48px] min-w-[64px] flex-col items-center justify-center whitespace-nowrap rounded-md px-4 text-sm transition-colors ${active ? 'border-t-2 border-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {icon}
                <span className="mt-1">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
