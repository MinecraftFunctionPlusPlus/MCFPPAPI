---
lastUpdated: true
---

# 创建工程

一个 MCFPP 工程包含配置、源码和资源。IDEA 向导与 CLI 使用同一套模板。普通工程生成数据包，MNI 工程还包含 Java 源码和 JUnit 测试。

## 在 IDEA 中创建

1. 安装 MCFPP 插件。
2. 选择 **File → New → Project → MCFPP**。
3. 输入名称和目录，选择 JDK 21。
4. 等待工程同步，打开 `src/main/mcfpp/main.mcfpp`。
5. 点击右侧 **MCFPP → Build**。

需要编写 Java 扩展时，选择 **MCFPP MNI**。创建后的 Java 示例见 [MNI 入门](../09mni/01mni-framework)。

插件包含匹配的 CLI、标准库、语言服务和格式化工具。JDK 21 运行编译器和 MNI 构建。Node.js 20 或更新版本运行格式化服务。工具路径可以在 **Settings → Tools → MCFPP** 中设置。

## 使用 CLI 创建

```sh
mcfpp init hello
cd hello
mcfpp build
```

使用 JAR 发行包时，命令形式如下。将路径替换为本机文件路径：

```sh
java -jar /path/to/mcfpp-cli.jar init hello
cd hello
java -jar /path/to/mcfpp-cli.jar build
```

普通工程的主要文件如下：

```text
hello/
├── mcfpp.toml
├── mcfpp-packages.json
├── src/main/mcfpp/main.mcfpp
├── src/main/resources/data/
└── src/test/mcfpp/
```

`mcfpp.toml` 保存工程配置。`mcfpp-packages.json` 保存依赖声明。构建使用 `.mcfpp/` 保存缓存，并将产物写入 `build/`。

## 编写第一个函数

`src/main/mcfpp/main.mcfpp`：

```mcfpp
func main() {
    print("Hello MCFPP!")
}
```

`mcfpp init hello` 将默认命名空间设为 `hello`。构建后，数据包目录为 `build/hello/`。

1. 将 `build/hello/` 复制到存档的 `datapacks/` 目录。
2. 在游戏中执行 `/reload`。
3. 执行 `/function hello:main`。

聊天栏显示 `Hello MCFPP!`。`main` 是可调用的函数。顶层语句适合[加载时初始化](../02base/04top-statements)。

继续阅读 [IDEA 开发流程](./03idea)、[配置文件](./02config-file)和[构建产物与 IR](./04build-and-ir)。

构建或工具配置问题见[处理构建问题](./05troubleshooting)。
