# MCFPP Playground

Playground 是 VitePress 文档站的 Vue + TypeScript 组件，由 `docs/zh/playground.md` 和 `docs/en/playground.md` 直接引入。页面共用站点导航、主题、路由和 Vite 热更新，没有独立的 Vue 挂载入口、构建命令或开发服务器。

## 运行与构建

在 MCFPPAPI 根目录运行：

```powershell
pnpm install
pnpm docs:dev
```

开发时直接访问文档站的 `/zh/playground.html` 或 `/en/playground.html`。如果已有 WebStorm 启动的文档服务，修改组件后会自动热更新，无需再次启动服务器。

```powershell
pnpm playground:typecheck
pnpm docs:build
```

VitePress 负责生成页面、Vue 脚本、样式和 DSB Worker。`docs/public/playground/` 只保存固定版本的 `compiler.json` 与 `lib/` 下的编译器 JAR；站点启动和构建前会核对 SHA-256。

## 代码结构

- `Playground.vue` 组合编辑器、生成文件查看器、运行面板和编译诊断。
- `components/SourceEditor.vue` 保留原生文本框、选择、中文输入、Tab 缩进和 Ctrl / Cmd + Enter；`editor/highlight.ts` 提供基础词法着色，通过文本插值安全渲染。
- `usePlayground.ts` 管理页面状态，按源码修订编号丢弃过期的编译和运行结果；组件卸载时停止 DSB。
- `services/compiler.ts` 管理浏览器 JVM、串行编译队列和可复用编译内核。初始化 Promise 保存在 `window` 上，站内切换和热更新均复用同一个 CheerpJ Library Mode 与内核。
- `services/cheerpj.ts` 声明本页面使用的异步 Java 接口。Java 代理不会进入 Vue 响应式系统，字符串转换也必须等待完成。
- `services/sandbox.ts` 导入真实编译产物，在新的 DSB Worker / 世界中先执行 load 标签，再执行所选函数。`sandbox-runtime.ts` 限定 SDK 懒加载导出；Worker 通过 Vite 的 `?worker&url` 导入，开发和生产构建由文档站统一处理资源路径。
- `style.css` 的规则限定在 `.mcfpp-playground` 内，颜色使用 VitePress 主题变量，跟随站点深色模式开关。

Markdown 使用 `ClientOnly` 避免在静态生成阶段启动浏览器 JVM。资源 URL 通过 `withBase('/playground/')` 生成，中英文页面共用一套编译器资源。

## 编译与运行

源文件固定为 `main.mcfpp`，命名空间为 `playground`，目标为 Minecraft 1.21.8。页面通过 CheerpJ 5.0 / Java 25 调用 `PlaygroundCompilerApi.openKernel/compile`，保留标准库协议和准备基线。每次请求由 Java 创建独立源码和产物目录，返回文件内容、清理目录并恢复可变状态。前端通过一次 JSON 传输接收结果。

构建任务 `prepareBuiltinImportPlan` 预生成固定标准库的符号目录、签名、继承布局引用和原生绑定描述符。未用闭合 data 成员及其注解按需加载；普通外部库维持原导入流程。内核独占当前编译器，队列串行执行请求。首次编译时间包含标准库准备及基线建立，不计入页面初始化时间。

“编译并运行”优先执行 `playground:main`。右侧支持切换多个生成文件及其他函数入口；默认只显示聊天和标题输出，启用“命令反馈”可查看全部结果。源码修改或编译失败会清空旧产物；每次运行创建新世界，“停止”会终止当前 Worker。

编译结果框在没有产物时显示初始化、编译进度或红色错误诊断；有产物时只显示所选文件内容。初始化和编译耗时显示在编辑器底部。

`services/runtime-resources.ts` 保存用官方 `cjGetRuntimeResources()` 从默认示例真实编译中采集的 Java 25 资源区间，交给 `cheerpjInit.preloadResources` 并行下载。更新 CheerpJ 或 Java 版本时须重新采集；不要手写推测的区间。参考 [CheerpJ 资源预加载文档](https://cheerpj.com/docs/guides/Startup-time-optimization)。HTTP 缓存能复用已下载的资源，整页刷新仍会重新创建 JVM；站内切换则复用当前 JVM。

初始化和编译期间显示实时计时及当前阶段。初始化等待上限为 120 秒，编译等待上限为 180 秒；到期会显示错误并要求重载。超时只结束页面等待，不能取消已经进入 JVM 的调用，因此超时后的编译器不再接受新任务。源码草稿保存在浏览器本地存储，重载后恢复；浏览器禁止存储时不影响正常编译。编译耗时不包含后续 DSB 执行时间。

DSB 0.2.2 的浏览器命令引擎不接受 `function #tag`，适配器按顺序展开 load 标签并逐个调用实际函数，同时收集初始化的输出与诊断。

## 更新编译器资源

仅重新准备编译器时需要 Node.js 和 PATH 中的 JDK 25：

```powershell
pnpm playground:prepare F:\Project_MCFPP\MCFPP\build\releases\0.1.0
```

接入本地优化构建时，可以直接指定完整 JAR：

```powershell
pnpm playground:prepare F:\Project_MCFPP\MCFPP\build\playground\MCFPP-0.1.0.jar
```

先在编译器工程运行 `gradlew playgroundJar`，它会自动生成导入计划并保留完整标准库。资源脚本检查内核 API 是否存在；对发布目录校验发布清单，直接指定本地 JAR 时计算 SHA-256 并核对复制前后的内容，不改写原发布清单。随后按当前 JAR 重新生成独立兼容覆盖 JAR 和 `compiler.json`。更新时将两个 JAR 与元数据一起提交，并刷新已打开的 Playground 以重建 JVM。普通文档站开发和构建无需安装 JDK。

兼容覆盖仅改变 NBT `Dictionary` 的构造器调用，使用缓存的反射构造器绕过已复现的 CheerpJ JIT 临时变量覆盖问题。源码位于 `scripts/playground-compat/`；独立复现与 issue 草稿位于 `tools/cheerpj-repro/`，可运行 `pnpm playground:repro` 生成附件。
