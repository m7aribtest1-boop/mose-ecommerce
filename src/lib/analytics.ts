'use client';

const SESSION_KEY = '_mose_sid';
const SESSION_MAX_AGE = 60 * 60 * 24; // 1 day → rotates daily
export const CONSENT_KEY = '_mose_consent';
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export type ConsentValue = 'granted' | 'denied';

export function getConsent(): ConsentValue | null {
  if (typeof document === 'undefined') return null;
  const c = document.cookie
    .split('; ')
    .find((x) => x.startsWith(CONSENT_KEY + '='));
  return c ? (c.split('=')[1] as ConsentValue) : null;
}

export function setConsent(value: ConsentValue) {
  if (typeof document === 'undefined') return;
  document.cookie = `${CONSENT_KEY}=${value}; path=/; max-age=${CONSENT_MAX_AGE}; samesite=lax`;
}

export type TrackType =
  | 'PAGE_VIEW'
  | 'PRODUCT_VIEW'
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'CHECKOUT_START'
  | 'ORDER_COMPLETE'
  | 'WHATSAPP_CLICK'
  | 'SEARCH';

/** Anonymous, daily-rotated session id (stored in a first-party cookie). */
export function getSessionId(): string {
  if (typeof document === 'undefined') return '';
  const existing = document.cookie
    .split('; ')
    .find((c) => c.startsWith(SESSION_KEY + '='));
  if (existing) return existing.split('=')[1];
  const sid = crypto.randomUUID();
  document.cookie = `${SESSION_KEY}=${sid}; path=/; max-age=${SESSION_MAX_AGE}; samesite=lax`;
  return sid;
}

/** Fire an analytics event. Respects Do-Not-Track + explicit consent (opt-in). Fire-and-forget. */
export function track(type: TrackType, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  if (navigator.doNotTrack === '1') return; // privacy: honour DNT
  if (getConsent() !== 'granted') return; // privacy: opt-in consent required
  const params = new URLSearchParams(window.location.search);
  const payload = {
    type,
    sessionId: getSessionId(),
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    ...data,
  };
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
