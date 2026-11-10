'use client';
import { useEffect, useId, useRef, useState, useSyncExternalStore, type ComponentType, type CSSProperties, type ReactNode } from 'react';
import { PhotoView } from '../profile/ui';
import { hero, sections } from './data';
import s from './animation.module.css';

export type Playback = { started: boolean; playing: boolean; reduced: boolean; speed: number; run: number };
type FrameProps = { id: string; title: string; guide: string; example: string; Scene: ComponentType<Playback>; speedControl?: boolean };

function subscribeMotion(change: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', change);
  return () => query.removeEventListener('change', change);
}

export function AnimationFrame({ id, title, guide, example, Scene, speedControl = true }: FrameProps) {
  const [playback, setPlayback] = useState({ started: false, playing: false, key: 0, run: 0 });
  const [speed, setSpeed] = useState(1);
  const [visible, setVisible] = useState(true);
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => false);
  const frame = useRef<HTMLDivElement>(null);
  const heading = useId();
  const canPlay = playback.playing && visible && !reduced;

  useEffect(() => {
    const node = frame.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '60px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <section className={s.frame} ref={frame} aria-labelledby={heading} data-playing={canPlay} data-started={playback.started}
    style={{ '--speed': speed } as CSSProperties}>
    <div className={s.intro}><span>{id} / MELLOW STUDIO</span><h3 id={heading}>{title}</h3><p>{guide}</p></div>
    <div className={s.row} role="group" aria-label="演出の再生操作">
      <button type="button" className={s.primary} onClick={() => setPlayback(current => ({ ...current, started: true, playing: true, run: current.run + 1 }))}>演出を再生</button>
      <button type="button" disabled={!playback.started || reduced} onClick={() => setPlayback(current => ({ ...current, playing: !current.playing }))}>{playback.playing ? '一時停止' : '再開'}</button>
      <button type="button" onClick={() => { setPlayback(current => ({ started: false, playing: false, key: current.key + 1, run: 0 })); setSpeed(1); }}>演出をリセット</button>
      {speedControl && <label>再生速度<select value={speed} onChange={event => setSpeed(Number(event.target.value))}>
        <option value={0.5}>0.5倍</option><option value={1}>1倍</option><option value={1.5}>1.5倍</option><option value={2}>2倍</option>
      </select></label>}
    </div>
    {reduced && <p className={s.note}>端末の設定に合わせて、動きを抑えた表示です。</p>}
    <Scene key={playback.key} started={playback.started} playing={canPlay} reduced={reduced} speed={speed} run={playback.run} />
    <p className={s.note}>活用例 · {example}</p>
  </section>;
}

export function Options<T extends string>({ label, options, value, change }: { label: string; options: readonly T[]; value: T; change: (value: T) => void }) {
  return <div className={s.row} role="group" aria-label={label}>{options.map(option =>
    <button type="button" key={option} aria-pressed={option === value} onClick={() => change(option)}>{option}</button>)}</div>;
}

export function Slider({ label, value, min, max, step = 1, change }: { label: string; value: number; min: number; max: number; step?: number; change: (value: number) => void }) {
  return <label className={s.range}>{label} <output>{value}</output><input type="range" aria-label={label} min={min} max={max} step={step} value={value} onChange={event => change(Number(event.target.value))}/></label>;
}

export function Hero({ children, image = hero.image, effect, style }: { children?: ReactNode; image?: typeof hero.image; effect?: string; style?: CSSProperties }) {
  return <article className={s.hero} data-effect={effect} style={style}>
    <div className={s.heroCopy}><span>{hero.eyebrow}</span><h4>{hero.title}</h4><p>{hero.description}</p>{children}</div>
    <div className={s.heroImage}><PhotoView photo={image} eager /></div>
  </article>;
}

export function Contents() {
  return <div className={s.contents}>{sections.map(item => <article key={item.title} className={s.card}>
    <PhotoView photo={item.photo}/><h4>{item.title}</h4><p>{item.text}</p>
  </article>)}</div>;
}

export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let request = 0;
    function update() {
      if (request) return;
      request = requestAnimationFrame(() => {
        request = 0;
        if (node) setProgress(Math.min(1, node.scrollTop / Math.max(1, node.scrollHeight - node.clientHeight)));
      });
    }
    node.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    observer?.observe(node);
    update();
    return () => { cancelAnimationFrame(request); node.removeEventListener('scroll', update); observer?.disconnect(); };
  }, []);
  return { ref, progress };
}

export function useScrollPlayback(ref: { current: HTMLDivElement | null }, { playing, run, speed, reduced }: Playback) {
  const initialized = useRef(0);
  useEffect(() => {
    const node = ref.current;
    if (!node || !run) return;
    if (initialized.current !== run) { initialized.current = run; node.scrollTop = 0; }
    if (reduced) { node.scrollTop = node.scrollHeight; return; }
    if (!playing) return;
    let request = 0;
    let last = 0;
    let position = node.scrollTop;
    function advance(now: number) {
      if (!node) return;
      if (last) position += Math.min(32, now - last) * .22 * speed;
      last = now;
      node.scrollTop = position;
      if (node.scrollTop < node.scrollHeight - node.clientHeight - 1) request = requestAnimationFrame(advance);
    }
    const stop = () => cancelAnimationFrame(request);
    request = requestAnimationFrame(advance);
    node.addEventListener('wheel', stop, { passive: true });
    node.addEventListener('touchstart', stop, { passive: true });
    node.addEventListener('keydown', stop);
    return () => { stop(); node.removeEventListener('wheel', stop); node.removeEventListener('touchstart', stop); node.removeEventListener('keydown', stop); };
  }, [ref, playing, run, speed, reduced]);
}
