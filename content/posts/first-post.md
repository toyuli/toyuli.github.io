---
title: "开始写博客"
date: 2026-09-19T14:00:00+08:00
draft: false
tags: ["hugo", "博客"]
categories: ["随笔"]
author: "toyuli"
description: "用 Hugo + PaperMod 搭起这个站点，记录一下过程。"
showToc: true
TocOpen: false
hidemeta: false
comments: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
UseHugoToc: true
---

这个站点用 Hugo 生成，主题是 PaperMod，通过 GitHub Actions 自动部署到 GitHub Pages。

## 目录结构

```
.
├── .github/workflows/hugo.yaml   # CI：构建并部署
├── archetypes/post.md            # 新文章的 front matter 模板
├── content/                      # 全部内容
│   ├── posts/                    # 文章
│   ├── about.md
│   ├── archives.md
│   └── search.md
├── themes/PaperMod/              # 主题（git submodule）
└── hugo.yaml                     # 站点配置
```

## 写一篇新文章

```bash
hugo new content posts/my-new-post.md
```

默认会生成 `draft: true` 的草稿，本地预览时用 `-D` 才能看到：

```bash
hugo server -D
```

写完把 `draft` 改成 `false` 再提交，CI 才会发布。

## 发布流程

推送到 `main` 分支即可：

```bash
git add .
git commit -m "post: 新文章"
git push
```

GitHub Actions 会自动构建 `public/` 并部署，几十秒后站点就更新了。
