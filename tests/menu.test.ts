import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { baseMenus, options } from '../src/features/menu/data';
import { campaignStatus, duration, estimate, jstDate, recommend, revisionStatus, updateQuantity } from '../src/features/menu/logic';

test('counts options in yen and minutes, with one mutually exclusive removal', () => {
  const selected = updateQuantity({ own: 1, parts: 2 }, options[5], 1);
  assert.deepEqual(selected, { parts: 2, other: 1 });
  const quote = estimate(baseMenus[0], selected);
  assert.equal(quote.price, 9300);
  assert.equal(quote.minutes, 130);
  assert.equal(duration(quote.minutes), '約2時間10分');
  assert.equal(duration(60), '約1時間');
  assert.equal(estimate(baseMenus[0], { own: 1, other: 1 }).lines.length, 2);
});

test('rejects invalid counts, clamps limits and skips unsupported options', () => {
  const quote = estimate(undefined, { stone: -4, parts: 100, length: Infinity, repair: 1.8, other: 2 });
  assert.deepEqual(quote.lines.map(item => [item.id, item.count]), [['parts', 5], ['repair', 1], ['other', 1]]);
  assert.equal(estimate(baseMenus[4], { length: 1 }).price, 3800);
  assert.equal(estimate(undefined, {}).price, 0);
  assert.deepEqual(updateQuantity({ parts: 1 }, options[1], 0), {});
});

test('campaigns use inclusive dates and revisions apply from midnight in Tokyo', () => {
  const before = jstDate(new Date('2026-10-31T14:59:59Z'));
  const boundary = jstDate(new Date('2026-10-31T15:00:00Z'));
  assert.equal(before, '2026-10-31');
  assert.equal(boundary, '2026-11-01');
  assert.equal(campaignStatus('2026-11-01', '2026-11-30', before), '開始前');
  assert.equal(campaignStatus('2026-11-01', '2026-11-30', boundary), '開催中');
  assert.equal(campaignStatus('2026-11-01', '2026-11-30', '2026-11-30'), '開催中');
  assert.equal(campaignStatus('2026-11-01', '2026-11-30', '2026-12-01'), '終了');
  assert.equal(revisionStatus('2026-11-01', before), '改定予定');
  assert.equal(revisionStatus('2026-11-01', boundary), '改定済み');
});

test('recommendations account for initial pricing and removal within both limits', () => {
  const inputs = { first: true, style: 'simple', budget: 6900, time: 90, off: 'own' } as const;
  const result = recommend(inputs);
  assert.deepEqual(result.map(item => [item.menu.id, item.price, item.minutes]), [['one', 6900, 90]]);
  assert.deepEqual(recommend(inputs), result);
  assert.deepEqual(recommend({ ...inputs, budget: 6899 }), []);
  assert.deepEqual(recommend({ ...inputs, time: 89 }), []);
  assert.deepEqual(recommend({ ...inputs, first: false }), []);
});
