import PdfConverter from '@/components/PdfConverter';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function PdfConvertPage() {
  const session = await auth();
  if (!session) {
    redirect('/');
  }
  return <PdfConverter />;
}
