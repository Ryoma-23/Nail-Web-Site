import { Heart, Palette, Sparkles, MessageCircle, Droplets } from 'lucide-react';
import { photos } from './data';
import { PhotoView, ProfileDemo } from './ui';
import s from './profile.module.css';

const principles = [
  { title: '相談から始める', photo: photos.consultation, Icon: MessageCircle, text: '生活や服の色を伺って、手に取ったときに似合う色を一緒に探します。' },
  { title: '自爪の状態に合わせる', photo: photos.care, Icon: Heart, text: '形や長さを確認し、その日の爪の状態とご希望に合わせて施術方法を相談します。' },
  { title: '色の重なりを提案する', photo: photos.application, Icon: Palette, text: '明るい光と室内の光で色を確認し、雰囲気に合わせて重ね方を変えます。' },
  { title: '仕上がりを一緒に見る', photo: photos.finish, Icon: Sparkles, text: '最後に左右の形やつやをご覧いただき、気になる点をお聞きします。' },
  { title: '使う道具を整える', photo: photos.salon, Icon: Droplets, text: '施術台を整え、使用した道具は用途に合わせて手入れします。' },
];

export default function TreatmentPhilosophy() {
  return <ProfileDemo id="P11" title="毎日の手元に寄り添う施術" guide="スクロールしながら、気になるこだわりの詳細を開いてください。">
    <PhotoView photo={photos.salon} />
    {principles.map(({ title, photo, Icon, text }, index) => <article key={title} className={s.split + ' ' + s.reveal + (index % 2 ? ' ' + s.flip : '')}>
      <PhotoView photo={photo} /><div className={s.card}><Icon size={22} aria-hidden="true" /><h4>{title}</h4>
        <details><summary>大切にしていること</summary><p>{text}</p></details>
      </div>
    </article>)}
  </ProfileDemo>;
}
