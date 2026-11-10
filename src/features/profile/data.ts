export type Photo = { src: string; alt: string };
const asset = (name: string, alt: string): Photo => ({ src: '/profile-demo/' + name + '.jpg', alt });

export const photos = {
  artist: asset('artist', 'エプロン姿の架空のネイリスト Kotomi'),
  salon: asset('salon', 'オークの施術台とクリーム色の椅子が並ぶ架空の店内'),
  booking: asset('booking', '予約手帳とスマートフォン'),
  consultation: asset('consultation', '色見本を見ながらデザインを選ぶ様子'),
  care: asset('care', 'やすりで爪を整える様子'),
  application: asset('application', '筆でジェルを塗る様子'),
  finish: asset('finish', '淡いピンクに仕上がった指先'),
  after: asset('after', 'キューティクルオイルと指先'),
};

export type Qualification = { name: string; year: number; description: string; detail: string };
export const qualifications: Qualification[] = [
  { name: 'ネイルケア基礎研修 修了（架空）', year: 2020, description: '爪の形を整える手順と道具の使い方を学ぶ研修。', detail: 'モデルを使ってファイリングや仕上がりの確認を練習しました。' },
  { name: 'ジェルデザイン実技研修 修了（架空）', year: 2022, description: 'カラーの重ね方とデザインの提案を学ぶ研修。', detail: '透け感や色の濃淡を調整し、イメージに合わせる練習を行いました。' },
];
export const skills = [
  { category: 'デザイン', name: '透け感のあるニュアンス', detail: '落ち着いた色を少しずつ重ねて、指先に奥行きを出します。' },
  { category: 'デザイン', name: '細フレンチ', detail: '爪の形と長さを見ながら、先端のラインを合わせます。' },
  { category: 'ケア', name: 'ナチュラルケア', detail: '暮らしに合わせて形を相談し、施術の途中でも見え方を確認します。' },
];

export type NailArtistProfile = {
  name: string; tagline: string; bio: string; photo: Photo; specialties: string[];
  career: string[]; qualifications: Qualification[];
  socials: { name: string; href?: string }[];
};
export const artist: NailArtistProfile = {
  name: 'Kotomi', tagline: 'いつもの日々に、少しだけ特別な指先を。',
  bio: 'mellow のネイリスト。服やアクセサリーと同じように、その日の自分にしっくりくる色を一緒に探します。',
  photo: photos.artist, specialties: ['ニュアンス', '細フレンチ', 'ナチュラルケア'],
  career: ['2020年 ネイルケアの学習を開始', '2022年 ジェルデザインの実技研修を修了', '2024年 プライベートサロン mellow をオープン（設定）'],
  qualifications, socials: [{ name: 'Instagram' }, { name: 'LINE' }],
};

export const story = [
  { date: '2018', title: '自分のための、小さな色選び', text: '仕事帰り、好きな色を爪に塗るだけで気分が切り替わったことが、ネイルに興味を持つきっかけでした。', photo: photos.consultation },
  { date: '2020', title: '仕上がりを支える基礎を学ぶ', text: '色の前に、爪の形を整える手順や道具の使い方から学び始めました。', photo: photos.care },
  { date: '2022', title: '研修を修了し、技術を磨く', text: 'ジェルの実技研修を修了。モデルと相談しながら、色の調整と提案を練習しました。', photo: photos.application },
  { date: '2024', title: 'mellow を開く', text: '一人ひとりと落ち着いて話せる、小さなプライベートサロンとして活動を始めました。', photo: photos.salon },
  { date: 'NEXT', title: 'これから目指す姿', text: '今は日常に馴染むデザインを中心に提案しています。季節ごとの色見本を増やしていきたいです。', photo: photos.finish },
];

export type GalleryItem = { id: string; category: string; title: string; text: string; photo: Photo };
export const scenes: GalleryItem[] = [
  { id: 'consult', category: 'カウンセリング', title: '色を見比べる', text: '自然光で色見本を比較して、その日の気分を伺います。', photo: photos.consultation },
  { id: 'care', category: 'ネイルケア', title: '形を整える', text: '爪先の形と長さを一本ずつ確認します。', photo: photos.care },
  { id: 'base', category: 'ベース', title: 'ベースを塗る', text: 'カラーに進む前に、ジェルのベースを薄く塗ります。', photo: photos.application },
  { id: 'design', category: 'デザイン施術', title: 'カラーを重ねる', text: '仕上がりの色を相談しながら、薄い層を重ねて調整します。', photo: photos.application },
  { id: 'finish', category: '仕上げ', title: 'つやと形を確認する', text: 'お客様と一緒に、色や形を角度を変えて確認します。', photo: photos.finish },
];
export const equipment: GalleryItem[] = [
  { id: 'desk', category: '空間', title: 'オークの施術デスク', text: '色見本を並べながら相談できる、窓辺の施術スペースです。', photo: asset('desk', 'オークの施術デスクの天板と道具') },
  { id: 'chair', category: '空間', title: 'クッション付きチェア', text: '施術台に面した、背もたれのある椅子です。', photo: asset('chair', 'クッション付きのクリーム色の椅子') },
  { id: 'lamp', category: '道具', title: 'LEDライト', text: 'ジェルの製品仕様に応じた硬化工程で使います。', photo: asset('lamp', '施術台に置かれたLEDライト') },
  { id: 'colors', category: '道具', title: 'ネイルカラーの色見本', text: '肌に当てて、透け感と濃さを比べられます。', photo: photos.consultation },
  { id: 'files', category: 'ケア用品', title: 'ネイルファイル', text: '爪の形と長さを整える道具です。', photo: photos.care },
  { id: 'tools', category: 'ケア用品', title: '道具の保管スペース', text: '用途ごとに道具を分けて保管し、施術の前後に作業台を整えます。', photo: photos.salon },
  { id: 'oil', category: 'ケア用品', title: 'キューティクルオイル', text: '施術後のお手入れを説明する際に使います。', photo: photos.after },
];
