import { scenes } from './data';
import { PhotoCollection } from './PhotoCollection';
import { ProfileDemo } from './ui';

export default function TreatmentScenes() {
  return <ProfileDemo id="P05" title="ネイルが仕上がるまでの風景" guide="工程で絞り込み、写真をタップして拡大できます。拡大中は左右へスワイプできます。">
    <PhotoCollection items={scenes} categoryLabel="施術工程" />
  </ProfileDemo>;
}
