'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

export default function AdminEmailForm({ initialEmails, adminEmails }: { initialEmails: string[]; adminEmails: string[] }) {
  const [emails, setEmails] = useState(initialEmails);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/allow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setEmails([...emails, email.trim()]);
      setEmail('');
      toast.success('추가되었습니다');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || '추가 실패');
    }
  };

  const handleDelete = async (target: string) => {
    const res = await fetch('/api/admin/allow', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: target }),
    });
    if (res.ok) {
      setEmails(emails.filter(e => e !== target));
      toast.success('삭제되었습니다');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || '삭제 실패');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Google ID"
          className="flex-1 rounded border border-gray-300 p-2 text-black"
          required
        />
        <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          추가
        </button>
      </form>
      <ul className="mt-4 list-disc pl-4">
          {emails.map((e) => (
            <li key={e} className="flex items-center gap-2">
              <span>{e}</span>
              {!adminEmails.includes(e) && (
                <button
                  type="button"
                  onClick={() => handleDelete(e)}
                  className="text-sm text-red-500 hover:underline"
                >
                  삭제
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
