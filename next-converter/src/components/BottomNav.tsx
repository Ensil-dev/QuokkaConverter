'use client';

import Link from 'next/link';
import { FaHome, FaExchangeAlt, FaUser } from 'react-icons/fa';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full border-t border-gray-200 bg-white shadow-md">
      <ul className="flex justify-around py-2">
        <li>
          <Link href="/" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
            <FaHome size={24} />
            <span className="mt-1 text-xs">홈</span>
          </Link>
        </li>
        <li>
          <Link href="/convert" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
            <FaExchangeAlt size={24} />
            <span className="mt-1 text-xs">변환</span>
          </Link>
        </li>
        <li>
          <Link href="/account" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
            <FaUser size={24} />
            <span className="mt-1 text-xs">계정</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
