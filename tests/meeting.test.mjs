import assert from 'node:assert/strict';
import test from 'node:test';
import { meetingAgenda, meetingVideos, formatAgendaMinute } from '../src/data/meeting.mjs';

test('the published agenda covers the full two-hour meeting without gaps', () => {
  assert.equal(meetingAgenda[0].startMinute, 0);
  assert.equal(meetingAgenda.at(-1).endMinute, 120);
  for (let index = 1; index < meetingAgenda.length; index += 1) {
    assert.equal(meetingAgenda[index].startMinute, meetingAgenda[index - 1].endMinute);
  }
});

test('the media list includes two recordings and the brief scene clip', () => {
  assert.deepEqual(meetingVideos.map((video) => video.id), [
    'recording-one',
    'recording-two',
    'meeting-moment',
  ]);
});

test('agenda minutes format as relative hours and minutes', () => {
  assert.equal(formatAgendaMinute(0), '0:00');
  assert.equal(formatAgendaMinute(95), '1:35');
  assert.equal(formatAgendaMinute(120), '2:00');
});
