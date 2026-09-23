import { expect, test } from '@playwright/test';

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
  await expect(page.locator('video[aria-label="见面会录像 · 第一段"]')).toBeVisible();
});

test('mobile pages fit the screen without horizontal scrolling', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  for (const path of ['/', '/learn/', '/events/', '/events/2026-09-13-meeting/']) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(dimensions.scrollWidth, path).toBeLessThanOrEqual(dimensions.width + 1);
  }
});
