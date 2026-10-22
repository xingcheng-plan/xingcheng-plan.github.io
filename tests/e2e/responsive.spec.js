import { expect, test } from '@playwright/test';

test('phone menu opens, closes with Escape and links to other pages', async ({ page }) => {
  await page.setViewportSize({width:393,height:844});
  await page.goto('/');
  const menu=page.getByRole('button',{name:/菜单/});
  const nav=page.getByRole('navigation',{name:'主导航'});
  await expect(nav).toBeHidden();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded','true');
  await expect(nav).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(nav).toBeHidden();
  await menu.click();
  await nav.getByRole('link',{name:'学习路线'}).click();
  await expect(page).toHaveURL(/\/learn\/$/);
  await expect(page.getByRole('heading',{name:'学习路线',exact:true})).toBeVisible();
});

test('phone first screen fits the photo controls and uses the lab logo', async ({ page }) => {
  await page.setViewportSize({width:393,height:844});
  await page.goto('/');
  const logo=page.locator('.brand .lab-logo');
  await expect(logo).toHaveAttribute('src','/images/brand/lab-logo.png');
  await expect.poll(()=>logo.evaluate(im=>im.naturalWidth)).toBeGreaterThan(0);
  const bottom=await page.locator('.carousel-footer').evaluate(el=>el.getBoundingClientRect().bottom);
  expect(bottom).toBeLessThanOrEqual(844);
  for(const button of await page.locator('.carousel-arrows button,.carousel-pause,[data-nav-toggle]').all()){
    const rect=await button.boundingBox();
    expect(rect.width).toBeGreaterThanOrEqual(44);
    expect(rect.height).toBeGreaterThanOrEqual(44);
  }
});

test('homepage chapters align below the header and respect reduced motion', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  await page.getByRole('link',{name:'第 2 屏：内容入口'}).click();
  await expect.poll(async()=>Math.abs(await page.locator('#explore').evaluate(el=>el.getBoundingClientRect().top)-await page.locator('.site-header').evaluate(el=>el.getBoundingClientRect().height))).toBeLessThan(3);
  await expect(page.getByRole('link',{name:'第 2 屏：内容入口'})).toHaveAttribute('aria-current','location');
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await page.locator('html').evaluate(el=>getComputedStyle(el).scrollSnapType)).toBe('none');
  await page.setViewportSize({width:320,height:568});
  for(const path of ['/','/about/','/learn/','/events/','/events/2026-09-13-meeting/']){
    await page.goto(path);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
});

test('a wheel gesture stops on one chapter before another gesture can advance', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  await page.mouse.move(700,450);
  await page.mouse.wheel(0,120);
  for(let i=0;i<5;i++) await page.mouse.wheel(0,180);
  await expect.poll(()=>page.locator('#explore').evaluate(el=>Math.abs(el.getBoundingClientRect().top-76))).toBeLessThan(3);
  await page.mouse.wheel(0,160);
  await expect(page.locator('#path')).not.toBeInViewport();
  // This gap represents releasing the wheel and starting a fresh gesture.
  await page.waitForTimeout(500);
  await page.mouse.wheel(0,120);
  await expect.poll(()=>page.locator('#path').evaluate(el=>Math.abs(el.getBoundingClientRect().top-76))).toBeLessThan(3);
});

test('the final chapter includes its photo, useful links and footer', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#continue');
  const ending=page.getByRole('region',{name:'继续探索'});
  await expect(ending.locator('img[src="/images/meeting-group.jpg"]')).toBeVisible();
  await expect(ending.getByRole('link',{name:/找到你的起点/})).toBeVisible();
  await expect(ending.getByRole('link',{name:/回看共同的足迹/})).toBeVisible();
  await expect(ending.getByRole('link',{name:/回到第一页/})).toBeVisible();
  expect(await page.locator('.site-footer').count()).toBe(0);
  expect(await ending.locator('footer').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(901);
  await ending.getByRole('link',{name:/回到第一页/}).click();
  await expect(page.getByRole('heading',{name:/从好奇出发/})).toBeVisible();
});
