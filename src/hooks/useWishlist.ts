'use client';
import { useState, useEffect, useCallback } from 'react';

const KEY = 'mose_wishlist';

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(read());
    setReady(true);
    const handler = () => setIds(read());
    window.addEventListener('mose-wishlist-changed', handler);
    return () => window.removeEventListener('mose-wishlist-changed', handler);
  }, []);

  const sync = useCallback(() => {
    const next = read();
    localStorage.setItem(KEY, JSON.stringify(next));
    setIds(next);
    window.dispatchEvent(new Event('mose-wishlist-changed'));
  }, []);

  const toggle = useCallback(
    (id: string) => {
      const cur = read();
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      setIds(next);
      window.dispatchEvent(new Event('mose-wishlist-changed'));
    },
    []
  );

  const remove = useCallback(
    (id: string) => {
      const next = read().filter((x) => x !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      setIds(next);
      window.dispatchEvent(new Event('mose-wishlist-changed'));
    },
    []
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, count: ids.length, ready, toggle, remove, has };
}
