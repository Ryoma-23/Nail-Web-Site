import assert from 'node:assert/strict';
import test from 'node:test';
import { recommend } from '../src/features/interactive/recommendation';
import { compareColors, dominantColor } from '../src/features/interactive/imageSimilarity';
import { palette } from '../src/features/interactive/colors';
import { restoreDesign, serializeDesign } from '../src/features/interactive/designFile';
import { defaultNail } from '../src/features/interactive/nailArt';

test('recommendation is deterministic and respects exact filters and budget', () => {
  const conditions = { color: 'Pink', category: 'MAGNET', budget: 9000, occasion: 'お呼ばれ', keywords: 'ピンク' };
  const results = recommend(conditions);
  assert.deepEqual(results.map(result => result.design.id), ['rose']);
  assert.deepEqual(recommend(conditions), results);
  assert.deepEqual(recommend({ ...conditions, budget: 100 }), []);
  assert.equal(recommend({ color: 'Beige', budget: 7000 }, undefined, false)[0].design.id, 'milk-tea');
});

test('representative color ignores transparent pixels and ranks exact colors first', () => {
  const color = dominantColor(new Uint8ClampedArray([0,0,255,0,231,157,176,255,231,157,176,255,10,10,10,255]));
  assert.deepEqual(color, [231,157,176]);
  assert.ok(compareColors(color!)[0].design.colors.includes('Pink'));
  assert.equal(compareColors(color!)[0].score, 100);
  assert.equal(dominantColor(new Uint8ClampedArray([0,0,0,0])), undefined);
});

test('HSL palettes preserve the input and compute the hue opposite red', () => {
  const colors = palette('#ff0000', '補色');
  assert.deepEqual(colors.slice(0,2), ['#ff0000', '#00ffff']);
  assert.equal(palette('#225599', 'トライアド').length, 4);
});

test('settings round trip and invalid schemas or positions are rejected', () => {
  const nails = Array.from({ length:5 }, () => defaultNail);
  assert.deepEqual(restoreDesign(serializeDesign(nails)), nails);
  assert.throws(() => restoreDesign(serializeDesign(nails.slice(1))));
  nails[0] = { ...defaultNail, decorations: [{ type: 'stone', x: 1000, y: 0 }] };
  assert.throws(() => restoreDesign(serializeDesign(nails)));
});
