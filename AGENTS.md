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
