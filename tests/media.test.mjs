import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import test from 'node:test';

const publicRoot = new URL('../public/', import.meta.url);

test('both recordings have complete playlists with every segment present', async () => {
  for (const name of ['recording-one', 'recording-two']) {
    const folder = new URL(`stream/${name}/`, publicRoot);
    const playlist = await readFile(new URL('index.m3u8', folder), 'utf8');
    assert.match(playlist, /#EXT-X-ENDLIST\s*$/);
    const segments = playlist.split(/\r?\n/).filter((line) => line.endsWith('.ts'));
    assert.ok(segments.length > 300);
    for (const segment of segments) {
      const file = await stat(new URL(segment, folder));
      assert.ok(file.size > 0 && file.size < 100 * 1024 * 1024);
    }
  }
});

test('all public assets remain below the Pages one-gigabyte cap', async () => {
  async function sizeOf(folder) {
    let total = 0;
    for (const item of await readdir(folder, { withFileTypes: true })) {
      const file = new URL(item.name + (item.isDirectory() ? '/' : ''), folder);
      total += item.isDirectory() ? await sizeOf(file) : (await stat(file)).size;
    }
    return total;
  }
  assert.ok(await sizeOf(publicRoot) < 900_000_000);
});
