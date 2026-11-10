'use client';
import { useMemo, useRef, useState, type CSSProperties } from 'react';
import { Art, Modal } from '../gallery/ui';
import { publicOrigin } from './data';
import { websiteUrl } from './logic';
import { downloadFile, makeQR, qrPng, qrSvg, type QR } from './qr';
import { formats, printableCard, themes, type CardConfig } from './cardDesign';
import { Choices, MarketingDemo } from './ui';
import s from './marketing.module.css';

export function MarketingCard({ config, qr }: { config: CardConfig; qr?: QR }) {
  const theme = themes[config.theme];
  const format = formats[config.format];
  const isPop = config.format === '卓上POP';
  const person = config.format === '名刺型' && config.side === '表面';
  const photo = config.format === 'ショップカード' && config.side === '表面';
  return <article className={s.printCard} data-format={isPop ? 'pop' : 'card'} data-side={config.side}
    style={{ '--paper': theme.background, '--ink': theme.text, '--edge': theme.accent, '--type': theme.font } as CSSProperties}>
    <div className={s.stack}><small>{format.heading} · {config.side}</small><h4>{config.name}</h4>
      {person ? <><p>Kotomi · ネイリスト</p><small>Instagram：サンプル表示</small></> :
        <p>{config.side === '裏面' ? 'QRを読み取ってWebサイトへ' : format.tagline}</p>}
      {photo && <Art src="/gallery-demo/rose.svg" alt="ローズ色のネイル見本" />}
    </div>
    <div data-qr className={s.qrCode}>{qr ? <svg role="img" aria-label="WebサイトのQRコード" viewBox={'0 0 ' + qr.size + ' ' + qr.size} shapeRendering="crispEdges">
      <rect width="100%" height="100%" fill="white" /><path fill="black" d={qr.path} />
    </svg> : <p>有効なURLを入力するとQRを表示</p>}</div>
  </article>;
}

export default function QRBusinessCard() {
  const [name, setName] = useState('mellow');
  const [input, setInput] = useState(publicOrigin + '/');
  const [theme, setTheme] = useState<CardConfig['theme']>('Natural');
  const [format, setFormat] = useState<CardConfig['format']>('名刺型');
  const [side, setSide] = useState<CardConfig['side']>('表面');
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState('');
  const frame = useRef<HTMLIFrameElement>(null);
  const url = websiteUrl(input);
  const qr = useMemo(() => url ? makeQR(url) : undefined, [url]);
  const config = { name: name.trim() || 'mellow', theme, format, side };
  const size = formats[format];

  async function savePNG() {
    if (!qr) return;
    try {
      downloadFile(await qrPng(qr), 'mellow-qr.png');
      setMessage('PNGのダウンロードを開始しました。');
    } catch {
      setMessage('PNGを生成できませんでした。SVGで保存できます。');
    }
  }

  return <MarketingDemo id="B15" title="お店を紹介する印刷カード" guide="屋号とURLを入れ、テーマや表裏を切り替えてください。入力に合わせてQRコードが更新されます。">
    <div className={s.fields}><label>サンプル屋号<input maxLength={40} value={name} onChange={event => setName(event.target.value)} /></label>
      <label>サンプルURL<input type="url" value={input} maxLength={512} aria-invalid={!url} aria-describedby="qr-url-status"
        onChange={event => { setInput(event.target.value); setMessage(''); }} /></label></div>
    <p id="qr-url-status" role="status">{url ? 'QRに入るURL：' + url : 'http または https の有効なURLを512文字以内で入力してください。ユーザー名やパスワード付きURLは使用できません。'}</p>
    <Choices label="カードの種類" options={Object.keys(formats) as CardConfig['format'][]} value={format} change={setFormat} />
    <Choices label="デザインテーマ" options={Object.keys(themes) as CardConfig['theme'][]} value={theme} change={setTheme} />
    <Choices label="カードの表裏" options={['表面','裏面']} value={side} change={setSide} />
    <div className={s.paperStage}><MarketingCard config={config} qr={qr} /></div>
    <div className={s.row}>
      <button type="button" disabled={!qr} onClick={() => {
        if (!qr) return;
        downloadFile(new Blob([qrSvg(qr)], { type: 'image/svg+xml' }), 'mellow-qr.svg');
        setMessage('SVGのダウンロードを開始しました。');
      }}>QRをSVGで保存</button>
      <button type="button" disabled={!qr} onClick={savePNG}>QRをPNGで保存</button>
      <button type="button" disabled={!qr} onClick={() => setPrinting(true)}>印刷プレビュー</button>
    </div>
    <p role="status">{message}</p>
    <p>仕上がりの目安 · {size.width} × {size.height} mm。印刷会社へ渡す入稿データには、指定の余白や塗り足しを別途設定してください。</p>
    {printing && qr && <Modal title="印刷プレビュー" onClose={() => setPrinting(false)}>
      <p>{format} · {size.width} × {size.height} mm · {side}。用紙A4、拡大縮小100%を目安に確認してください。</p>
      <iframe ref={frame} className={s.printFrame} title="カードの印刷見本" srcDoc={printableCard(config, qr)} sandbox="allow-same-origin allow-modals" />
      <button type="button" onClick={() => frame.current?.contentWindow?.print()}>印刷する</button>
    </Modal>}
  </MarketingDemo>;
}
