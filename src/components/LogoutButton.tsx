'use client';
import { useRouter } from 'next/navigation';

export function LogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }
  return (
    <button onClick={logout} className={`text-sm text-secondary-600 hover:text-primary-600 font-medium ${className}`}>
      تسجيل الخروج
    </button>
  );
}
