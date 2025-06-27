import Converter from '@/components/Converter';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function MediaConvertPage() {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  return <Converter showModeSelector={false} />;
}
