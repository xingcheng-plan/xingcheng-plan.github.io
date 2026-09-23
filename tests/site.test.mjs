import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function page(path) {
  return readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');
}

test('the homepage links members to learning and meeting content', async () => {
  const html = await page('index.html');
  assert.match(html, /星程计划/);
  assert.match(html, /href="\/learn\/"/);
  assert.match(html, /href="\/events\/2026-09-13-meeting\/"/);
});

test('the learning page renders the six verified phases', async () => {
  const html = await page('learn/index.html');
  assert.match(html, /编程与 AI 基础/);
  assert.match(html, /方向探索/);
});

test('the meeting page includes its schedule and a playable short clip', async () => {
  const html = await page('events/2026-09-13-meeting/index.html');
  assert.match(html, /暑期打榜颁奖/);
  assert.match(html, /src="\/videos\/meeting-moment.mp4"/);
  assert.match(html, /\/stream\/recording-one\/index.m3u8/);
});
