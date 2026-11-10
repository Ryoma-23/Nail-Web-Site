import type { NailDesign } from '../gallery/data';

export function newest(items: readonly { design: NailDesign; date: string }[], today: string, limit: number) {
  const end = Date.parse(today + 'T00:00:00Z');
  if (!Number.isFinite(end)) return [];
  const start = end - 29 * 86400000;
  return items.filter(item => {
    const timestamp = Date.parse(item.date + 'T00:00:00Z');
    return timestamp >= start && timestamp <= end;
  }).sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function websiteUrl(value: string) {
  const input = value.trim();
  if (!/^https?:\/\//i.test(input) || /[\s\\\u0000-\u001f\u007f]/u.test(input)) return undefined;
  try {
    const parsed = new URL(input);
    if (!parsed.hostname || parsed.username || parsed.password || parsed.href.length > 512) return undefined;
    return parsed.href;
  } catch { return undefined; }
}
