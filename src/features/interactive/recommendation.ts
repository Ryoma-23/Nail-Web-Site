import { sampleDesigns, type NailDesign } from '../gallery/data';

export type Preferences = {
  color?: string; category?: string; budget?: number; occasion?: string; mood?: string; intensity?: string; keywords?: string;
};
const aliases: Record<string, string> = { ピンク: 'pink', ベージュ: 'beige', 青: 'blue', 白: 'white', 赤: 'red', 黒: 'black', ブラウン: 'brown', フレンチ: 'french', マグネット: 'magnet' };
const normalize = (value: string) => value.normalize('NFKC').toLowerCase();

export function recommend(input: Preferences, designs: readonly NailDesign[] = sampleDesigns, strict = true) {
  const words = normalize(input.keywords ?? '').split(/[\s、。・,]+/).filter(Boolean);
  return designs.filter(design =>
    (input.budget === undefined || design.price <= input.budget) &&
    (!strict || ((!input.color || design.colors.some(color => color === input.color)) &&
      (!input.category || design.category === input.category) &&
      (!input.occasion || design.tags.includes(input.occasion)))),
  ).map(design => {
    const reasons: string[] = [];
    let score = 0;
    function match(condition: boolean, points: number, reason: string) {
      if (condition) { score += points; reasons.push(reason); }
    }
    match(design.colors.some(color => color === input.color), 4, input.color + 'を使用');
    match(design.category === input.category, 4, input.category + 'のデザイン');
    match(!!input.occasion && design.tags.includes(input.occasion), 3, input.occasion + '向け');
    match(input.budget !== undefined, 1, '予算内の参考料金');
    match(!!input.mood && design.tags.includes(input.mood), 3, input.mood + 'な雰囲気');
    match(!!input.intensity && design.tags.includes(input.intensity), 3, input.intensity + 'な仕上がり');
    const haystack = normalize([design.title, design.description, design.category, ...design.tags, ...design.colors].join(' '));
    const matching = [...new Set(words)].filter(word => haystack.includes(aliases[word] ?? word));
    match(matching.length > 0, matching.length * 2, '希望の言葉「' + matching.join('・') + '」に一致');
    return { design, score, reasons: reasons.length ? reasons : ['ギャラリーのサンプルから選出'] };
  }).sort((a, b) => b.score - a.score || a.design.price - b.design.price || a.design.id.localeCompare(b.design.id)).slice(0, 3);
}
