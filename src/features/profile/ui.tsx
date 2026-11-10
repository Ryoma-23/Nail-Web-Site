'use client';
import type { ReactNode } from 'react';
import { Demo } from '../gallery/ui';
import type { Photo } from './data';
import s from './profile.module.css';

export function ProfileDemo({ id, title, guide, children }: { id: string; title: string; guide: string; children: ReactNode }) {
  return <Demo label={id} title={title} guide={guide}><div className={s.layout}>
    <p className={s.sample}>架空のサロン・人物によるデモ</p>{children}
  </div></Demo>;
}

export function PhotoView({ photo, eager = false }: { photo: Photo; eager?: boolean }) {
  // These local JPEGs are sized for the static export.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={s.photo} src={photo.src} alt={photo.alt} width={624} height={420} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

export function Choices({ label, options, value, change }: {
  label: string; options: readonly string[]; value: string; change: (value: string) => void;
}) {
  return <div className={s.choices} role="group" aria-label={label}>{options.map(option =>
    <button key={option} type="button" aria-pressed={value === option} onClick={() => change(option)}>{option}</button>)}</div>;
}
