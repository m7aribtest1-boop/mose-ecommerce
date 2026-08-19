import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminSettings from '@/components/AdminSettings';

export const metadata = { title: 'إعدادات المتجر | لوحة الإدارة' };

export default async function AdminSettingsPage() {
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');
  return <AdminSettings />;
}
