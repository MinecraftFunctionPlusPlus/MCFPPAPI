# Playground 编译器资源

页面使用文档站的 Vue/TypeScript 组件，编译器通过 TeaVM 0.16.0 提前编译为 WasmGC，
在独立 Web Worker 中运行。编译源码不会发送到服务器。

在相邻 MCFPP 仓库的 `teavm-playground` 分支构建：

```powershell
.\gradlew.bat :browser:buildWasmGC
```

随后在本站仓库更新资源：

```powershell
pnpm playground:prepare
pnpm playground:typecheck
pnpm docs:build
```

准备命令默认读取 `../MCFPP/browser/build/generated/teavm/wasm-gc/`，也接受自定义生成目录。
它先检查全部产物，再复制模块、加载器及调试文件到 `docs/public/playground/teavm/`，
将版本、文件大小和 SHA-256 写入 `teavm.json`。启动和构建文档站前校验文件哈希。
调试文件随资源提供，但页面默认不加载。

目标固定为 Minecraft 1.21.8，包含该版本完整内置标准库。首次编译时间包含标准库准备，
后续编译复用内核并恢复可变状态。页面与 DSB 的说明见组件目录的 README。
