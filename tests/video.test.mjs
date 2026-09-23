import assert from 'node:assert/strict';
import test from 'node:test';
import { describeVideo } from '../src/lib/video.mjs';

test('uses a public HTTPS MP4 URL in the native player', () => {
  assert.deepEqual(describeVideo('https://cdn.example.org/meeting.mp4'), {
    playable: true,
    src: 'https://cdn.example.org/meeting.mp4',
  });
});

test('shows the pending state while a recording URL has not been supplied', () => {
  assert.deepEqual(describeVideo(''), { playable: false, src: null });
});

test('rejects insecure and malformed video URLs', () => {
  assert.deepEqual(describeVideo('http://cdn.example.org/meeting.mp4'), { playable: false, src: null });
  assert.deepEqual(describeVideo('not-a-url'), { playable: false, src: null });
});

test('keeps signed query strings intact for direct links', () => {
  assert.deepEqual(describeVideo('https://cdn.example.org/meeting.mp4?token=abc'), {
    playable: true,
    src: 'https://cdn.example.org/meeting.mp4?token=abc',
  });
});
