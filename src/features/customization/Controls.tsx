'use client';

import { useState, type ReactNode } from 'react';
import { hexPattern } from '../interactive/colors';
import { sectionNames } from './content';
import {
  applyTheme, colorFields, defaults, faqStyles, fonts, illustrated, languages, layouts, modes,
  reorder, safeColor, sections, shapes, themes, type ColorField, type SiteCustomization,
} from './settings';
import s from './customization.module.css';

export type EditorProps = { settings: SiteCustomization; update: (patch: Partial<SiteCustomization>) => void };

export function Choice<T extends string>({ label, options, value, change }: {
  label: string; options: readonly T[]; value: T; change: (value: T) => void;
}) {
  return <label>{label}<select value={value} onChange={event => {
    const selected = options.find(option => option === event.target.value);
    if (selected !== undefined) change(selected);
  }}>{options.map(option => <option key={option}>{option}</option>)}</select></label>;
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <fieldset className={s.panel}><legend>{title}</legend>{children}</fieldset>;
}

export function ColorModeSwitcher({ settings, update }: EditorProps) {
  return <Choice label="カラーモード（Light / Dark / System）" options={modes} value={settings.colorMode} change={colorMode => update({ colorMode })}/>;
}

function ColorEditor({ field, value, change }: { field: ColorField; value: string; change: (value: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return <div className={s.colorRow}><label>{colorFields[field]}<input type="color" value={value} onChange={event => {
    setDraft(null);
    change(safeColor(field, event.target.value));
  }}/></label><label>HEXコード<input value={draft ?? value} maxLength={7} onChange={event => {
    const next = event.target.value;
    setDraft(next);
    if (hexPattern.test(next)) change(safeColor(field, next));
  }} onBlur={event => {
    if (!hexPattern.test(event.currentTarget.value)) change(safeColor(field, event.currentTarget.value));
    setDraft(null);
  }}/></label></div>;
}

export function ThemeColorEditor({ settings, update }: EditorProps) {
  const fields = Object.keys(colorFields) as ColorField[];
  return <>
    <Choice label="テーマプリセット" options={[...Object.keys(themes) as (keyof typeof themes)[], 'custom']} value={settings.themePreset}
      change={theme => update(theme === 'custom' ? { themePreset: theme } : applyTheme(theme))}/>
    {fields.map(field => <ColorEditor key={field} field={field} value={settings[field]} change={value => update({ [field]: value, themePreset: 'custom' })}/>)}
    <button type="button" onClick={() => update(applyTheme('natural'))}>配色を初期値に戻す</button>
    <small>文字色は背景とのコントラストに合わせて自動で調整します。</small>
  </>;
}

export function LanguageSwitcher({ settings, update }: EditorProps) {
  return <Choice label="サイトの言語（JA / EN）" options={languages} value={settings.language} change={language => update({ language })}/>;
}

const fontOptions = Object.keys(fonts) as (keyof typeof fonts)[];
const scales = [
  ['fontSize', '文字サイズ', 13, 21, 1, 'px'],
  ['letterSpacing', '文字間隔', 0, 0.12, 0.01, 'em'],
  ['lineHeight', '行間', 1.3, 2.2, 0.1, ''],
] as const;

export function FontEditor({ settings, update }: EditorProps) {
  return <>
    <Choice label="フォントプリセット" options={fontOptions} value={settings.fontPreset} change={fontPreset => update({ fontPreset, headingFont: fontPreset, bodyFont: fontPreset === 'Elegant Serif' ? defaults.bodyFont : fontPreset })}/>
    <Choice label="見出しフォント" options={fontOptions} value={settings.headingFont} change={headingFont => update({ headingFont })}/>
    <Choice label="本文フォント" options={fontOptions} value={settings.bodyFont} change={bodyFont => update({ bodyFont })}/>
    {scales.map(([field, label, min, max, step, unit]) => <label key={field}>{label} {settings[field]}{unit}
      <input type="range" min={min} max={max} step={step} value={settings[field]} onChange={event => update({ [field]: event.target.valueAsNumber })}/>
    </label>)}
    <button type="button" onClick={() => {
      const { fontPreset, headingFont, bodyFont, fontSize, letterSpacing, lineHeight } = defaults;
      update({ fontPreset, headingFont, bodyFont, fontSize, letterSpacing, lineHeight });
    }}>フォントを初期値に戻す</button>
  </>;
}

export function SectionReorder({ settings, update }: EditorProps) {
  const { sectionOrder } = settings;
  const [dragging, setDragging] = useState<number | null>(null);
  function move(from: number, to: number) {
    update({ sectionOrder: reorder(sectionOrder, from, to) });
  }
  return <>
    <p>ハンドルをドラッグするか、上下ボタンで並べ替えます。</p>
    <ol className={s.order}>{sectionOrder.map((section, index) => <li key={section} data-order-index={index} data-dragging={dragging === index}>
      <span className={s.handle} aria-hidden="true"
        onPointerDown={event => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(index);
        }}
        onPointerUp={event => {
          const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-order-index]');
          if (target && event.currentTarget.closest('ol')?.contains(target)) move(index, Number(target.getAttribute('data-order-index')));
          setDragging(null);
        }} onLostPointerCapture={() => setDragging(null)}>⠿</span>
      <span>{sectionNames[section]}</span>
      <button type="button" aria-label={sectionNames[section] + 'を上へ'} disabled={index === 0} onClick={() => move(index, index - 1)}>↑</button>
      <button type="button" aria-label={sectionNames[section] + 'を下へ'} disabled={index === sectionOrder.length - 1} onClick={() => move(index, index + 1)}>↓</button>
    </li>)}</ol>
    <p className={s.sr} aria-live="polite">{sectionOrder.map(section => sectionNames[section]).join('、')}</p>
    <button type="button" onClick={() => update({ sectionOrder: defaults.sectionOrder })}>順序を初期値に戻す</button>
  </>;
}

export function SectionVisibility({ settings, update }: EditorProps) {
  const hidden = settings.hiddenSections;
  return <>
    {sections.map(section => <label className={s.check} key={section}><input type="checkbox" checked={!hidden.includes(section)} onChange={event => update({
      hiddenSections: event.target.checked ? hidden.filter(item => item !== section) : [...hidden, section],
    })}/>{sectionNames[section]}</label>)}
    {hidden.includes('reservation') && <p role="status">予約セクションが非表示のため、予約ボタンも隠れています。</p>}
    <div className={s.actions}><button type="button" onClick={() => update({ hiddenSections: [] })}>全表示</button>
      <button type="button" onClick={() => update({ hiddenSections: defaults.hiddenSections })}>表示を初期値に戻す</button></div>
  </>;
}

export function LayoutSwitcher({ settings, update }: EditorProps) {
  return illustrated.map(section => <Choice key={section} label={sectionNames[section] + 'のレイアウト'} options={layouts}
    value={settings.sectionLayouts[section]} change={layout => update({ sectionLayouts: { ...settings.sectionLayouts, [section]: layout } })}/>);
}

export function ImageShapeSwitcher({ settings, update }: EditorProps) {
  return <Choice label="画像の形状" options={shapes} value={settings.imageShape} change={imageShape => update({ imageShape })}/>;
}

export function FAQStyleSwitcher({ settings, update }: EditorProps) {
  return <>
    <Choice label="FAQのデザイン" options={faqStyles} value={settings.faqStyle} change={faqStyle => update({ faqStyle })}/>
    <label className={s.check}><input type="checkbox" checked={settings.allowMultiple} onChange={event => update({ allowMultiple: event.target.checked })}/>複数の回答を同時に開く</label>
  </>;
}

