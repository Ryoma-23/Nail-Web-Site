import type { Work, ThemeId } from '@/types/site';
export const site = {
  name: 'mellow', subtitle: 'NAIL ATELIER', isSample: true, indexable: false,
  activeTheme: 'natural' as ThemeId, reservationUrl: null as string | null, instagramUrl: null as string | null,
  tagline: 'A little beauty,\na little happiness.',
  subcopy: '指先に、あなたらしい余白を。',
  concept: ['日々にそっとなじむ色。ふと目に留まる、小さなきらめき。', 'mellow は、あなたの「好き」を一緒に見つける\nプライベートなネイルアトリエです。', '爪のかたちや暮らしに寄り添いながら、\nひとつひとつ、丁寧に。\n毎日が少しうれしくなる指先をお届けします。'],
  profile: { name: 'Haruka', role: 'Nail artist', career: 'サロン勤務を経て、個人ネイリストとして活動。', specialty: '肌になじむカラーと、繊細なニュアンスアートが得意です。', message: 'お話ししながら、今の気分にぴったりのデザインを。初めての方も、どうぞ気軽にお越しください。', image: '/images/profile/atelier.svg' },
  salon: { place: 'シェアサロン内・専用施術スペース（仮）', area: '東京都内（エリア未設定）', station: '最寄り駅は準備中', days: '完全予約制・不定休（仮）', hours: '10:00 – 19:00（仮）', access: '住所・地図は未設定です。正式なご案内までお待ちください。', note: '店舗の一角を借りて活動する個人ネイリストです。店舗全体の運営・お問い合わせ窓口とは異なります。' },
};
export const navigation = [['concept','Concept'],['gallery','Gallery'],['menu','Menu'],['profile','Profile'],['salon','Salon info']] as const;
export const gallery: Work[] = [
  { id: 1, name: 'Milk tea', category: 'SIMPLE', image: '/images/gallery/01.svg', description: '肌になじむ、まろやかなミルクティーベージュ。' },
  { id: 2, name: 'Quiet shimmer', category: 'NUANCE', image: '/images/gallery/02.svg', description: '淡い色の重なりに、さりげないゴールドを。' },
  { id: 3, name: 'Petite french', category: 'FRENCH', image: '/images/gallery/03.svg', description: '細い白のラインで、すっきりと上品な指先。' },
  { id: 4, name: 'Rose veil', category: 'SIMPLE', image: '/images/gallery/04.svg', description: '透け感のあるローズで、やわらかな印象に。' },
  { id: 5, name: 'Golden hour', category: 'ART', image: '/images/gallery/05.svg', description: '金箔を散らした、特別な日の小さなアート。' },
  { id: 6, name: 'Soft stone', category: 'NUANCE', image: '/images/gallery/06.svg', description: '天然石を思わせる、静かなニュアンス。' },
];
export const menus = [
  { name: 'One Color', jp: 'ワンカラー', description: 'お気に入りの一色を、丁寧に。', price: 5500, duration: '約60分', isSamplePrice: true },
  { name: 'Gradation', jp: 'グラデーション', description: '指先に溶け込む、やわらかな色の移ろい。', price: 6000, duration: '約75分', isSamplePrice: true },
  { name: 'French', jp: 'フレンチ', description: '繊細なラインが引き立つ、端正なデザイン。', price: 6500, duration: '約90分', isSamplePrice: true },
  { name: 'Design Art', jp: 'デザインアート', description: 'あなたらしさを映す、オーダーデザイン。', price: 7500, duration: '約120分', isSamplePrice: true },
  { name: 'Off', jp: 'オフのみ', description: '爪をいたわりながら、やさしくオフ。', price: 2500, duration: '約30分', isSamplePrice: true },
];
