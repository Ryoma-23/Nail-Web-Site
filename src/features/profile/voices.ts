import type { Photo } from './data';
import { photos } from './data';

export type Review = { id: string; name: string; menu: string; date: string; quote: string; detail: string };
export const reviews: Review[] = [
  { id: 'a', name: 'Aさん', menu: 'ハンド・細フレンチ', date: '2026-10-21', quote: '仕事の日にも気持ちよく使える色を、一緒に見つけてもらいました。', detail: '手を動かしたときの見え方まで、色見本を使って比べられたのが良かったです。' },
  { id: 'b', name: 'Bさん', menu: 'ニュアンスアート', date: '2026-10-30', quote: '持って行った写真を見ながら、私の服に合う色に調整できました。', detail: '参考写真の雰囲気を残しつつ、普段着る色に合わせて提案してもらいました。' },
  { id: 'c', name: 'Cさん', menu: 'ナチュラルケア', date: '2026-11-04', quote: '初めてでも、何をするのか順番に聞けて落ち着いて過ごせました。', detail: '仕上がりを確認する時間があり、家でのお手入れの話も聞けました。' },
];

export type Interview = { id: string; title: string; guest: string; menu: string; photo: Photo; questions: { question: string; answer: string }[]; comment: string };
export const interviews: Interview[] = [
  { id: 'office', title: '仕事の合間にも気分が上がる色', guest: 'Aさん · オフィスワーク', menu: 'ハンド・ワンカラー', photo: photos.finish,
    questions: [
      { question: 'どんなデザインを探していましたか？', answer: '派手さを抑えつつ、パソコンを打つ手元が少し明るく見えるデザインです。' },
      { question: 'この施術を選んだ理由は？', answer: '色見本を自分の手の近くで見たら、淡いピンクが普段の服にも合いそうでした。' },
      { question: '仕上がりはいかがでしたか？', answer: '光によって色が少し変わるので、何度も見たくなりました。' },
    ], comment: '普段の服と馴染むよう、透け感を見ながら色を重ねました。' },
  { id: 'occasion', title: '久しぶりのお出かけに似合う指先', guest: 'Bさん · 休日のお出かけ', menu: 'ニュアンスアート',
    photo: { src: '/gallery-demo/mocha.svg', alt: 'モカ色のニュアンスデザインの見本' },
    questions: [
      { question: '何をきっかけに予約しましたか？', answer: '友人との食事に着る服を選んでいて、指先にも色を合わせたいと思いました。' },
      { question: 'この施術を選んだ理由は？', answer: '好きなブラウンに、さりげなく光が入ったデザインが気に入りました。' },
      { question: '仕上がりはいかがでしたか？', answer: '落ち着いた色で、普段の服にも合わせやすかったです。' },
    ], comment: '着る予定のお洋服に合わせ、光の入る部分を小さくまとめました。' },
];
