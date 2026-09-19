# toyuli.github.io

一个使用 Hugo 构建的个人博客，托管在 GitHub Pages 上。

**线上地址：https://toyuli.github.io/**

## 技术栈

| 组件 | 说明 |
|---|---|
| [Hugo](https://gohugo.io/) | 静态站点生成器，需要 **extended** 版，0.146 以上 |
| [PaperMod](https://github.com/adityatelange/hugo-PaperMod) | 主题，以 git submodule 引入 |
| GitHub Actions | 推送到 `main` 后自动构建并部署 |
| GitHub Pages | 静态托管 |

没有数据库、没有服务端运行时，产物是一堆静态文件。

## 本地运行

```bash
git clone --recurse-submodules https://github.com/toyuli/toyuli.github.io.git
cd toyuli.github.io
hugo server -D
```

然后打开 http://localhost:1313 。

`--recurse-submodules` **不能省略**——主题是以 submodule 引入的，漏掉这一项会得到一个没有样式的空站点。如果已经克隆过但 `themes/PaperMod/` 是空的：

```bash
git submodule update --init --recursive
```

`-D` 表示连同 `draft: true` 的草稿一起渲染；去掉则只显示已发布内容。

生成部署用的静态文件：

```bash
hugo build --gc --minify --baseURL "https://toyuli.github.io/"
```

产物输出到 `public/`，该目录已在 `.gitignore` 中排除，不会入库。

## 写文章

```bash
hugo new content posts/my-new-post.md
```

新文件由 `archetypes/post.md` 模板生成，默认 `draft: true`，此时只有 `hugo server -D` 能看到。写完把 `draft` 改成 `false` 再提交。

### 常用 front matter

| 字段 | 说明 |
|---|---|
| `title` / `date` | 标题、日期 |
| `tags` / `categories` | 自动生成 `/tags/xxx/`、`/categories/xxx/` 归档页 |
| `description` | 摘要，同时用于 SEO |
| `showToc: true` | 显示文章目录 |
| `cover.image` | 列表页封面图 |
| `weight` | 置顶，数字越小越靠前 |
| `draft` | 草稿开关 |

多图文章建议使用**页面包**：建 `content/posts/文章名/index.md`，图片放在同一目录，用相对路径引用。这样文章与资源在一起，删除文章时不会留下孤立文件。

## 目录结构

```
.
├── hugo.yaml                    站点配置，唯一配置源
├── content/                     全部内容
│   ├── posts/                   文章
│   ├── about.md                 关于页
│   ├── archives.md              归档页
│   └── search.md                搜索页
├── archetypes/                  新建内容的模板
│   └── post.md                  文章模板
├── assets/                      自定义资源（当前为空）
├── layouts/                     覆盖主题模板用（当前为空）
├── static/                      原样拷贝的静态文件（当前为空）
├── themes/PaperMod/             主题，git submodule
└── .github/workflows/hugo.yaml  CI 配置
```

`about.md`、`archives.md`、`search.md` 看着像文章，其实是**功能性页面**。它们靠 front matter 里的 `layout` 字段去匹配主题的对应模板，删掉会导致导航栏入口 404。

## 定制

**不要直接修改 `themes/PaperMod/` 下的文件。** 它是 submodule，改动会在下次更新时丢失，也会让工作区变脏。

正确做法是在站点根目录建立**同名路径**覆盖——Hugo 的查找顺序是站点 `layouts/` 先于主题 `layouts/`：

| 想做什么 | 建立哪个文件 |
|---|---|
| 自定义 CSS | `assets/css/extended/custom.css`（自动打包，无需手动引入） |
| 换 favicon | `static/favicon.ico` |
| 加评论 | `layouts/_partials/comments.html` |
| 注入统计脚本 | `layouts/_partials/extend_footer.html` |
| 注入 head 内容 | `layouts/_partials/extend_head.html` |
| 覆盖主题模板 | `layouts/` 下对应同名文件 |

> **注意目录命名**：Hugo 0.146 起 partials 目录由 `layouts/partials/` 改为 **`layouts/_partials/`**，短代码同理改为 `layouts/_shortcodes/`。网上大量教程写的仍是旧路径，照抄会静默失效——不报错，只是不生效。

站点配置集中在 `hugo.yaml`，常改的几项：

| 配置项 | 作用 |
|---|---|
| `params.homeInfoParams` / `params.profileMode` | 首页形态，二选一 |
| `params.mainSections` | 首页展示哪个 section |
| `params.socialIcons` | 社交链接 |
| `menu.main` | 导航栏 |
| `markup.highlight.style` | 代码高亮配色 |

## 部署

推送到 `main` 即自动部署，无需其他操作：

```bash
git add .
git commit -m "post: 文章标题"
git push
```

[Actions 页面](https://github.com/toyuli/toyuli.github.io/actions)可以看到构建进度，通常几十秒完成。

Pages 的 Source 需设置为 **GitHub Actions**（仓库 Settings → Pages）。若误设为「Deploy from a branch」，GitHub 会用 Jekyll 去构建 Hugo 源码，必然失败。

## 许可

文章内容版权归作者所有。

站点源码可自由参考使用。主题版权归 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 作者所有，遵循 MIT 协议。
