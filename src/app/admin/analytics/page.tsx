import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminAnalytics from '@/components/AdminAnalytics';

export const metadata = { title: 'تحليلات المتجر | لوحة الإدارة' };

export default async function AdminAnalyticsPage() {
  const admin = await getAdminSession();
  if (!admin) redirect('/admin/login');
  return <AdminAnalytics />;
}
