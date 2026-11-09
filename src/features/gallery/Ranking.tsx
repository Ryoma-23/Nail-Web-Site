import { sampleDesigns } from './data';
import { Art, Demo } from './ui';
import s from './gallery.module.css';

const ranking = [...sampleDesigns].sort((a, b) => b.popularity - a.popularity).slice(0, 5);

export default function Ranking() {
  return <Demo label="G09" title="サンプルランキング TOP 5" guide="仮のお気に入り数で並べた表示例です。実際の人気や予約数を示すデータではありません。">
    <ol className={s.ranking}>{ranking.map((item, index) => <li className={s.rank} data-podium={index < 3} key={item.id}>
      <b>{index + 1}位</b><Art src={item.images[0]} alt={item.title + 'のネイルチップ見本'} />
      <div><strong>{item.title}</strong><p>お気に入り {item.popularity} 件（サンプル）</p></div>
    </li>)}</ol>
  </Demo>;
}
