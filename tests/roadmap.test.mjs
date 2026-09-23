import assert from 'node:assert/strict';
import test from 'node:test';
import { phases } from '../src/data/roadmap.mjs';

test('the learning path covers all 31 source stages once', () => {
  const stageNumbers = phases.flatMap((phase) => phase.stages);
  assert.deepEqual(stageNumbers, Array.from({ length: 31 }, (_, index) => index));
});

test('every phase has a title, summary, and focus', () => {
  assert.equal(phases.length, 6);
  for (const phase of phases) {
    assert.ok(phase.title.trim());
    assert.ok(phase.summary.trim());
    assert.ok(phase.focus.length >= 2);
  }
});
