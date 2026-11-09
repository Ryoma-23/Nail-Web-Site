'use client';

import { useRef, useState } from 'react';
import { Demo } from './ui';
import s from './gallery.module.css';

const clip = {
  title: 'ローズグロウ｜光の移ろい',
  poster: '/gallery-demo/rose-detail.svg',
  src: '/gallery-demo/rose-glow.webm',
};

export default function VideoGallery() {
  const player = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [message, setMessage] = useState('');
  async function togglePlayback() {
    const video = player.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      return;
    }
    try {
      await video.play();
      setMessage('');
    } catch {
      setMessage('この環境では動画を再生できませんでした。');
    }
  }

  return <Demo label="G11" title="動画で見るネイルの質感" guide="再生すると、光の角度による見え方を短いアニメーションで確認できます。">
    <h4>{clip.title}</h4>
    <video className={s.video} aria-label={clip.title} ref={player} poster={clip.poster} preload="none" playsInline
      muted={muted} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
      <source src={clip.src} type="video/webm" />
    </video>
    <div className={s.bar}>
      <button type="button" className={s.primary} onClick={togglePlayback}>{playing ? '一時停止' : '再生'}</button>
      <button type="button" onClick={() => setMuted(value => !value)} aria-pressed={muted}>ミュート {muted ? 'オン' : 'オフ'}</button>
    </div>
    <p className={s.notice}>作品イラストを使った無音のサンプル動画です。</p>
    {message && <p role="status">{message}</p>}
  </Demo>;
}
