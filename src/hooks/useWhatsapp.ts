'use client';

import { useEffect, useState } from 'react';
import { storeConfig } from '@/lib/store';

export function useWhatsappNumber() {
  const [number, setNumber] = useState(storeConfig.whatsapp.number);
  useEffect(() => {
    fetch('/api/store-settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (d && d.whatsappNumber) setNumber(d.whatsappNumber); })
      .catch(() => {});
  }, []);
  return number;
}
