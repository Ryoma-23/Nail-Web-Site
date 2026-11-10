import { sampleDesigns, type NailDesign } from '../gallery/data';
import { menus, type NailMenu } from '../menu/data';

export const periods = [7, 30, 90] as const;
export type Period = typeof periods[number];
export const format = (value: number) => value.toLocaleString('ja-JP');
export const rate = (numerator: number, denominator: number) => denominator ? (100 * numerator / denominator).toFixed(1) + '%' : '0.0%';
export const timestamp = (iso: string) => iso.replace('T', ' ').slice(0, 16);
export const simulationStart = '2026-05-15T10:00';

export const placements = ['ヘッダー', '下部固定', 'ページ末尾', '作品詳細'];
export const sources = ['Instagram', 'LINE', 'Google検索', '名刺QR', '卓上QR', '直接・不明'];
export const sourceDetails = [
  'Instagramプロフィールのリンク', 'LINEのリッチメニューからの流入', 'Googleの自然検索',
  '名刺用QRの識別例（utm_source=business_card）', '卓上用QRの識別例（utm_source=table_card）',
  '参照元やキャンペーン情報を取得できなかった訪問',
];
const daily = Array.from({ length: 180 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 4, i - 164)).toISOString().slice(0, 10);
  const visitors = 22 + (i * 19 % 37) + Math.floor(i / 8);
  const sessions = visitors + i % 12;
  const clicks = 2 + i % 8;
  const counts = [3, 2, 2, 1, 1].map((weight, source) => Math.floor(sessions * weight / 12) + (i + source) % 3);
  counts.push(sessions - counts.reduce((a, b) => a + b, 0));
  return { date, visitors, pageViews: sessions * 2 + i % 18, sessions, clicks, sources: counts };
});
export const sum = <T,>(items: readonly T[], value: (item: T) => number) => items.reduce((total, item) => total + value(item), 0);
export const traffic = (period: Period) => ({
  current: daily.slice(-period), previous: daily.slice(-period * 2, -period),
});
export const designViews = (period: Period) => sampleDesigns.map((design, i) => ({
  design, views: Math.round(design.popularity * period / 14) + (i * period % 19),
})).sort((a, b) => b.views - a.views);
export const sourceStats = (period: Period) => {
  const { current } = traffic(period);
  return sources.map((name, i) => ({
    name, visits: sum(current, day => day.sources[i]),
    clicks: sum(current, day => Math.floor(day.clicks / 6) + ((day.date.charCodeAt(9) + i) % 6 < day.clicks % 6 ? 1 : 0)),
  }));
};

export const eventTypes = [
  { name: 'ギャラリー閲覧', category: '作品', page: '/gallery/' },
  { name: '作品詳細クリック', category: '作品', page: '/gallery/' },
  { name: '予約ボタンクリック', category: '予約', page: '/' },
  { name: 'SNSリンククリック', category: '外部導線', page: '/' },
  { name: 'FAQ開閉', category: '閲覧', page: '/faq/' },
  { name: 'メニュー閲覧', category: '閲覧', page: '/menu/' },
] as const;
export type DemoEvent = { id: string; type: number; at: string; simulated: boolean };
export const initialEvents: DemoEvent[] = Array.from({ length: 12 }, (_, i) => ({
  id: 'seed-' + i, type: i % eventTypes.length, at: '2026-05-15T09:' + String(59 - i).padStart(2, '0'), simulated: false,
}));
export const experiments = [
  { name: 'A', design: 'ベージュ・角丸', views: 820, clicks: 61 },
  { name: 'B', design: 'ブラック・大きな文字', views: 790, clicks: 72 },
] as const;

