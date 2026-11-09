'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { NailDesign } from './data';
import s from './gallery.module.css';

export function Demo({ label, title, guide, children }: { label: string; title: string; guide: string; children: ReactNode }) {
  return <div className={s.demo}><section className={s.body}>
    <header className={s.intro}><span>{label} / MELLOW STUDIO</span><h3>{title}</h3><p>{guide}</p></header>
    {children}
  </section></div>;
}

export function Art({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  // Local lightweight SVGs do not need Next.js image optimization.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={s.art} src={src} alt={alt} width={480} height={400} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

export function Grid({ designs, onOpen, extra, animatedKey }: {
  designs: readonly NailDesign[];
  onOpen?: (design: NailDesign) => void;
  extra?: (design: NailDesign) => ReactNode;
  animatedKey?: string;
}) {
  if (!designs.length) return <p className={s.empty}>該当する作品はありません。条件を変えてお試しください。</p>;
  return <div className={s.grid} key={animatedKey}>{designs.map(design => <article key={design.id} className={s.card}>
    {onOpen ? <button className={s.artButton} type="button" onClick={() => onOpen(design)} aria-label={design.title + 'を開く'}>
      <Art src={design.images[0]} alt={design.title + 'のネイルチップ見本'} />
    </button> : <Art src={design.images[0]} alt={design.title + 'のネイルチップ見本'} />}
    <div className={s.cardText}><span className={s.eyebrow}>{design.category}</span><h4>{design.title}</h4><p>{design.description}</p>{extra?.(design)}</div>
  </article>)}</div>;
}

export function Modal({ title, onClose, onKey, children }: {
  title: string; onClose: () => void; onKey?: (key: string) => boolean; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);
  return <dialog ref={ref} className={s.dialog} aria-labelledby={id}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={event => { if (onKey?.(event.key)) event.preventDefault(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className={s.dialogBody}>
      <div className={s.bar}><h3 id={id}>{title}</h3><button type="button" aria-label="閉じる" onClick={onClose}><X size={19}/></button></div>
      {children}
    </div>
  </dialog>;
}

export type Slide = { src: string; alt: string; label: string };

export function Lightbox({ slides, start, onClose }: { slides: readonly Slide[]; start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const slide = slides[index];
  function move(delta: number) {
    setIndex(current => (current + delta + slides.length) % slides.length);
  }
  return <Modal title={slide.label} onClose={onClose} onKey={key => {
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return false;
    move(key === 'ArrowLeft' ? -1 : 1);
    return true;
  }}>
    <div className={s.swipe} onTouchStart={event => {
      const point = event.touches[0];
      gesture.current = event.touches.length === 1 ? { x: point.clientX, y: point.clientY } : null;
    }} onTouchCancel={() => { gesture.current = null; }} onTouchEnd={event => {
      const point = event.changedTouches[0];
      const start = gesture.current;
      gesture.current = null;
      if (!start || event.touches.length) return;
      const dx = point.clientX - start.x;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(point.clientY - start.y)) move(dx > 0 ? -1 : 1);
    }}><Art src={slide.src} alt={slide.alt} eager /></div>
    <div className={s.bar}><button type="button" onClick={() => move(-1)} aria-label="前の画像"><ChevronLeft size={19}/></button>
      <span role="status">{index + 1} / {slides.length}</span>
      <button type="button" onClick={() => move(1)} aria-label="次の画像"><ChevronRight size={19}/></button></div>
  </Modal>;
}
