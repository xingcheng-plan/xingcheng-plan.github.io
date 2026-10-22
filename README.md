# 星程计划网站

公开网站：<https://xingcheng-plan.github.io/>

这是星程计划的公开展示站点。内部资料仍保存在私有仓库 `xingcheng-plan/xingcheng-plan`，不会自动同步到这里。

## 本地预览

需要 Node.js 24 或更新版本。

```sh
npm ci
npm run dev
```

打开终端输出的本地网址。发布前运行：

```sh
npm run build:verify
npm run test:e2e
```

## 更新内容

- 活动文章放在 `src/content/events/`，每篇 Markdown 的顶部填写标题、日期、摘要和封面。新增文章会自动出现在“活动记录”中。
- 第二期见面会的日程和视频条目在 `src/data/meeting.mjs`。日程依据原始时刻表 PDF 整理，修改时请核对来源。
- 学习路线六阶段在 `src/data/roadmap.mjs`，整理自原资料的 Stage 0–30。
- 图片放在 `public/images/`。上传前压缩，并填写准确的替代文字。
- 首页轮播依次展示见面会大合照、暑期集训、技术公益项目汇报与最佳技术奖。见面会导师照片仅在详情页图库中展示。新照片按主题放在 `public/images/technical-public-welfare/` 与 `public/images/team-life/`，五张照片均在“关于星程”的实践交流和团队生活中展示；原图另归档于主项目 `assets/photos/` 的同名分类目录。
- 两段长录像在 `public/stream/`，为 720p H.264/AAC HLS 文件；短片在 `public/videos/`。播放器点击后才开始加载长录像。

不要将原始 4K 视频、DJI `.LRF` 文件、录取名单、个人作业或内部服务器资料加入此公开仓库。

## 布局与品牌

- 实验室蓝色鹰形 Logo 复用自视障项目 `blv-review-demo/public/assets/blv-logo.png`，保存于 `public/images/brand/lab-logo.png`，用于页头、页脚及站点图标。
- 首页五个主要板块以视口为最小高度，使用逐屏吸附和板块导航，滚轮手势每次前进或后退一屏，过渡约 600 毫秒并停顿 350 毫秒，持续惯性需停止后才能触发下一次翻页；内容较长、横屏或文字放大时可继续滚动，减少动态效果设置下关闭吸附。
- 手机端使用可展开导航，常用按钮至少 44 像素；详情页保持自然阅读长度。
- 首页最后一屏整合合照、后续入口、版权和返回首页按钮，不再额外追加大块页脚。

## 发布

推送到 `main` 后，GitHub Actions 构建并发布 GitHub Pages。网站仓库必须保持公开，Pages 来源设置为 **GitHub Actions**。由于视频占用较大，新增媒体前先确认构建产物仍低于 GitHub Pages 的 1 GB 上限。
