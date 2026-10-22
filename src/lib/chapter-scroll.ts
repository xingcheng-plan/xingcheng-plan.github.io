// One wheel gesture advances one chapter; touch and keyboard use native snapping.
const chapters = [...document.querySelectorAll<HTMLElement>('.home-page > section')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
let animating = false;
let gestureLocked = false;
let holdUntil = 0;
let lastWheel = 0;
let accumulated = 0;
let direction = 0;

function cancelTransition() {
  cancelAnimationFrame(frame);
  animating = false;
  gestureLocked = false;
  accumulated = 0;
  document.documentElement.classList.remove('chapter-moving');
}

function advanceTo(chapter: HTMLElement) {
  const header = document.querySelector('.site-header')!.getBoundingClientRect().height;
  const from = window.scrollY;
  const to = chapter.getBoundingClientRect().top + from - header;
  const start = performance.now();
  animating = true;
  gestureLocked = true;
  document.documentElement.classList.add('chapter-moving');
  function tick(now: number) {
    const progress = Math.min((now - start) / 600, 1);
    const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
    window.scrollTo({ top: from + (to - from) * eased, behavior: 'instant' });
    if (progress < 1) frame = requestAnimationFrame(tick);
    else {
      document.documentElement.classList.remove('chapter-moving');
      animating = false;
      holdUntil = now + 350;
    }
  }
  frame = requestAnimationFrame(tick);
}

window.addEventListener('wheel', (event) => {
  if (!chapters.length || reducedMotion.matches || event.ctrlKey || event.metaKey ||
      Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY ||
      document.querySelector('.site-header[data-menu-open]')) return;
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
  // Leave independently scrollable panels and browser zoom alone.
  for (let node = target; node && node !== document.body; node = node.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 2) return;
  }
  const now = performance.now();
  const quiet = now - lastWheel;
  lastWheel = now;
  if (animating || now < holdUntil || (gestureLocked && quiet < 180)) {
    event.preventDefault();
    return;
  }
  gestureLocked = false;
  const header = document.querySelector('.site-header')!.getBoundingClientRect().height;
  const visibleHeight = window.innerHeight - header;
  const current = chapters.findIndex(chapter => {
    const rect = chapter.getBoundingClientRect();
    return rect.top <= header + 3 && rect.bottom > header + 3;
  });
  if (current < 0) return;
  const rect = chapters[current].getBoundingClientRect();
  const down = event.deltaY > 0;
  // Read oversized chapters normally, only turning after reaching their edge.
  if (rect.height > visibleHeight + 4 &&
      (down ? rect.bottom > window.innerHeight + 3 : rect.top < header - 3)) return;
  const next = current + (down ? 1 : -1);
  if (next < 0 || next >= chapters.length) return;
  event.preventDefault();
  const newDirection = down ? 1 : -1;
  if (quiet > 180 || newDirection !== direction) accumulated = 0;
  direction = newDirection;
  const delta = Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? visibleHeight : 1);
  accumulated += delta;
  if (accumulated >= 35) {
    accumulated = 0;
    advanceTo(chapters[next]);
  }
}, { passive: false });

window.addEventListener('pointerdown', cancelTransition, { passive: true });
window.addEventListener('touchstart', cancelTransition, { passive: true });
window.addEventListener('resize', cancelTransition);
document.addEventListener('keydown', cancelTransition);
reducedMotion.addEventListener('change', cancelTransition);
