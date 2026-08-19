'use client';

interface Sub {
  email: string;
  city: string | null;
  createdAt: string;
}

export default function SubscribersExport({ rows }: { rows: Sub[] }) {
  function exportCsv() {
    const header = 'email,city,createdAt\n';
    const body = rows
      .map((r) => `${r.email},${r.city || ''},${r.createdAt}`)
      .join('\n');
    const blob = new Blob(['﻿' + header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mose-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={exportCsv} className="btn-outline px-6 py-2.5 disabled:opacity-50" disabled={rows.length === 0}>
      ⬇ تصدير CSV
    </button>
  );
}
