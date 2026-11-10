import { sampleDesigns, type NailDesign } from '../gallery/data';
import { photos } from '../profile/data';
import { getArticles, type Article } from '../profile/content';

export const sampleDate = '2026-11-10';
export const publicOrigin = 'https://public-sample.vercel.app';
export const designUrl = (design: NailDesign) => publicOrigin + '/features/G05/?design=' + encodeURIComponent(design.id);
export const referralUrl = publicOrigin + '/features/B12/#referral-benefits';

export const campaigns = [
  { title: 'Spring Collection', headline: '春の光を、指先に。', text: '桜色と透け感を重ねた、春限定のデザイン。', start: '2026-03-01', end: '2026-04-30', image: '/gallery-demo/petal.svg', menu: '春色ニュアンスコース', price: 7800, color: '#f7e3eb' },
  { title: 'Summer Special', headline: '涼しげな色を、ひとさじ。', text: '水面のようなブルーとシェルを選べる夏のコース。', start: '2026-07-01', end: '2026-08-31', image: '/gallery-demo/mist.svg', menu: '夏色シェルコース', price: 8200, color: '#dcecf1' },
  { title: 'Holiday Collection', headline: '特別な夜に、やわらかな輝き。', text: '深いローズと繊細なきらめきの期間限定デザイン。', start: '2026-11-01', end: '2026-12-25', image: '/gallery-demo/rose.svg', menu: 'ホリデーアートコース', price: 8900, color: '#efdee4' },
] as const;

export const seasonCopy = {
  Spring: { label: '春', headline: '花びらを重ねる春', color: '#f6dfe6', menu: campaigns[0].menu },
  Summer: { label: '夏', headline: '光を透かす夏', color: '#dceff1', menu: campaigns[1].menu },
  Autumn: { label: '秋', headline: '装いになじむ深い色', color: '#efdfd1', menu: 'モカ・ボルドーコース' },
  Winter: { label: '冬', headline: '澄んだ空気と小さな輝き', color: '#e8e3f1', menu: campaigns[2].menu },
};

const publishedDates: Record<string, string> = {
  petal: '2026-11-09', rose: '2026-11-07', midnight: '2026-11-05', snow: '2026-11-03',
  'milk-tea': '2026-11-01', mist: '2026-10-28', mocha: '2026-10-22', ink: '2026-10-14',
  berry: '2026-11-20',
};
export const publishedDesigns = sampleDesigns.flatMap(design => {
  const date = publishedDates[design.id];
  return date ? [{ design, date }] : [];
});

export type SocialAccount = { name: string; label: string; benefit: string; url?: string };
export const accounts: SocialAccount[] = [
  { name: 'Instagram', label: 'mellow｜作品紹介（サンプル）', benefit: '新作の色やデザインを写真で見られます。' },
  { name: 'LINE', label: 'mellow｜お知らせ（サンプル）', benefit: '空き状況や季節の案内をまとめて受け取れます。' },
];

const extraArticle: Article = {
  id: 'swatches', title: '色見本を手元で見比べるコツ', category: 'デザイン', publishedAt: '2026-11-09', minutes: 3, photo: photos.consultation,
  summary: 'お気に入りの色を決める前に、光や普段の装いとの相性を見てみましょう。',
  content: ['肌の近くに色見本を当てて、自然光と室内の光で確認します。', '普段つけるアクセサリーの色を思い浮かべると、仕上がりをイメージしやすくなります。'],
  related: ['color', 'first'],
};
export const marketingArticles = [extraArticle, ...getArticles()];

export const referral = { start: '2026-11-01', end: '2026-12-25', friend: '初回メニューから500円引き', host: '次回来店時に500円引き',
  steps: ['紹介ページのURLをコピーする', '友人へリンクを渡す', '予約時に紹介であることを伝えてもらう'] };
