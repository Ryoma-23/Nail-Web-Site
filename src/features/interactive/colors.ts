export const hexPattern = /^#[0-9a-f]{6}$/i;
export type PaletteMode = '補色' | '類似色' | 'トライアド' | 'モノクロマティック';
export const paletteModes: readonly PaletteMode[] = ['補色', '類似色', 'トライアド', 'モノクロマティック'];

export function rgb(hex: string): [number, number, number] {
  return [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16)) as [number, number, number];
}

export function palette(base: string, mode: PaletteMode) {
  const [r,g,b] = rgb(base).map(value => value / 255);
  const max = Math.max(r,g,b), min = Math.min(r,g,b), delta = max - min;
  const l = (max + min) / 2;
  const s = delta ? delta / (1 - Math.abs(2 * l - 1)) : 0;
  const h = delta ? (max === r ? (g-b)/delta : max === g ? (b-r)/delta+2 : (r-g)/delta+4)*60 : 0;
  const shifts = { 補色: [0,180,180,0], 類似色: [0,-30,30,55], トライアド: [0,120,240,120], モノクロマティック: [0,0,0,0] };
  function toHex(hue: number, light: number) {
    const value = Math.max(.12, Math.min(.92, light));
    const amplitude = s * Math.min(value, 1 - value);
    return '#' + [0,8,4].map(n => {
      const k = ((n + hue / 30) % 12 + 12) % 12;
      const channel = value - amplitude * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return Math.round(channel * 255).toString(16).padStart(2,'0');
    }).join('');
  }
  const offsets = mode === 'モノクロマティック' ? [0,-.22,.17,.33] : [0,0,.13,-.16];
  return shifts[mode].map((shift,index) => index === 0 ? base.toLowerCase() : toHex(h + shift, l + offsets[index]));
}