export type WorkImage = { id: string; title: string; category: NailDesign['category']; src: string };
export type ManagedMenu = Pick<NailMenu, 'id' | 'name' | 'category' | 'price' | 'minutes'> & { visible: boolean };
export type Draft = { id: string; title: string; body: string; at: string };
export type Announcement = { id: string; title: string; publishAt: string };
export type ContentRevision = { id: string; contentId: string; updatedAt: string; field: string; previousValue: string; newValue: string };
export const roles = ['Owner', 'Admin', 'Editor', 'Viewer'] as const;
export type Role = typeof roles[number];
export type ManagementUser = { id: string; displayName: string; role: Role };
export const permissions = {
  Owner: [true, true, true], Admin: [true, true, false], Editor: [true, false, false], Viewer: [false, false, false],
} as const;
export const healthStates = ['Operational', 'Degraded Performance', 'Outage', 'Maintenance'] as const;
export type Health = typeof healthStates[number];
export const incidents = [
  { title: '画像ページの応答が遅延', at: '2026-05-11T09:30', detail: '09:30に応答時間の上昇を検知し、09:48に復旧した想定です。' },
  { title: '定期メンテナンス', at: '2026-05-02T02:00', detail: '02:00〜02:20にメンテナンスを実施した想定です。' },
];
export const requestCategories = ['作品写真の追加', '料金変更', 'メニュー追加', 'お知らせ掲載', 'デザイン修正', 'その他'] as const;
export const requestStatuses = ['受付', '対応中', '確認待ち', '完了'] as const;
export const priorities = ['低', '通常', '高'] as const;
export const targetPages = ['トップ', 'ギャラリー', 'メニュー', 'お知らせ', 'プロフィール', 'その他'] as const;
export type UpdateRequest = {
  id: string; category: typeof requestCategories[number]; targetPage: typeof targetPages[number]; description: string;
  due: string; priority: typeof priorities[number]; status: typeof requestStatuses[number]; createdAt: string; attachment: string;
};
export const defaultSeo = { title: 'Mellow Nail｜プライベートネイルサロン', description: 'Kotomiが肌になじむカラーと丁寧なケアをご提案します。作品と施術メニューをご覧ください。', slug: 'mellow-nail', image: '/profile-demo/finish.jpg' };
export const seoImages = [{ name: '施術の仕上がり', src: '/profile-demo/finish.jpg' }, { name: 'アトリエ', src: '/profile-demo/desk.jpg' }, { name: 'ローズグロウ', src: '/gallery-demo/rose.svg' }];

export const demoNames = [
  'アクセス解析', '予約ボタンクリック計測', '作品別閲覧分析', 'SNS流入分析', 'イベント計測', 'A/Bテスト',
  '画像管理画面', 'メニュー管理画面', '公開予約', '下書き保存', '更新履歴・復元', '複数ユーザー管理',
  '稼働監視', '更新依頼受付', 'SEO設定',
];
export const featureId = (index: number) => 'O' + String(index).padStart(2, '0');

export function initialData() {
  return {
    period: 7 as Period, events: initialEvents, images: sampleDesigns.slice(0, 5).map(({ id, title, category, images }) => ({ id, title, category, src: images[0] })) as WorkImage[],
    menu: menus.map(({ id, name, category, price, minutes }) => ({ id, name, category, price, minutes, visible: true })) as ManagedMenu[],
    announcements: [{ id: 'spring', title: '春の限定カラー', publishAt: '2026-05-10T09:00' }, { id: 'summer', title: '初夏の新作ギャラリー', publishAt: '2026-05-20T12:00' }] as Announcement[],
    clock: simulationStart,
    drafts: [{ id: 'seed-draft', title: '梅雨のネイルケア', body: '雨の日も指先を楽しめるケアをご紹介します。', at: '2026-05-14T14:00' }] as Draft[],
    article: { id: 'spring', title: '春の限定カラー', body: '透け感のある春色を3色追加しました。' },
    revisions: [{ id: 'seed-rev', contentId: 'spring', updatedAt: '2026-05-12T11:30', field: '本文', previousValue: '春色を2色追加しました。', newValue: '透け感のある春色を3色追加しました。' }] as ContentRevision[],
    users: [{ id: 'owner', displayName: 'デモオーナー', role: 'Owner' }, { id: 'editor', displayName: 'デモ編集担当', role: 'Editor' }] as ManagementUser[],
    requests: [{ id: 'seed-req', category: '作品写真の追加', targetPage: 'ギャラリー', description: '春の作品をギャラリーへ追加したい。', due: '2026-05-22', priority: '通常', status: '受付', createdAt: '2026-05-15T09:00', attachment: '' }] as UpdateRequest[],
    seo: defaultSeo,
  };
}
export type AdminData = ReturnType<typeof initialData>;

