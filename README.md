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

### 数学公式

支持 LaTeX 语法，由 [KaTeX](https://katex.org/) 在浏览器端渲染：

```markdown
行内公式 \(a^2 + b^2 = c^2\)，以及 \(O(n \log n)\)。

块级公式：

$$
\frac{\partial L}{\partial \theta} = \sum_{i=1}^{N} \nabla_\theta \ell(x_i, y_i)
$$
```

| 分隔符 | 用途 |
|---|---|
| `\(...\)` | 行内 |
| `$$...$$` 或 `\[...\]` | 独立成行（display 模式） |

> **行内公式请用 `\(...\)` 而不是 `$...$`。** KaTeX 对 `$` 有已知限制：正文里出现单独的 `$`（价格、shell 提示符）会被误判为公式边界。若确实要用 `$...$`，需同时修改 `hugo.yaml` 的 `passthrough.delimiters` 和 `layouts/_partials/extend_head.html` 里的 `delimiters`，**两处必须一致**，否则公式不渲染且不报错。

KaTeX 的 JS/CSS/字体自建于 `static/katex/`，不依赖外部 CDN，任何网络环境都能加载。只有页面确实包含公式时才会引入这些资源，普通页面不受影响。

> **公式较多的文章建议显式设置 `description`。** 不设的话，页面的 meta 描述会回退到正文摘要，分享到社交平台时预览文字里会露出 `$$...$$` 原始 LaTeX。虽然页面本身不受影响，但观感不好。

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
├── assets/                      自定义资源
│   └── css/extended/            自定义样式（自动打包进主题样式）
│       ├── custom.css           宽屏目录侧栏
│       ├── fonts.css            字体
│       └── typography.css       正文行高
├── layouts/                     覆盖主题模板用
│   └── _partials/
│       └── extend_head.html     KaTeX 资源注入
├── static/                      原样拷贝的静态文件（favicon、头像）
│   ├── fonts/                   自托管的字体文件
│   └── katex/                   KaTeX 数学公式资源
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
| 换字体 | `assets/css/extended/fonts.css` + `static/fonts/` |
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

### 宽屏目录侧栏

正文列固定 720px 居中，在宽屏上两侧会留出大片空白。`assets/css/extended/custom.css` 里用一段媒体查询，把目录从「正文顶部折叠块」改为**固定在正文右侧常驻显示**，只在视口 ≥ 1320px 时生效；窄屏自动回退成主题原本的折叠样式。

纯 CSS 实现，没有覆盖主题模板，主题升级不会冲突。开关由文章 front matter 的 `showToc` 控制（未设置时为 `false`）：

```yaml
---
title: "文章标题"
showToc: true
---
```

> 侧栏的水平位置由 `left: calc(50% + 384px + 32px)` 决定，其中 `384px` 是正文列宽度 768px 的一半。**若修改 `--main-width`，这个值必须同步改**，否则侧栏会与正文重叠或错位，且不会有任何报错。

### 字体

西文用自托管的 [Inter](https://rsms.me/inter/)，代码块用自托管的 [JetBrains Mono](https://www.jetbrains.com/lp/mono/)，中文交给系统字体。Inter 取 latin 子集（48KB），JetBrains Mono 用完整字体（111KB），合计约 160KB，且只在页面确实用到时才下载。

**中文刻意不下载 webfont。** 整套 CJK 子集动辄几 MB，对博客来说加载成本远超收益，而系统自带的苹方 / 微软雅黑 / 思源黑体质量够用、还会随系统升级。西文用 webfont、中文用系统字体，是中文站点最普遍的做法。

主题原本的字体栈清一色是西文字体，中文只能靠浏览器逐字回退，跨设备观感不可控。`fonts.css` 把所有中文字体按平台列全，把「哪台设备用哪个字体」从浏览器的猜测变成确定的声明：

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
    "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif;
```

Inter 的 `@font-face` 用 `unicode-range` 只声明 latin 码位——中文字符在字体匹配阶段就跳过 webfont，既不触发下载，也不会渲染成豆腐块。

**JetBrains Mono 则刻意不写 `unicode-range`。** 等宽字体有一条正文没有的硬约束：同一段代码块里每个字符必须走同样的步进。latin 子集不含制表符（`├──`、`│`）和箭头（`→`）这类画树形图要用的字符，它们会回退到 Consolas——而 Consolas 步进 0.55em、JetBrains Mono 是 0.6em，两者混在同一行，树形图的竖线就会错开。不写 range 等于「这个字体负责它能渲染的一切，渲染不了的再逐字回退」，正是等宽场景需要的语义。完整字体比子集大 71KB，换来的就是网格一致。

换字体要同时改两处：字体栈在 `assets/css/extended/fonts.css`，字体文件在 `static/fonts/`。替换文件时同步更新同目录下的 `LICENSE-*.txt`（Inter 与 JetBrains Mono 均为 [SIL OFL 1.1](https://openfontlicense.org)）。Inter 子集取自 [Fontsource](https://fontsource.org/)，JetBrains Mono 完整版取自[上游仓库](https://github.com/JetBrains/JetBrainsMono)的 `fonts/webfonts/`。

> `@font-face` 用的是绝对路径 `/fonts/...`。本文件会被打包进 `/assets/css/stylesheet.<hash>.css`，相对路径在那里对不上；绝对路径的前提是站点部署在域名根目录，也就是 `hugo.yaml` 里 `baseURL` 的形态。

### 正文行高

主题给 `body` 设的是 `line-height: 1.6`，那是按西文调的。中文是方块字，字面率高、笔画密，同样的行高下视觉上更拥塞，中文正文的常见取值是 1.7–1.8。正文本就以中文为主，`typography.css` 里取 1.7。

改的是 `body` 而不是 `.post-content`，因为列表页、归档页、关于页的中文都要照顾到，逐个列选择器只会漏。两处不受影响，都是主题里更具体的声明：标题（`h1–h6` 单独设了 1.2）、导航与页脚（各自写死了行高）。代码块也不受影响——`.post-content code` 有显式的 1.5，实测改动前后代码块高度与行距完全一致。

**唯一需要单独覆盖的是 `.entry-content`**（列表页摘要）：它在主题里显式写了 1.6，显式值不会继承 `body`，漏掉它会让首页摘要比正文紧一档，且不会有任何报错。

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
