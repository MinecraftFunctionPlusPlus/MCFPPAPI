---
lastUpdated: true
---

# IDEA 插件

## 打开并同步工程

使用 **File → Open** 打开包含 `mcfpp.toml` 的目录。插件会自动解析工程，读取 CLI 导出的工程信息，配置源码、资源、JDK 和依赖。右侧 **MCFPP** 工具窗口显示同步状态。

MNI 工程同步后，Kotlin 源码可以导航到编译器 API 和 Maven 依赖。修改配置或依赖后保存，插件会重新同步。也可点击 **Synchronize** 手动同步。同步失败时，窗口保留上次成功的信息，并提供重试入口。

## 编写与整理代码

插件提供补全、参数提示、文档、声明导航、查找引用和重命名。原生 MNI 声明指定 Kotlin/JVM 方法，例如：

```mcfpp
func add(left: int, right: int): int = example.mni.Arithmetic.add

func main() {
    print(add(20, 22))
}
```

保存和整文件格式化使用相同流程：

1. Linter 应用安全修复。
2. Prettier 整理格式。
3. 编辑器刷新诊断。

使用 **Code → Reformat Code** 手动格式化。默认缩进为四个空格，行宽为 100 列。项目中的 Prettier、Linter 配置和忽略文件可以调整行为。

行尾空格和缩进差异在格式化时整理。编辑器重点显示语法和代码含义相关的问题。格式化支持撤销。后台结果只应用到对应的文档版本。

## 运行任务

| 任务 | 用途 |
| --- | --- |
| **Build** | 准备依赖并编译数据包 |
| **Install** | 准备依赖 |
| **Update** | 按声明的版本范围更新依赖 |
| **Clean** | 删除构建输出 |
| **Lint** | 检查代码 |
| **Format Check** | 检查格式 |
| **Dump IR** | 构建并导出可读的编译记录 |
| **Test** | 在 MNI 工程中运行 Kotlin/Java 测试 |

首次打开工程会创建这些运行配置。默认配置是 **MCFPP Build**。配置可设置工作目录、环境变量、附加参数、`offline` 和 `locked` 选项。

点击顶部运行按钮或工具窗口中的任务按钮。Run 窗口支持停止、重新执行和错误跳转。构建完成后，点击 **Open Build Output** 打开数据包目录。

## 配置工具

打开 **Settings → Tools → MCFPP**，设置：

- **JDK 21**：运行 CLI 和 Kotlin MNI 构建。
- **Node.js**：运行 Prettier 与 Linter。
- **命令服务 Java**：运行 Minecraft 命令服务，使用 Java 25。
- **外部工具路径**：需要时选择外部 CLI 或格式化包。

语言服务需要带 LSP 支持的 IDEA 发行版。工具窗口同时显示当前工具版本，便于检查实际使用的工具。
