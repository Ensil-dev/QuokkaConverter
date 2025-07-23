import BottomNav from '@/components/BottomNav';
import { AppHeightSetter } from '@/components/shared/AppHeightSetter';

export default function ConvertLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeightSetter />
      <main className="min-h-[calc(100dvh-80px)] w-full flex-1 overflow-y-auto">
        <div className="container min-h-full">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
