import { redirect } from 'next/navigation';

export default function ConvertPage() {
  redirect('/convert/media');
  return null;
}
