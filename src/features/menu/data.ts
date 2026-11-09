export const categoryLabels = { hand: 'HAND', foot: 'FOOT', care: 'CARE', off: 'OFF', option: 'OPTION' } as const;
export type NailMenu = {
  id: string;
  name: string;
  category: keyof typeof categoryLabels;
  description: string;
  price: number;
  minutes: number;
  style: 'simple' | 'design' | 'care';
  scene: string;
  optionIds: readonly string[];
};
export type MenuOption = {
  id: string;
  name: string;
  price: number;
  minutes: number;
  unit: 'fixed' | 'perItem';
  maxQuantity?: number;
  exclusiveGroup?: string;
  note: string;
};

const additions = ['stone', 'parts', 'length', 'repair', 'own', 'other'];
export const options: readonly MenuOption[] = [
  { id: 'stone', name: 'ストーン追加', price: 150, minutes: 3, unit: 'perItem', maxQuantity: 10, note: '小粒ストーンを1粒ずつ追加できます。' },
  { id: 'parts', name: 'パーツ追加', price: 500, minutes: 15, unit: 'perItem', maxQuantity: 5, note: '小型パーツを1個ずつ追加できます。' },
  { id: 'length', name: '長さ出し', price: 800, minutes: 10, unit: 'perItem', maxQuantity: 10, note: '長さを整える爪1本あたりの料金です。' },
  { id: 'repair', name: '補強', price: 450, minutes: 5, unit: 'perItem', maxQuantity: 10, note: '補強が必要な爪1本あたりの料金です。' },
  { id: 'own', name: '自店オフ', price: 1000, minutes: 30, unit: 'fixed', exclusiveGroup: 'off', note: '当店で付けたジェルを取り外す付替オフです。' },
  { id: 'other', name: '他店オフ', price: 1800, minutes: 40, unit: 'fixed', exclusiveGroup: 'off', note: '他店で付けたジェルを取り外す付替オフです。' },
];

export const menus: readonly NailMenu[] = [
  { id: 'one', name: 'ハンド・ワンカラー', category: 'hand', description: 'お好きな1色で爪全体を均一に彩ります。', price: 6500, minutes: 60, style: 'simple', scene: '日常・オフィス', optionIds: additions },
  { id: 'french', name: 'ハンド・細フレンチ', category: 'hand', description: '爪先の細いラインで手元をすっきり見せます。', price: 8000, minutes: 80, style: 'simple', scene: 'オフィス・式典', optionIds: additions },
  { id: 'art', name: 'ハンド・ニュアンスアート', category: 'hand', description: '色の重なりと繊細なアートを楽しめます。', price: 9500, minutes: 100, style: 'design', scene: 'お呼ばれ・旅行', optionIds: additions },
  { id: 'foot', name: 'フット・ワンカラー', category: 'foot', description: '足元の爪にお好みのカラーを施します。', price: 7800, minutes: 75, style: 'simple', scene: '旅行・サンダルの季節', optionIds: ['stone', 'parts', 'own', 'other'] },
  { id: 'care', name: 'ハンド・ナチュラルケア', category: 'care', description: '形と甘皮を整えて、爪の表面を磨きます。', price: 3800, minutes: 40, style: 'care', scene: '自爪のお手入れ', optionIds: ['own', 'other'] },
  { id: 'remove', name: 'ジェルオフのみ', category: 'off', description: 'ジェルを外し、自爪の長さと形を整えます。', price: 3500, minutes: 45, style: 'care', scene: 'ジェルをお休みするとき', optionIds: [] },
  { id: 'reinforce', name: '爪の補強（1本）', category: 'option', description: options[3].note, price: options[3].price, minutes: options[3].minutes, style: 'care', scene: '補強を追加したいとき', optionIds: [] },
];

export const baseMenus = menus.filter(menu => ['hand', 'foot', 'care'].includes(menu.category));
export const firstOffers = [
  { id: 'one', price: 5900, note: '対象カラーから1色。付替オフは別料金です。' },
  { id: 'art', price: 8500, note: 'サンプルデザインから選択。パーツの変更は別料金です。' },
];
export const courses = [
  { name: 'Simple Course', menuId: 'one', label: '日常になじむ', designs: ['milk-tea', 'coral', 'rouge'] },
  { name: 'Standard Course', menuId: 'french', label: '爪先にアクセント', designs: ['snow', 'ink', 'denim'] },
  { name: 'Premium Course', menuId: 'art', label: '色の重なりを楽しむ', designs: ['mist', 'mocha', 'sand'] },
];
export const yen = (amount: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
