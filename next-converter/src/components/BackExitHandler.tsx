'use client';

import useBackExit from '@/lib/hooks/useBackExit';
import { tabs } from './BottomNav';

export default function BackExitHandler() {
  useBackExit(tabs.length);
  return null;
}
