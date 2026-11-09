export const categories = ['SIMPLE', 'NUANCE', 'FRENCH', 'ART', 'MAGNET', 'GRADATION'] as const;
export const colors = { Pink: '#e79db0', Beige: '#c9a58a', White: '#fffaf3', Black: '#33303a', Brown: '#8a5b47', Blue: '#698dac', Red: '#b0475c' } as const;
export const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'] as const;

export type NailDesign = {
  id: string;
  title: string;
  description: string;
  images: readonly [string, ...string[]];
  category: typeof categories[number];
  colors: readonly (keyof typeof colors)[];
  seasons: readonly (typeof seasons[number])[];
  tags: readonly string[];
  price: number;
  durationMinutes: number;
  popularity: number;
};

const entries: readonly [string, string, string, NailDesign['category'], NailDesign['colors'], NailDesign['seasons'], readonly string[], number, number, number][] = [
  ["milk-tea","ミルクティーベージュ","肌になじむ透け感のあるベージュ。","SIMPLE",["Beige"],["Spring","Autumn"],["上品","オフィス","控えめ"],6500,60,128],
  ["petal","ペタルピンク","花びらのような淡いピンクに小粒のパール。","ART",["Pink","White"],["Spring"],["かわいい","お呼ばれ","華やか"],7200,75,157],
  ["mist","ブルーミスト","水面を思わせる淡いブルーのニュアンス。","NUANCE",["Blue","White"],["Summer","Winter"],["個性的","休日","控えめ"],7900,90,106],
  ["mocha","モカマーブル","モカブラウンに細いラメを重ねたマーブル。","NUANCE",["Brown","Beige"],["Autumn"],["上品","休日","華やか"],8600,105,135],
  ["snow","スノーフレンチ","透明感のあるベースに細い白のフレンチ。","FRENCH",["White","Beige"],["Winter","Spring"],["上品","オフィス","控えめ"],9300,60,96],
  ["midnight","ミッドナイト磁石ネイル","深い青に光の帯が浮かぶマグネットデザイン。","MAGNET",["Black","Blue"],["Winter"],["個性的","お呼ばれ","華やか"],6700,75,92],
  ["rouge","クラシックルージュ","深みのある赤を主役にしたワンカラー。","SIMPLE",["Red"],["Autumn","Winter"],["上品","お呼ばれ","華やか"],7400,90,86],
  ["shell","シェルホワイト","貝殻のかけらを散らした夏のホワイト。","ART",["White"],["Summer"],["かわいい","休日","華やか"],8100,105,72],
  ["rose","ローズグロウ","ローズピンクに柔らかな光が集まるマグネット。","MAGNET",["Pink"],["Spring","Autumn"],["かわいい","お呼ばれ","華やか"],8800,60,143],
  ["ink","インクフレンチ","細い黒ラインが際立つフレンチ。","FRENCH",["Black"],["Autumn","Winter"],["個性的","オフィス","控えめ"],9500,75,58],
  ["coral","コーラルシロップ","透けるコーラルを重ねた明るいピンク。","SIMPLE",["Pink","Red"],["Spring","Summer"],["かわいい","休日","控えめ"],6900,90,81],
  ["sand","サンドウェーブ","砂浜を思わせるブラウンとベージュの波模様。","NUANCE",["Brown","Beige"],["Summer","Autumn"],["個性的","休日","控えめ"],7600,105,62],
  ["denim","デニムフレンチ","くすみブルーの細フレンチで手元にアクセント。","FRENCH",["Blue"],["Summer"],["個性的","オフィス","控えめ"],8300,60,71],
  ["cocoa","ココアベルベット","光で表情が変わるココアブラウン。","MAGNET",["Brown"],["Autumn","Winter"],["上品","休日","華やか"],9000,75,80],
  ["berry","ベリーリボン","赤いリボンを一点に添えたアート。","ART",["Red","Pink"],["Winter"],["かわいい","お呼ばれ","華やか"],9700,90,64],
];

export const sampleDesigns: NailDesign[] = entries.map(([id, title, description, category, palette, season, tags, price, durationMinutes, popularity]) => ({
  id, title, description, category, colors: palette, seasons: season, tags, price, durationMinutes, popularity,
  images: [`/gallery-demo/${id}.svg`, `/gallery-demo/${id}-detail.svg`],
}));

export const comparison = [
  { src: '/gallery-demo/bare.svg', label: 'Before', alt: 'カラーを塗る前のネイルチップのイメージ' },
  { src: sampleDesigns[0].images[0], label: 'After', alt: '同じチップにベージュを塗った仕上がりのイメージ' },
] as const;