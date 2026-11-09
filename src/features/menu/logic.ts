import { baseMenus, firstOffers, options, type MenuOption, type NailMenu } from './data';

export type Quantities = Readonly<Record<string, number>>;

export function quantity(option: MenuOption, requested: number) {
  if (!Number.isFinite(requested) || requested < 1) return 0;
  return option.unit === 'fixed' ? 1 : Math.min(Math.floor(requested), option.maxQuantity ?? 1);
}

export function updateQuantity(current: Quantities, option: MenuOption, requested: number): Quantities {
  const next = { ...current };
  const count = quantity(option, requested);
  if (!count) {
    delete next[option.id];
    return next;
  }
  for (const other of options) {
    if (option.exclusiveGroup && other.exclusiveGroup === option.exclusiveGroup) delete next[other.id];
  }
  return { ...next, [option.id]: count };
}

export function estimate(menu: NailMenu | undefined, selections: Quantities) {
  const groups = new Set<string>();
  const lines = menu ? [{ id: menu.id, name: menu.name, count: 1, price: menu.price, minutes: menu.minutes }] : [];
  for (const option of options) {
    const count = quantity(option, selections[option.id]);
    if (!count || (menu && !menu.optionIds.includes(option.id))) continue;
    if (option.exclusiveGroup) {
      if (groups.has(option.exclusiveGroup)) continue;
      groups.add(option.exclusiveGroup);
    }
    lines.push({ id: option.id, name: option.name, count, price: option.price * count, minutes: option.minutes * count });
  }
  return {
    lines,
    price: lines.reduce((total, item) => total + item.price, 0),
    minutes: lines.reduce((total, item) => total + item.minutes, 0),
  };
}

export function duration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return '約' + (hours ? hours + '時間' : '') + (remainder || !hours ? remainder + '分' : '');
}

export const jstDate = (now: Date) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(now);

export function campaignStatus(start: string, end: string, day: string) {
  if (day < start) return '開始前';
  return day > end ? '終了' : '開催中';
}

export const revisionStatus = (effective: string, day: string) => day < effective ? '改定予定' : '改定済み';

export type QuizAnswers = { first: boolean; style: NailMenu['style']; budget: number; time: number; off: 'none' | 'own' | 'other' };

export function recommend(answers: QuizAnswers) {
  return baseMenus.filter(menu => menu.style === answers.style).flatMap(menu => {
    if (answers.off !== 'none' && !menu.optionIds.includes(answers.off)) return [];
    const first = answers.first ? firstOffers.find(offer => offer.id === menu.id) : undefined;
    const total = estimate(first ? { ...menu, price: first.price } : menu, { [answers.off]: 1 });
    if (total.price > answers.budget || total.minutes > answers.time) return [];
    return [{ menu, ...total, first: Boolean(first) }];
  }).sort((a, b) => a.price - b.price || a.minutes - b.minutes);
}
