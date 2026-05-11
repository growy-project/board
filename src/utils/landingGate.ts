'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LAST_SEEN_KEY = 'growy_last_seen';
const LANDING_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const readStamp = (): number | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(LAST_SEEN_KEY);
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const writeStamp = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
};

export const markLandingSeen = () => {
  writeStamp();
};

export const useLandingGate = (): boolean => {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stamp = readStamp();
    const fresh = stamp !== null && Date.now() - stamp < LANDING_TTL_MS;
    if (!fresh) {
      router.replace('/landing');
      return;
    }
    writeStamp();
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
};
