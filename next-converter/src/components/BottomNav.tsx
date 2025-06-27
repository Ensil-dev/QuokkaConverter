'use client';

import Link from 'next/link';
import { FaPhotoVideo, FaFilePdf } from 'react-icons/fa';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-md">
      <ul className="flex justify-around py-2">
        <li>
          <Link
            href="/convert/media"
            className="flex flex-col items-center text-gray-700 hover:text-blue-500"
          >
            <FaPhotoVideo size={24} />
            <span className="mt-1 text-xs">미디어 변환</span>
          </Link>
        </li>
        <li>
          <Link
            href="/convert/pdf"
            className="flex flex-col items-center text-gray-700 hover:text-blue-500"
          >
            <FaFilePdf size={24} />
            <span className="mt-1 text-xs">PDF 변환</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
