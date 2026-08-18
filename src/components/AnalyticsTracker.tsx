'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track('PAGE_VIEW');
  }, [pathname]);
  return null;
}
