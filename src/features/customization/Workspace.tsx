'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore, type ComponentType } from 'react';
import {
  ColorModeSwitcher, ThemeColorEditor, LanguageSwitcher, FontEditor, SectionReorder, SectionVisibility,
  LayoutSwitcher, ImageShapeSwitcher, FAQStyleSwitcher, Panel, type EditorProps,
} from './Controls';
import { MiniSitePreview, PreviewDeviceSwitcher, type Device } from './MiniSitePreview';
import { defaults, type SiteCustomization } from './settings';
import s from './customization.module.css';

const editors: { name: string; Editor: ComponentType<EditorProps> }[] = [
  { name: 'ダークモード', Editor: ColorModeSwitcher },
  { name: 'テーマカラー', Editor: ThemeColorEditor },
  { name: '言語', Editor: LanguageSwitcher },
  { name: 'フォント', Editor: FontEditor },
  { name: 'セクション並び替え', Editor: SectionReorder },
  { name: '表示・非表示', Editor: SectionVisibility },
  { name: 'レイアウト', Editor: LayoutSwitcher },
  { name: '画像の形状', Editor: ImageShapeSwitcher },
  { name: 'FAQアコーディオン', Editor: FAQStyleSwitcher },
];
const subscribe = () => () => {};

export function CustomizationWorkspace({ demo }: { demo?: number }) {
  const [settings, setSettings] = useState<SiteCustomization>(defaults);
  const [device, setDevice] = useState<Device>('desktop');
  const [revision, setRevision] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const canFullscreen = useSyncExternalStore(subscribe, () => document.fullscreenEnabled, () => false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
  const all = demo === undefined;
  const visible = all ? editors.slice(0, 8) : editors.slice(demo - 1, demo);
  const json = JSON.stringify(settings, null, 2);
  useEffect(() => {
    if (!all) return;
    const refresh = () => setFullscreen(document.fullscreenElement === canvas.current);
    document.addEventListener('fullscreenchange', refresh);
    return () => document.removeEventListener('fullscreenchange', refresh);
  }, [all]);
  function update(patch: Partial<SiteCustomization>) {
    setSettings(current => ({ ...current, ...patch }));
  }
  function reset() {
    setSettings(defaults);
    setDevice('desktop');
    setRevision(value => value + 1);
  }
  function download() {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mellow-site-customization.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function toggleFullscreen() {
    if (!canvas.current) return;
    setFullscreenError(false);
    try {
      if (fullscreen) await document.exitFullscreen();
      else await canvas.current.requestFullscreen();
    } catch {
      setFullscreenError(true);
    }
  }
  return <div className={s.workspace}>
    {all ? <div className={s.actions}><PreviewDeviceSwitcher device={device} change={setDevice}/><button type="button" onClick={reset}>全設定リセット</button></div> :
      demo <= 8 && <Link href="/features/customizer/">ほかの設定と組み合わせて試す →</Link>}
    <div className={all ? s.workgrid : s.workspace}>
      <div className={s.editors} key={revision}>{visible.map(({ name, Editor }, index) => all ?
        <details key={name} open={index === 0 || undefined}><summary>{name}</summary>
          <Panel title={name}><Editor settings={settings} update={update}/></Panel>
        </details> : <Panel key={name} title={name}><Editor settings={settings} update={update}/></Panel>)}
        {all && <details><summary>設定データ（JSON）</summary><Panel title="現在の設定">
          <textarea className={s.json} aria-label="現在の設定JSON" value={json} readOnly onFocus={event => event.currentTarget.select()}/>
          <button type="button" onClick={download}>JSONをダウンロード</button>
        </Panel></details>}
      </div>
      <div className={s.canvas} ref={canvas}>
        {all && canFullscreen && <div className={s.actions}>
          <button type="button" onClick={toggleFullscreen}>{fullscreen ? '全画面を閉じる' : '全画面で見る'}</button>
          {fullscreenError && <p role="status">この環境では全画面表示を切り替えられませんでした。</p>}
        </div>}
        <MiniSitePreview key={revision} prefix={all ? 'customizer' : 'demo'} settings={settings} device={device}/>
      </div>
    </div>
  </div>;
}

export const DarkMode = () => <CustomizationWorkspace demo={1}/>;
export const ThemeColor = () => <CustomizationWorkspace demo={2}/>;
export const Language = () => <CustomizationWorkspace demo={3}/>;
export const Font = () => <CustomizationWorkspace demo={4}/>;
export const Reorder = () => <CustomizationWorkspace demo={5}/>;
export const Visibility = () => <CustomizationWorkspace demo={6}/>;
export const Layout = () => <CustomizationWorkspace demo={7}/>;
export const ImageShape = () => <CustomizationWorkspace demo={8}/>;
export const FAQStyle = () => <CustomizationWorkspace demo={9}/>;

