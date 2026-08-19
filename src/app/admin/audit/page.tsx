import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminAudit from '@/components/AdminAudit';

export const metadata = { title: 'سجل الأحداث | لوحة الإدارة' };

export default async function AdminAuditPage() {
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');
  return <AdminAudit />;
}
