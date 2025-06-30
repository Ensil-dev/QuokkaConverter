import Converter from '@/components/Converter';
import requireAuth from '@/lib/requireAuth';

export default async function MediaConvertPage() {
  await requireAuth();
  return <Converter showModeSelector={false} />;
}
