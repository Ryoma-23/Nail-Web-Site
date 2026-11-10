'use client';

import Image from 'next/image';
import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react';
import { art, content } from './content';
import { fonts, mixColor, readableInk, type Section, type SiteCustomization } from './settings';
import s from './customization.module.css';

export type Device = 'mobile' | 'desktop';

export function PreviewDeviceSwitcher({ device, change }: { device: Device; change: (device: Device) => void }) {
  return <div className={s.actions} role="group" aria-label="ミニサイトの表示幅">
    <button type="button" aria-pressed={device === 'mobile'} onClick={() => change('mobile')}>スマートフォン</button>
    <button type="button" aria-pressed={device === 'desktop'} onClick={() => change('desktop')}>PC</button>
  </div>;
}

export function MiniSitePreview({ settings, device, prefix, showNews = false }: {
  settings: SiteCustomization; device: Device; prefix: string; showNews?: boolean;
}) {
  const [systemDark, setSystemDark] = useState(false);
  const faqGroup = useId();
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const refresh = () => setSystemDark(media.matches);
    refresh();
    media.addEventListener('change', refresh);
    return () => media.removeEventListener('change', refresh);
  }, []);

  const dark = settings.colorMode === 'dark' || (settings.colorMode === 'system' && systemDark);
  const background = dark ? mixColor(settings.backgroundColor, 20, 0.9) : settings.backgroundColor;
  const primary = dark ? mixColor(settings.primaryColor, 255, 0.45) : settings.primaryColor;
  const accent = dark ? mixColor(settings.accentColor, 20, 0.75) : settings.accentColor;
  const ink = readableInk(background);
  const variables = {
    '--mini-bg': background, '--mini-ink': ink,
    '--mini-primary': primary, '--mini-primary-ink': readableInk(primary),
    '--mini-accent': accent, '--mini-accent-ink': readableInk(accent),
    '--mini-card': dark ? '#312830' : mixColor(background, ink === '#FFFFFF' ? 0 : 255, 0.07),
    '--mini-heading': fonts[settings.headingFont], '--mini-body': fonts[settings.bodyFont],
    '--mini-size': settings.fontSize + 'px', '--mini-spacing': settings.letterSpacing + 'em',
    '--mini-line': settings.lineHeight,
  } as CSSProperties;
  const copy = content[settings.language];
  const visible = settings.sectionOrder.filter(section => !settings.hiddenSections.includes(section));
  const canBook = visible.includes('reservation');
  const anchor = (name: string) => prefix + '-' + name;

  function picture(src: string, alt: string, shaped = true) {
    return <div className={s.image} data-shape={shaped ? settings.imageShape : undefined}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 90vw, 480px" />
    </div>;
  }

  function illustrated(section: 'concept' | 'gallery' | 'profile', image: ReactNode, description?: ReactNode) {
    return <div className={s.illustrated} data-layout={settings.sectionLayouts[section]}>
      <div className={s.visual}>{image}</div>
      <div className={s.sectionCopy}><h3>{copy.names[section]}</h3>{description}</div>
    </div>;
  }

  const blocks: Record<Section, ReactNode> = {
    concept: illustrated('concept', picture(art.concept, ''), <p>{copy.concept}</p>),
    gallery: illustrated('gallery', <div className={s.gallery}>{art.gallery.map((src, index) =>
      <figure key={src} id={anchor('art-' + index)} tabIndex={-1}>{picture(src, '')}<figcaption>{copy.gallery[index]}</figcaption></figure>)}</div>),
    profile: illustrated('profile', picture(art.profile, 'Kotomi'), <><strong>Kotomi</strong><p>{copy.profile}</p></>),
    menu: <><h3>{copy.names.menu}</h3><div className={s.menu}>{copy.menu.map(([name, description, price], index) =>
      <article key={name} id={anchor('menu-' + index)} tabIndex={-1}><h4>{name}</h4><b>{price}</b><p>{description}</p></article>)}</div></>,
    faq: <><h3>{copy.names.faq}</h3><div className={s.faq} data-style={settings.faqStyle}>
      {copy.faq.map(([question, answer], index) => <details key={question} id={anchor('faq-' + index)} name={settings.allowMultiple ? undefined : faqGroup}>
        <summary>{question}</summary><div className={s.answer}><p>{answer}</p></div>
      </details>)}
    </div></>,
    reservation: <div className={s.reservation}><h3>{copy.names.reservation}</h3><p>{copy.reserve}</p><p>{copy.demo}</p></div>,
  };

  return <div className={s.device} data-device={device}>
    <div className={s.site} style={variables} lang={settings.language} data-dark={dark} aria-label="MELLOW NAIL">
      <header className={s.siteHeader}><b>MELLOW NAIL</b><nav aria-label={settings.language === 'ja' ? 'ミニサイト内ナビゲーション' : 'Mini site navigation'}>
        {visible.map(section => <a key={section} href={'#' + anchor(section)}>{copy.names[section]}</a>)}
      </nav></header>
      <div className={s.hero}>
        {picture(art.hero, '', false)}
        <div><small>{copy.kicker}</small><h2>{copy.hero}</h2><p>{copy.intro}</p>
          {canBook && <a className={s.book} href={'#' + anchor('reservation')}>{copy.book}</a>}
        </div>
      </div>
      {showNews && <section className={s.siteSection} id={anchor('news')} tabIndex={-1}>
        <h3>{copy.news[0]}</h3><h4>{copy.news[1]}</h4><p>{copy.news[2]}</p>
      </section>}
      {visible.map(section => <section className={s.siteSection} key={section} id={anchor(section)} tabIndex={-1}>{blocks[section]}</section>)}
      <footer className={s.siteFooter}>MELLOW NAIL <span>© Kotomi</span></footer>
    </div>
  </div>;
}

