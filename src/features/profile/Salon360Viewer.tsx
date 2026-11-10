'use client';
import { useEffect, useRef, useState } from 'react';
import { adjustView, defaultView, projectPanorama } from './panorama';
import { ProfileDemo } from './ui';
import s from './profile.module.css';

export function PanoramaViewer({ source }: { source?: string }) {
  const [view, setView] = useState(defaultView);
  const [loaded, setLoaded] = useState<{ source: string; pixels: ImageData }>();
  const [failedSource, setFailedSource] = useState<string>();
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenNote, setFullscreenNote] = useState('');
  const texture = loaded?.source === source ? loaded?.pixels : undefined;
  const failed = !!source && failedSource === source;
  const canvas = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointer: number; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!source) return;
    const image = new Image();
    image.onload = () => {
      const layer = document.createElement('canvas');
      layer.width = image.naturalWidth;
      layer.height = image.naturalHeight;
      const context = layer.getContext('2d', { willReadFrequently: true });
      try {
        if (!context || layer.width !== layer.height * 2) throw Error('Expected a 2:1 equirectangular image');
        context.drawImage(image, 0, 0);
        setLoaded({ source, pixels: context.getImageData(0, 0, layer.width, layer.height) });
      } catch { setFailedSource(source); }
    };
    image.onerror = () => setFailedSource(source);
    image.src = source;
    return () => { image.onload = null; image.onerror = null; };
  }, [source]);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!texture || !context || !element) return;
    const frame = requestAnimationFrame(() => {
      const pixels = context.createImageData(element.width, element.height);
      projectPanorama(texture, pixels, view);
      context.putImageData(pixels, 0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [texture, view]);

  useEffect(() => {
    function update() { setFullscreen(document.fullscreenElement === box.current); }
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  function move(yaw: number, pitch: number, zoom?: number) {
    setView(current => adjustView(current, yaw, pitch, zoom));
  }

  if (!source || failed) return <p className={s.empty} role="status">{failed ? 'パノラマ画像を読み込めませんでした。' : 'パノラマ画像はまだ登録されていません。'}</p>;

  return <div ref={box} className={s.viewerBox}>
    <canvas ref={canvas} width={560} height={280} className={s.viewer} tabIndex={0}
      aria-label="サロンの360度ビュー。矢印キーで移動、プラスとマイナスで拡大縮小、Homeでリセット"
      onKeyDown={event => {
        const directions: Record<string, [number, number, number?]> = {
          ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, 10], ArrowDown: [0, -10], '+': [0, 0, .2], '-': [0, 0, -.2],
        };
        if (event.key === 'Home') { event.preventDefault(); setView(defaultView); }
        else if (Object.hasOwn(directions, event.key)) { event.preventDefault(); move(...directions[event.key]); }
      }}
      onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY };
      }}
      onPointerMove={event => {
        const previous = drag.current;
        if (!previous || previous.pointer !== event.pointerId) return;
        move((previous.x - event.clientX) * .45, (event.clientY - previous.y) * .3);
        drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY };
      }}
      onLostPointerCapture={() => { drag.current = null; }}
    />
    <div className={s.toolbar}>
      <button type="button" onClick={() => move(-15, 0)}>左を見る</button><button type="button" onClick={() => move(15, 0)}>右を見る</button>
      <button type="button" onClick={() => move(0, 10)}>上を見る</button><button type="button" onClick={() => move(0, -10)}>下を見る</button>
      <button type="button" disabled={view.zoom >= 2.6} onClick={() => move(0, 0, .2)}>拡大</button>
      <button type="button" disabled={view.zoom <= 1} onClick={() => move(0, 0, -.2)}>縮小</button>
      <button type="button" onClick={() => setView(defaultView)}>視点をリセット</button>
      <button type="button" onClick={async () => {
        try {
          setFullscreenNote('');
          if (document.fullscreenElement === box.current) await document.exitFullscreen();
          else if (document.fullscreenEnabled && box.current) await box.current.requestFullscreen();
          else setFullscreenNote('このブラウザでは全画面表示を利用できません。');
        } catch { setFullscreenNote('全画面表示へ切り替えられませんでした。'); }
      }}>{fullscreen ? '全画面を終了' : '全画面'}</button>
      <span>{texture ? '方位 ' + Math.round(view.yaw) % 360 + '° · 仰角 ' + Math.round(view.pitch) + '° · 倍率 ' + view.zoom.toFixed(1) : 'パノラマ読み込み中'}</span>
      {fullscreenNote && <span role="status">{fullscreenNote}</span>}
    </div>
  </div>;
}

export default function Salon360Viewer() {
  const [available, setAvailable] = useState(true);
  return <ProfileDemo id="P06" title="架空のサロンを見回す" guide="ドラッグやタッチで左右を見回せます。上下の向き、拡大、リセットはボタンでも操作できます。">
    <p>デモ用の3Dモデルから生成したパノラマです。</p>
    <PanoramaViewer key={String(available)} source={available ? '/profile-demo/salon-360.png' : undefined} />
    <button type="button" aria-pressed={!available} onClick={() => setAvailable(value => !value)}>パノラマ未登録時の表示</button>
  </ProfileDemo>;
}
