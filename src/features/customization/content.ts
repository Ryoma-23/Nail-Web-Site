export const sectionNames = {
  concept: 'コンセプト', gallery: 'ギャラリー', menu: 'メニュー・料金',
  profile: 'プロフィール', faq: 'よくある質問', reservation: 'ご予約',
} as const;

export const art = {
  hero: '/profile-demo/finish.jpg', concept: '/profile-demo/desk.jpg',
  profile: '/profile-demo/artist.jpg',
  gallery: ['/gallery-demo/milk-tea.svg', '/gallery-demo/rose.svg', '/gallery-demo/mist.svg'],
};

export const content = {
  ja: {
    names: sectionNames, kicker: 'プライベート ネイルアトリエ', hero: '指先に、わたしらしい余白を。',
    intro: '肌になじむ色と繊細なニュアンス。日常にそっと寄り添うネイルを。',
    concept: '静かなアトリエで、色や形を一緒に選びます。爪の状態と暮らしに合わせて、一つずつ丁寧に仕上げます。',
    gallery: ['ミルクティーベージュ', 'ローズグロウ', 'ミストブルー'],
    menu: [['ワンカラー', '肌なじみのよい一色で仕上げます。', '¥6,000'], ['ニュアンスアート', '透け感と奥行きを楽しむデザイン。', '¥8,500']],
    profile: 'ネイリストのKotomiです。自爪をいたわるケアと、毎日眺めたくなる色づくりを大切にしています。',
    faq: [['初めてでも予約できますか？', 'はい。デザインやお手入れ方法からご相談いただけます。'], ['施術時間はどれくらいですか？', 'ワンカラーは約90分です。オフがある場合は30分ほど追加になります。'], ['持ち込みデザインは可能ですか？', 'はい。お好きな写真をカウンセリングでお見せください。']],
    reserve: 'ご希望のデザインをお聞かせください。', book: '予約について見る',
    demo: 'このミニサイトはカタログ用のサンプルです。', news: ['お知らせ', '春の限定カラー', '透け感のある春色3色を追加しました。'],
  },
  en: {
    names: { concept: 'Concept', gallery: 'Gallery', menu: 'Menu & prices', profile: 'Profile', faq: 'FAQ', reservation: 'Reservation' },
    kicker: 'PRIVATE NAIL ATELIER', hero: 'A little room to be yourself.',
    intro: 'Soft colors and delicate details for nails that feel at home in your everyday life.',
    concept: 'Choose colors and shapes together in a quiet atelier. Each set is crafted around your nails and daily routine.',
    gallery: ['Milk Tea Beige', 'Rose Glow', 'Mist Blue'],
    menu: [['Single color', 'One shade selected to flatter your skin tone.', '¥6,000'], ['Nuance art', 'Sheer layers with subtle depth.', '¥8,500']],
    profile: 'I am Kotomi, a nail artist who cares about healthy nails and colors you will love seeing every day.',
    faq: [['Can I book a first visit?', 'Yes. We can help you choose a design and a care routine.'], ['How long is an appointment?', 'Single color takes about 90 minutes. Allow 30 minutes for removal.'], ['Can I bring a design reference?', 'Yes. Bring a photo to your consultation.']],
    reserve: 'Tell us what you would like for your next set.', book: 'View reservation details',
    demo: 'This mini site is a catalog demonstration.', news: ['News', 'Spring colors', 'Three sheer spring colors are now available.'],
  },
};

