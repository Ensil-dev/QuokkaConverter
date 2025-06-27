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
      className={`fixed bottom-0 left-0 right-0 h-[80px] w-full border-t border-zinc-700 bg-zinc-900 shadow-md transition-all duration-300 ease-in-out ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
    >
      <ul className="m-0 grid w-full list-none grid-cols-2 p-0">
        {tabs.map(({ href, icon, label }) => {
          const active = pathname === href || (href !== '/convert' && pathname.startsWith(href));
          return (
            <li key={href} className="m-0 p-0">
              <Link
                href={href}
                className={`flex h-[80px] w-full flex-col items-center justify-center gap-y-1 text-sm transition-colors ${
                  active ? 'bg-zinc-800 text-purple-500' : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
