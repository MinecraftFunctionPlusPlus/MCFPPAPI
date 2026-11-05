# Playground 编译器资源

页面使用文档站中的 Vue/TypeScript 组件。CheerpJ 5.0 从官方 CDN 加载，Java 版本固定为 25。

在相邻的 MCFPP 仓库构建浏览器分发文件：

```powershell
.\gradlew.bat playgroundJar
```

随后在本站仓库更新资源：

```powershell
pnpm playground:prepare ../MCFPP/build/playground/MCFPP-0.1.0.jar
pnpm playground:typecheck
pnpm test:filesystem
pnpm docs:build
```

`playgroundJar` 保留原始 `build/libs/MCFPP-0.1.0.jar`，输出 `build/playground/MCFPP-0.1.0.jar`。它将所有标准库目标的文件保存为索引和共享 chunk，打包结束后逐字节验证全部文件；不会删减标准库内容。旁边的 `.source.json` 分别记录原始和派生 JAR 的 SHA-256。资源准备脚本校验该清单，再将来源哈希和派生哈希写入 `compiler.json`。

`playground:prepare` 也接受原始 JAR 或发布目录。直接传入原始 JAR 时保留其布局；需要紧凑资源布局时应传入 `build/playground/` 中的产物。

页面初始化后、加载编译器前应用文件系统兼容修正。它只匹配已复现的 CheerpJ 5.0 函数实现，修正缓存替换的引用计数、重命名目录的旧路径缓存和过期回调的对象归属；升级运行时时应重新执行独立的目录重命名复现和页面编译验收。JavaScript 补丁不捕获或隐藏其他运行时异常。
