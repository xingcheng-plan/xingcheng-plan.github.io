export const meetingAgenda = [
  { startMinute: 0, endMinute: 5, title: '开场', detail: '介绍见面会的目的与流程。' },
  { startMinute: 5, endMinute: 15, title: '老师致辞', detail: '欢迎新同学加入星程计划。' },
  { startMinute: 15, endMinute: 45, title: '导师介绍与交流', detail: '导师介绍研究方向与后续交流方式。' },
  { startMinute: 45, endMinute: 50, title: '公布分组', detail: '说明导师与学生的分组及组织安排。' },
  { startMinute: 50, endMinute: 55, title: '暑期打榜颁奖', detail: '为暑期打榜竞赛获奖同学颁奖。' },
  { startMinute: 55, endMinute: 95, title: '新生介绍与集训感悟', detail: '同学们分享自己和暑期集训的收获。' },
  { startMinute: 95, endMinute: 105, title: '交流答疑', detail: '围绕学习方向、科研与项目参与展开交流。' },
  { startMinute: 105, endMinute: 110, title: '总结', detail: '回顾见面会与后续安排。' },
  { startMinute: 110, endMinute: 120, title: '合影', detail: '导师与同学们共同留影。' },
];

export const meetingVideos = [
  {
    id: 'recording-one',
    title: '见面会录像 · 第一段',
    description: '活动现场记录，约 38 分钟。',
    duration: '37:49',
    poster: '/images/meeting-talk.webp',
    src: '/stream/recording-one/index.m3u8',
  },
  {
    id: 'recording-two',
    title: '见面会录像 · 第二段',
    description: '活动现场记录，约 35 分钟。',
    duration: '35:01',
    poster: '/images/meeting-room.webp',
    src: '/stream/recording-two/index.m3u8',
  },
  {
    id: 'meeting-moment',
    title: '现场短镜头',
    description: '见面会现场的简短片段。',
    duration: '00:01',
    poster: '/images/meeting-room.webp',
    src: '/videos/meeting-moment.mp4',
  },
];

export function formatAgendaMinute(minute) {
  return `${Math.floor(minute / 60)}:${String(minute % 60).padStart(2, '0')}`;
}
