import { hexPattern, rgb } from '../interactive/colors';

export const themes = {
  natural: ['#88554B', '#F1D7C7', '#FFF9F4'],
  luxury: ['#AD8849', '#45371F', '#191714'],
  feminine: ['#AA4065', '#F8D4E3', '#FFF4F8'],
  minimal: ['#272727', '#E2E2E2', '#FAFAFA'],
  botanical: ['#3D6552', '#D5E8D8', '#F5FBF6'],
  elegant: ['#6E518A', '#E7DBF3', '#FAF6FF'],
} as const;

export const fonts = {
  'Elegant Serif': 'Georgia, "Yu Mincho", serif',
  'Modern Sans': 'system-ui, sans-serif',
  'Japanese Mincho': '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", serif',
  'Japanese Gothic': '"Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif',
  'Soft Rounded': 'ui-rounded, "Hiragino Maru Gothic ProN", "Meiryo", system-ui, sans-serif',
} as const;

export const sections = ['concept', 'gallery', 'menu', 'profile', 'faq', 'reservation'] as const;
export type Section = typeof sections[number];
export const illustrated = ['concept', 'gallery', 'profile'] as const;
export const layouts = ['写真左', '写真右', '縦並び', '全幅画像', 'カード'] as const;
export const shapes = ['Square', 'Rounded', 'Circle', 'Arch', 'Organic Shape'] as const;
export const modes = ['light', 'dark', 'system'] as const;
export const languages = ['ja', 'en'] as const;
export const faqStyles = ['シンプル', 'カード', '枠線', 'アイコン'] as const;
export const colorFields = { primaryColor: 'メインカラー', accentColor: 'アクセントカラー', backgroundColor: '背景色' } as const;
export type ColorField = keyof typeof colorFields;
export type SiteCustomization = {
  colorMode: typeof modes[number];
  themePreset: keyof typeof themes | 'custom';
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  language: typeof languages[number];
  fontPreset: keyof typeof fonts;
  headingFont: keyof typeof fonts;
  bodyFont: keyof typeof fonts;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  sectionOrder: Section[];
  hiddenSections: Section[];
  sectionLayouts: Record<typeof illustrated[number], typeof layouts[number]>;
  imageShape: typeof shapes[number];
  faqStyle: typeof faqStyles[number];
  allowMultiple: boolean;
};

export const defaults: SiteCustomization = {
  colorMode: 'light', themePreset: 'natural', primaryColor: themes.natural[0],
  accentColor: themes.natural[1], backgroundColor: themes.natural[2], language: 'ja',
  fontPreset: 'Elegant Serif', headingFont: 'Elegant Serif', bodyFont: 'Japanese Gothic',
  fontSize: 15, letterSpacing: 0.03, lineHeight: 1.7,
  sectionOrder: [...sections], hiddenSections: [],
  sectionLayouts: { concept: '写真左', gallery: 'カード', profile: '写真右' },
  imageShape: 'Rounded', faqStyle: 'シンプル', allowMultiple: false,
};

export function applyTheme(themePreset: keyof typeof themes): Partial<SiteCustomization> {
  const [primaryColor, accentColor, backgroundColor] = themes[themePreset];
  return { themePreset, primaryColor, accentColor, backgroundColor };
}

export function safeColor(field: ColorField, value: string) {
  return hexPattern.test(value) ? value.toUpperCase() : defaults[field];
}

export function readableInk(hex: string) {
  const [r, g, b] = rgb(hex).map(value => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? '#000000' : '#FFFFFF';
}

export function mixColor(hex: string, target: number, amount: number) {
  return '#' + rgb(hex).map(channel => Math.round(channel * (1 - amount) + target * amount).toString(16).padStart(2, '0')).join('');
}

export function reorder(order: Section[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= order.length || to >= order.length) return order;
  const next = [...order];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

