import { sampleDesigns, comparison } from '../gallery/data';
import { photos } from '../profile/data';

export const hero = {
  eyebrow: 'MELLOW NAIL STUDIO',
  title: '指先に、季節のひかり。',
  description: '日々の装いに寄り添う、静かな色と小さなきらめき。',
  image: photos.finish,
};
export const salonPhotos = [photos.finish, photos.application, photos.salon, photos.consultation];
export const works = sampleDesigns.slice(0, 6);
export const comparisonImages = comparison;
export const sections = [
  { title: '季節のデザイン', text: 'やわらかなローズから、透明感のあるブルーまで。', photo: photos.finish },
  { title: '色を選ぶひととき', text: '色見本を手に取り、自然光のもとで比べます。', photo: photos.consultation },
  { title: '小さなプライベートサロン', text: '窓辺の施術席で、ゆっくりお過ごしください。', photo: photos.salon },
];
export const seasons = {
  Spring: { label: '桜の季節', color: '#f8e4ec', decoration: 'petal' },
  Summer: { label: '夏の光と水面', color: '#dceff0', decoration: 'water' },
  Autumn: { label: '深まる秋色', color: '#ecdacb', decoration: 'leaf' },
  Winter: { label: '雪のきらめき', color: '#e5e8f5', decoration: 'snow' },
} as const;
