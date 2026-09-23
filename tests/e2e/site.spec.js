import { expect, test } from '@playwright/test';

test('homepage photos form an operable three-slide carousel', async ({ page }) => {
  await page.goto('/');
  const carousel = page.getByRole('region', { name: '学生风采轮播' });
  const photo = carousel.locator('img');
  await expect(photo).toHaveAttribute('src', '/images/training-room-01.webp');
  await carousel.getByRole('button', { name: '下一张照片' }).click();
  await expect(photo).toHaveAttribute('src', '/images/training-room-02.webp');
  await expect(carousel.getByText('02 / 03')).toBeVisible();
  await carousel.getByRole('button', { name: '上一张照片' }).click();
  await expect(photo).toHaveAttribute('src', '/images/training-room-01.webp');
  await carousel.getByRole('button', { name: '查看第 3 张照片' }).click();
  await expect(photo).toHaveAttribute('src', '/images/meeting-room.webp');
  await carousel.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(photo).toHaveAttribute('src', '/images/training-room-02.webp');
});

test('carousel pauses on hover and for reduced motion', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  const carousel = page.getByRole('region', { name: '学生风采轮播' });
  const photo = carousel.locator('img');
  await carousel.hover();
  await page.clock.runFor(6500);
  await expect(photo).toHaveAttribute('src', '/images/training-room-01.webp');
  await page.mouse.move(0, 0);
  await page.clock.runFor(6500);
  await expect(photo).toHaveAttribute('src', '/images/training-room-02.webp');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.runFor(6500);
  await expect(photo).toHaveAttribute('src', '/images/training-room-02.webp');
});

test('carousel responds to a horizontal touch swipe', async ({ page }) => {
  await page.goto('/');
  const carousel = page.getByRole('region', { name: '学生风采轮播' });
  await carousel.evaluate((element) => {
    const start = new Touch({ identifier: 1, target: element, screenX: 300, screenY: 100 });
    const end = new Touch({ identifier: 1, target: element, screenX: 100, screenY: 100 });
    element.dispatchEvent(new TouchEvent('touchstart', { changedTouches: [start], bubbles: true }));
    element.dispatchEvent(new TouchEvent('touchend', { changedTouches: [end], bubbles: true }));
  });
  await expect(carousel.locator('img')).toHaveAttribute('src', '/images/training-room-02.webp');
});

test('members can move from the homepage to the learning path', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /从好奇出发/ })).toBeVisible();
  await page.getByRole('link', { name: /查看学习路线/ }).click();
  await expect(page).toHaveURL(/\/learn\/$/);
  await expect(page.getByText('Stage 26–30')).toBeVisible();
});

test('the meeting has a schedule and playable media', async ({ page }) => {
  await page.goto('/events/2026-09-13-meeting/');
  await expect(page.getByRole('heading', { name: '活动日程' })).toBeVisible();
  await expect(page.getByText('暑期打榜颁奖')).toBeVisible();
  await expect(page.locator('video')).toHaveCount(3);
  await expect(page.locator('source[src="/videos/meeting-moment.mp4"]')).toHaveCount(1);
  await expect(page.locator('video[aria-label="见面会录像 · 第一段"]')).toBeHidden();
  await page.getByRole('button', { name: '播放见面会录像 · 第一段' }).click();
  const recording = page.locator('video[aria-label="见面会录像 · 第一段"]');
  await expect(recording).toBeVisible();
  await expect.poll(() => recording.evaluate((video) => video.readyState), { timeout: 20_000 }).toBeGreaterThan(1);
  await recording.evaluate((video) => { video.currentTime = 600; });
  await expect.poll(() => recording.evaluate((video) => video.currentTime), { timeout: 20_000 }).toBeGreaterThan(599);
  await expect.poll(() => recording.evaluate((video) => video.readyState), { timeout: 20_000 }).toBeGreaterThan(1);
  const shortClip = page.locator('video[aria-label="现场短镜头"]');
  await shortClip.evaluate((video) => video.load());
  await expect.poll(() => shortClip.evaluate((video) => video.readyState), { timeout: 10_000 }).toBeGreaterThan(1);
});

test('pages fit the screen without horizontal scrolling', async ({ page }) => {
  for (const path of ['/', '/learn/', '/events/', '/events/2026-09-13-meeting/']) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(dimensions.scrollWidth, path).toBeLessThanOrEqual(dimensions.width + 1);
  }
});
