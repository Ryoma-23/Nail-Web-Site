import { qrSvg, type QR } from './qr';

export const themes = {
  Natural: { background: '#f5e9db', text: '#49392c', accent: '#9b7757', font: 'Georgia, serif' },
  Luxury: { background: '#322530', text: '#fff1de', accent: '#e7c394', font: 'Georgia, serif' },
  Feminine: { background: '#fae2ec', text: '#63374e', accent: '#a45372', font: 'Georgia, serif' },
  Minimal: { background: '#f5f5f3', text: '#202021', accent: '#69696a', font: 'Arial, sans-serif' },
} as const;

export const formats = {
  名刺型: { width: 91, height: 55, heading: 'NAIL ARTIST', tagline: '指先に、小さなときめきを。' },
  ショップカード: { width: 91, height: 55, heading: 'PRIVATE NAIL STUDIO', tagline: '毎日に、しっくりくる指先を。' },
  卓上POP: { width: 105, height: 148, heading: 'DESIGN GALLERY', tagline: 'ネイルデザインはこちら' },
} as const;

export type CardConfig = { name: string; theme: keyof typeof themes; format: keyof typeof formats; side: '表面' | '裏面' };

const escape = (value: string) => value.replace(/[&<>"']/g, token => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[token] ?? token);

export function printableCard(config: CardConfig, qr: QR) {
  const theme = themes[config.theme];
  const format = formats[config.format];
  const pop = config.format === '卓上POP';
  const person = config.format === '名刺型' && config.side === '表面';
  const photo = config.format === 'ショップカード' && config.side === '表面';
  const qrSize = pop ? 63 : 28;
  return '<!doctype html><html lang="ja"><meta charset="utf-8"><title>紹介カード印刷プレビュー</title><style>' +
    '@page{size:A4;margin:12mm}*{box-sizing:border-box}body{margin:12px;background:#ece9e7;color:#202021;font:14px system-ui}main{display:grid;place-items:start center}' +
    'article{width:' + format.width + 'mm;height:' + format.height + 'mm;padding:' + (pop ? 8 : 4) + 'mm;background:' + theme.background +
    ';color:' + theme.text + ';border:1px solid ' + theme.accent + ';display:grid;gap:3mm;align-content:center;align-items:center;grid-template-columns:' +
    (pop ? '1fr;text-align:center;justify-items:center' : 'minmax(0,1fr) ' + qrSize + 'mm') +
    ';break-inside:avoid;overflow:hidden;print-color-adjust:exact;-webkit-print-color-adjust:exact}' +
    'h1{font:700 ' + (pop ? 28 : 19) + 'px ' + theme.font + ';overflow-wrap:anywhere;margin:2mm 0}p{margin:1mm 0;overflow-wrap:anywhere}' +
    'img{display:block;width:100%;height:13mm;object-fit:cover;margin-top:1mm}svg{display:block;width:' + qrSize + 'mm;height:' + qrSize +
    'mm;margin:auto}@media(max-width:450px){main{justify-items:start}}@media print{body{margin:0;background:white}main{justify-items:start}}' +
    '</style><main><article><div><small>' + format.heading + ' / ' + config.side + '</small><h1>' + escape(config.name) + '</h1><p>' +
    (person ? 'Kotomi · ネイリスト<br>Instagram：サンプル表示' : config.side === '裏面' ? 'QRを読み取ってWebサイトへ' : format.tagline) +
    '</p>' + (photo ? '<img alt="ネイルデザインの見本" src="/gallery-demo/rose.svg">' : '') +
    '</div>' + qrSvg(qr) + '</article></main></html>';
}
