'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
export function Modal({ children, label, close }: { children: React.ReactNode; label: string; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; const previous = document.activeElement as HTMLElement | null; const overflow = document.body.style.overflow; dialog?.showModal(); document.body.style.overflow = 'hidden'; return () => { dialog?.close(); document.body.style.overflow = overflow; previous?.focus(); }; }, []);
  return <dialog ref={ref} aria-label={label} onCancel={e => {e.preventDefault(); close();}} onClick={e => { if(e.target === e.currentTarget) close(); }}><div className="modal-inner"><button className="modal-close icon-button" onClick={close} aria-label="閉じる"><X size={22}/></button>{children}</div></dialog>;
}
