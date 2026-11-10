'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { initialData, type AdminData } from './data';

const State = createContext<{
  data: AdminData;
  set: <K extends keyof AdminData>(key: K, next: AdminData[K] | ((current: AdminData[K]) => AdminData[K])) => void;
  reset: () => void;
  makeImage: (file: File) => string;
  releaseImage: (src: string) => void;
} | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(initialData);
  const assets = useRef(new Set<string>());
  function releaseImage(src: string) {
    if (assets.current.delete(src)) URL.revokeObjectURL(src);
  }
  function reset() {
    assets.current.forEach(releaseImage);
    setData(initialData());
  }
  useEffect(() => {
    const urls = assets.current;
    return () => { urls.forEach(url => URL.revokeObjectURL(url)); urls.clear(); };
  }, []);
  return <State.Provider value={{
    data, reset, releaseImage,
    makeImage(file) {
      const url = URL.createObjectURL(file);
      assets.current.add(url);
      return url;
    },
    set(key, next) {
      setData(current => ({ ...current, [key]: typeof next === 'function' ? next(current[key]) : next }));
    },
  }}>{children}</State.Provider>;
}

export function useAdmin() {
  const context = useContext(State);
  if (!context) throw new Error('AdminProvider is required');
  return context;
}

const maxImageSize = 5 * 1024 * 1024;
export const imageTypes = 'image/jpeg,image/png,image/webp';
export async function validateImage(file: File) {
  if (!imageTypes.split(',').includes(file.type) || !file.size || file.size > maxImageSize) {
    return 'JPEG・PNG・WebP形式で5MB以下の画像を選んでください。';
  }
  try {
    const bitmap = await createImageBitmap(file);
    bitmap.close();
    return '';
  } catch {
    return '画像を読み込めません。別のファイルを選んでください。';
  }
}
export function useFilePreview(file: File | undefined) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const frame = requestAnimationFrame(() => setSrc(url));
    return () => { cancelAnimationFrame(frame); URL.revokeObjectURL(url); };
  }, [file]);
  return file ? src : '';
}

