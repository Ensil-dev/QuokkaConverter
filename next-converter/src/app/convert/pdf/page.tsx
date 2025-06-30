import PdfConverter from '@/components/PdfConverter';
import requireAuth from '@/lib/requireAuth';

export default async function PdfConvertPage() {
  await requireAuth();
  return <PdfConverter />;
}
