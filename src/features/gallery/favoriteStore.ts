'use client';

import { useSyncExternalStore } from 'react';
import { sampleDesigns } from './data';

const key = 'mellow.gallery-favorites.v1';
const eventName = 'mellow:gallery-favorites';
const empty: readonly string[] = [];
let cached = empty;
let last: string | null | undefined;
let storageUnavailable = false;

function read() {
  if (storageUnavailable) return cached;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== last) {
      const value: unknown = JSON.parse(raw ?? '[]');
      cached = Array.isArray(value) ? sampleDesigns.filter(item => value.includes(item.id)).map(item => item.id) : empty;
      last = raw;
    }
  } catch {
    storageUnavailable = true;
  }
  return cached;
}

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === key || event.key === null) onChange();
  }
  window.addEventListener(eventName, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(eventName, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function useFavorites() {
  return useSyncExternalStore(subscribe, read, () => empty);
}

export function toggleFavorite(id: string) {
  const current = read();
  cached = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
  try {
    const raw = JSON.stringify(cached);
    localStorage.setItem(key, raw);
    last = raw;
    storageUnavailable = false;
  } catch {
    storageUnavailable = true;
  }
  window.dispatchEvent(new Event(eventName));
}
