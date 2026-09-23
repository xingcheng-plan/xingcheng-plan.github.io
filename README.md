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
- 两段长录像在 `public/stream/`，为 720p H.264/AAC HLS 文件；短片在 `public/videos/`。播放器点击后才开始加载长录像。

不要将原始 4K 视频、DJI `.LRF` 文件、录取名单、个人作业或内部服务器资料加入此公开仓库。

## 发布

推送到 `main` 后，GitHub Actions 构建并发布 GitHub Pages。网站仓库必须保持公开，Pages 来源设置为 **GitHub Actions**。由于视频占用较大，新增媒体前先确认构建产物仍低于 GitHub Pages 的 1 GB 上限。
