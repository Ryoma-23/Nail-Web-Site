import { MenuDemo } from './ui';
import s from './menu.module.css';

const steps = [
  ['予約', '希望のメニューと日時を選びます。ジェルが付いている場合は、予約時に付替オフも選んでください。', '予約手帳とスマートフォン'],
  ['来店・カウンセリング', '爪の状態や普段の過ごし方を伺い、色・長さ・デザインを相談します。参考画像があればお持ちください。', '色見本を見ながらデザインを選ぶ様子'],
  ['ネイルケア', '爪の長さや形を整え、甘皮周りをお手入れします。気になることは途中でもお伝えください。', 'やすりで爪の形を整える様子'],
  ['施術', '選んだ色やアートを施します。途中で色味や配置を確認できます。', '筆でネイルカラーを塗る様子'],
  ['仕上がり確認', '左右の形や色を一緒に確認し、気になる箇所があればお知らせいただきます。', '仕上がった淡いピンクのネイル'],
  ['アフターケア説明', 'ご自宅での保湿や、次のお手入れの目安をお伝えします。', 'キューティクルオイルと施術後の指先'],
] as const;

export default function TreatmentFlow() {
  return <MenuDemo id="M10" title="ご予約からお帰りまで" guide="気になる工程を開くと、内容とイメージ写真を見られます。">
    <ol className={s.timeline}>{steps.map(([title, description, alt], index) => <li key={title}>
      <details open={index === 0}><summary><strong>{title}</strong></summary>
        <p>{description}</p>
        <div role="img" aria-label={alt} className={s.photo}
          style={{ backgroundImage: 'url(/menu-demo/treatment.jpg)', backgroundPosition: (index % 2) * 100 + '% ' + Math.floor(index / 2) * 50 + '%' }} />
      </details>
    </li>)}</ol>
    <small>画像は各工程を説明するための生成イメージです。</small>
  </MenuDemo>;
}
