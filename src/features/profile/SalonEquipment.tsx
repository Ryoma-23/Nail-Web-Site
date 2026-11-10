import { equipment } from './data';
import { PhotoCollection } from './PhotoCollection';
import { ProfileDemo } from './ui';

export default function SalonEquipment() {
  return <ProfileDemo id="P07" title="小さなアトリエの設備" guide="空間、道具、ケア用品を切り替えて、写真と使い方を確認できます。">
    <PhotoCollection items={equipment} categoryLabel="設備カテゴリー" />
  </ProfileDemo>;
}
