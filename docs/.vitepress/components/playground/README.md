# MCFPP Playground

Playground 是文档站内的 Vue + TypeScript 组件，中英文 Markdown 共用导航、主题、路由和热更新。
页面通过 Web Worker 加载 TeaVM 0.16.0 生成的 WasmGC 编译器，无需启动浏览器 JVM。

## 运行与更新

```powershell
# 首次更新编译器，在 MCFPP 仓库运行：
.\gradlew.bat :browser:buildWasmGC
# 在 MCFPPAPI 仓库运行：
pnpm playground:prepare
pnpm playground:typecheck
pnpm docs:dev
```

访问 `/zh/playground.html` 或 `/en/playground.html`。已有文档服务器时直接使用原服务。
普通文档构建只需 Node.js，不需要 Java：`pnpm docs:build`。

`playground:prepare` 默认读取相邻 MCFPP 仓库的 `browser/build/generated/teavm/wasm-gc/`，
也接受自定义生成目录。资源保存在 `docs/public/playground/teavm/`，`teavm.json` 记录版本和哈希。
启动和构建前通过 `playground:verify` 校验模块与加载器是否完整、匹配。

## 编译与运行

固定编辑 `main.mcfpp`，命名空间为 `playground`，目标为 Minecraft 1.21.8，包含该目标的完整内置标准库。
Wasm 入口继续使用 `PlaygroundCompilerApi` 可复用内核及原有解析、语义、优化、导出流程。
第一次编译的计时包含标准库准备和基线建立，每次请求使用独立源码、产物目录，并恢复可变状态。

编译和 DSB 各自运行在 Worker 中。右侧可以切换多个生成文件及运行入口，默认运行 `playground:main`。
源码修改或编译失败会清空旧文件和运行输出；错误以红色显示在结果框内，耗时显示在编辑器底部。
初始化等待上限 120 秒，编译等待上限 60 秒；超时会终止编译 Worker，并提供重载入口。
源码草稿保存在浏览器本地存储。站内切换和热更新复用当前编译内核，整页刷新创建新内核。

## 代码结构

- `Playground.vue` 组合编辑器、生成文件和运行面板，`usePlayground.ts` 管理页面状态与源码修订。
- `SourceEditor.vue` 与 `editor/highlight.ts` 提供基础高亮、Tab 缩进和 Ctrl / Cmd + Enter。
- `services/compiler.ts` 管理编译队列、超时和 Worker 生命周期；`compiler-protocol.ts` 定义纯数据消息。
- `services/compiler.worker.ts` 加载 Wasm，持有独占内核，返回文件、诊断和阶段计时。
- `services/sandbox.ts` 将实际编译产物交给 DSB；每次运行使用新世界，按顺序展开 load 标签。
- `style.css` 使用 VitePress 主题变量，样式限定在 Playground 内。

Java/Kotlin 的 TeaVM 适配位于 MCFPP 的 `browser/` 模块，说明见该目录的 README。
