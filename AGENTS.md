# AGENTS.md

面向在本仓库工作的 AI 编码代理。

项目背景、本地运行方式、写作与定制教程见 [README.md](README.md)。此处只写**约束**和**验证方式**，不重复 README 的内容。

## 项目定位

Hugo 静态博客 + PaperMod 主题。推送到 `main` 即由 GitHub Actions 构建并部署到 GitHub Pages，无需手工发布。

## 约束

### 1. 版本必须对齐

`.github/workflows/hugo.yaml` 里的 `HUGO_VERSION` 必须与本地 `hugo version` 一致，且 CI 使用 **extended** 构建。不一致会导致「本地能构建、CI 报错」。升级 Hugo 时，同一次提交里同步修改 workflow。

### 2. 主题是只读依赖

`themes/PaperMod/` 是 git submodule，**不要修改其中任何文件**。改动会在 submodule 更新时丢失，并让工作区变脏。

定制一律在站点根目录建同名路径覆盖——Hugo 中站点 `layouts/` 的优先级高于主题。可覆盖的注入点见 README 的「定制」一节。

### 3. 构建产物不入库

`public/` 与 `resources/` 是构建产物，已在 `.gitignore` 排除。不要用 `git add -f` 绕过。

### 4. Hugo 0.146+ 的目录命名

`layouts/_partials/`、`layouts/_shortcodes/`、`layouts/_markup/` **均带前导下划线**。网上多数教程写的是旧的无下划线路径，照抄会静默失效——不报错，只是不生效，排查成本很高。

### 5. 配置不要用废弃写法

分页用 `pagination.pagerSize`，不要用已废弃的 `paginate`。

### 6. 数学公式的分隔符配置在两处，必须同步

`hugo.yaml` 的 `markup.goldmark.extensions.passthrough.delimiters` 与 `layouts/_partials/extend_head.html` 里的 `delimiters` 是同一套约定的两个副本。**只改一处会导致公式静默不渲染**——不报错、不警告，只是页面上原样显示 LaTeX 源码。改动前先确认两处一致。

`static/katex/` 是 vendored 的第三方资源（KaTeX 0.18.4，MIT 协议），**不要手工编辑**。升级时重新下载发行包整体替换，并同步更新其中的 LICENSE。

### 7. 自定义 CSS 与主题变量的耦合

`assets/css/extended/custom.css` 把文章目录固定到正文右侧，水平位置写死为 `calc(50% + 384px + 32px)`。其中 `384px` 是正文列宽 768px 的一半（`--main-width: 720px` 加两侧 `--gap: 24px`）。

**若修改 `--main-width` 或 `--gap`，这个 calc 必须同步改**，否则侧栏会与正文重叠或错位，且不会报错。

该文件的宽屏规则统一带 `.main` 前缀，是为了压过主题在暗色模式下的 `[data-theme="dark"] details.toc`（特异性 `0,2,1`）。**去掉前缀会让目录在暗色模式下残留卡片背景。**

### 8. 字体栈与打包路径的耦合

字体栈在 `assets/css/extended/fonts.css`，字体文件自托管在 `static/fonts/`（均为 SIL OFL 1.1）。Inter 取 Fontsource 的 latin 子集，JetBrains Mono 用上游的完整字体。

`@font-face` 的 `src` 用绝对路径 `/fonts/...`：该文件会被打包进 `/assets/css/stylesheet.<hash>.css`，在那里相对路径解析不到 `static/`。**前提是站点部署在域名根目录**（`hugo.yaml` 的 `baseURL` 已是该形态）。若将来移到子路径，这里必须同步改——否则字体静默不加载，不报错，只是回退到系统字体。

Inter 的 `unicode-range` 只声明 latin 码位，这是中文不下载 webfont 的关键：中文字符在匹配阶段就跳过 webfont。**不要为了「中英文统一」给中文引入 webfont**——CJK 子集几 MB 起，与这个站点的体积取向冲突。

**JetBrains Mono 不能加 `unicode-range`**，必须让它在代码块里接管所有能渲染的字符。它若被限制成 latin 子集，制表符（`├──` `│`）和箭头（`→`）会回退到 Consolas，而两者步进不同（0.55em vs 0.6em），同一行代码里混两种步进会让树形图和 ASCII art 错位——不报错，只是画出来是歪的。同理，**不要为了让体积好看把它换回子集版本**。

`woff2` 是第三方资源，**不要手工编辑**；升级时重新下载整体替换，并同步更新同目录下的 `LICENSE-*.txt`。

### 9. 行高覆盖与显式值的继承陷阱

正文行高调在 `assets/css/extended/typography.css`（`body` 设 1.7）。

主题里凡是**显式写了行高**的地方都不会继承 `body`，改 `body` 时容易漏。已知需要同步的只有 `.entry-content`（列表页摘要，主题里是 1.6），typography.css 里已覆盖。标题、导航、页脚、代码块各自都有显式行高，属于刻意保留，不要顺手「统一」。

**新增任何使用中文正文的组件时，先确认它有没有自己的行高**——漏掉不会报错，只是那一处的行距比别处紧一档。

## 验证

提交前必须构建通过，命令与 CI 保持一致：

```bash
hugo build --gc --minify --baseURL "https://toyuli.github.io/"
```

退出码 0 即可。输出中可能有来自主题模板的 deprecation 警告，**不要为了消除它去改主题文件**。

若改动了内容或配置，再用 `hugo server -D` 肉眼确认页面正常。

## 提交

- 推送 `main` 会直接触发线上部署，没有预发布环境
- 提交信息前缀：`post:` 内容 / `fix:` 修复 / `chore:` 维护 / `docs:` 文档
- 不要顺手重构无关文件

## 内容约定

- 文章放 `content/posts/`，文件名用英文短横线，中文标题写在 front matter 的 `title`
- 新建文章默认 `draft: true`，**发布前必须改成 `false`**，否则不会被部署
- `about.md`、`archives.md`、`search.md` 是功能性页面，靠 front matter 的 `layout` 字段绑定主题模板，删除会导致导航栏对应入口 404

## 改动后自查

1. 构建退出码 0，无 ERROR
2. `git status` 没有 `public/`、`resources/` 混入
3. 推送后到仓库 Actions 页面确认工作流变绿
