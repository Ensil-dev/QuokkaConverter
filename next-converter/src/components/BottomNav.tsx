'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaPhotoVideo, FaFilePdf } from 'react-icons/fa';
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

  const tabs = [
    { href: '/convert', icon: <FaHome size={20} />, label: '홈' },
    { href: '/convert/media', icon: <FaPhotoVideo size={20} />, label: '미디어 변환' },
    { href: '/convert/pdf', icon: <FaFilePdf size={20} />, label: 'PDF 변환' },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-md transition-all duration-300 ease-in-out ${visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-full'}`}
    >
      <ul className="flex">
        {tabs.map(({ href, icon, label }) => {
          const active = pathname === href || (href !== '/convert' && pathname.startsWith(href));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex h-12 flex-col items-center justify-center text-sm transition-colors ${active ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
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
