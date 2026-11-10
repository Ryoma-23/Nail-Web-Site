import { photos, type Photo } from './data';

export type FAQItem = { id: string; category: string; question: string; answer: string };
export const faqs: FAQItem[] = [
  { id: 'first', category: 'ご来店', question: '初めてでも利用できますか？', answer: '初めての方もご利用いただけます。カウンセリングで爪の状態とご希望を確認してから、施術内容を決めます。' },
  { id: 'off', category: '施術', question: 'ネイルオフだけでも予約できますか？', answer: 'オフのみのメニューがあります。予約時に、付いているジェルやパーツの種類を分かる範囲でお知らせください。' },
  { id: 'time', category: '施術', question: '施術時間はどのくらいですか？', answer: 'ワンカラーは約60分が目安です。デザインや付替オフの有無によって時間が変わります。' },
  { id: 'payment', category: 'お支払い', question: '支払い方法は？', answer: 'サンプルのサロンでは現金とクレジットカードを利用できる設定です。' },
  { id: 'design', category: '施術', question: 'デザインの持ち込みは可能ですか？', answer: '参考画像をお持ちいただけます。使える色やパーツを確認し、雰囲気の近いデザインを相談します。' },
  { id: 'cancel', category: 'ご来店', question: 'キャンセルはできますか？', answer: '予約時に案内された窓口から、分かった時点で早めにご連絡ください。変更の条件はご予約時にご案内します。' },
];

export const visitSteps = [
  { title: '予約前に確認', text: '希望の施術と、今付いているジェルを取り外すかどうかを確認してください。参考画像があれば、当日お持ちください。' },
  { title: '予約から来店まで', text: '選んだメニューと予約時刻を控え、案内に沿ってお越しください。遅れそうな場合は予約先にご連絡ください。' },
  { title: '当日のカウンセリングと施術', text: '色、形、長さを相談してから施術します。途中や仕上がりの確認時にも、ご希望をお伝えいただけます。' },
  { title: '施術後のお手入れ', text: '爪先を道具のように使う動作は避け、乾燥が気になるときは指先を保湿します。浮きが気になるときは無理に剥がさず、施術先にご相談ください。' },
];

type Entry = { id: string; title: string; summary: string; category: string; publishedAt: string; content: readonly string[] };
export type News = Entry & { isNew?: boolean };
export type Article = Entry & { minutes: number; photo: Photo; related: readonly string[] };

const news: News[] = [
  { id: 'menu', title: '冬の色見本を追加しました', category: 'MENU', publishedAt: '2026-10-24', summary: '透け感のあるブラウンとベージュが増えました。', content: ['施術前の色選びで、新しい見本を手元に合わせて比べられます。'] },
  { id: 'hours', title: '年末の営業時間について', category: 'BUSINESS HOURS', publishedAt: '2026-11-09', summary: '12月の最終営業日をお知らせします。', content: ['サンプルでは12月29日まで営業、12月30日から1月4日までお休みの設定です。'], isNew: true },
  { id: 'campaign', title: '冬支度の指先ケア', category: 'CAMPAIGN', publishedAt: '2026-11-01', summary: '自爪の形を整える季節メニューの紹介です。', content: ['爪の形を整え、最後にオイルで指先を保湿します。詳しい料金はメニューのキャンペーン案内でご確認ください。'] },
  { id: 'notice', title: 'ご予約時のお願い', category: 'IMPORTANT', publishedAt: '2026-10-12', summary: '付替オフをご希望の方へのご案内です。', content: ['大きなパーツが付いている場合は、施術にかかる時間を見積もるため、ご予約時にお知らせください。'] },
  { id: 'news', title: '作品ギャラリーを更新しました', category: 'NEWS', publishedAt: '2026-11-06', summary: '日常に合わせやすいデザインの見本を追加しました。', content: ['ピンクやベージュの色味を、作品ギャラリーで見比べられます。'], isNew: true },
];

const articles: Article[] = [
  { id: 'care', title: 'ジェルネイルをきれいに保つ日々の工夫', category: 'ケア', publishedAt: '2026-11-07', minutes: 3, photo: photos.after,
    summary: '毎日の手洗いや家事のあとに取り入れやすい、指先のお手入れを紹介します。',
    content: ['手洗いのあとに水気を拭き取り、乾燥が気になるときは爪の周りを保湿します。', '缶やシールを開けるときは爪先に力をかけず、道具を使うと扱いやすくなります。'], related: ['first', 'oil'] },
  { id: 'first', title: '初めてのネイルサロンで知っておきたいこと', category: '来店ガイド', publishedAt: '2026-10-28', minutes: 4, photo: photos.consultation,
    summary: '予約前に考えておくと、当日の相談が進めやすくなることをまとめました。',
    content: ['仕事や家事で使いやすい長さ、色の好み、予算などを先に整理しておくと、デザインを一緒に選びやすくなります。', '参考写真があればお持ちください。パーツや色が同じものか、近い雰囲気で作れるかを施術前に相談します。'], related: ['color', 'care'] },
  { id: 'color', title: '季節に合わせたネイルカラーの選び方', category: 'デザイン', publishedAt: '2026-10-19', minutes: 3, photo: photos.finish,
    summary: '季節の服や小物に合わせて、指先の色を考えるヒントです。',
    content: ['よく着る服の色をひとつ思い浮かべ、同系色や淡い色を手元に合わせてみます。', 'サンプルを室内の光と自然光で見比べると、透け感や色の印象を確認できます。'], related: ['first', 'care'] },
  { id: 'oil', title: '指先にオイルをなじませるタイミング', category: 'ケア', publishedAt: '2026-09-30', minutes: 2, photo: photos.after,
    summary: '爪周りを保湿するため、普段の習慣に取り入れやすいタイミングを紹介します。',
    content: ['夜に手を洗ったあとなど、続けやすい時間に少量を爪周りになじませます。', '製品の説明を確認し、肌に合うものを選んでください。'], related: ['care'] },
];

function latestFirst<T extends Entry>(items: readonly T[]): T[] {
  return [...items].sort((first, second) => second.publishedAt.localeCompare(first.publishedAt));
}

export function getNews(): readonly News[] { return latestFirst(news); }
export function getArticles(): readonly Article[] { return latestFirst(articles); }
