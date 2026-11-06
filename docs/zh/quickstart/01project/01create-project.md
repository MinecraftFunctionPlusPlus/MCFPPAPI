---
lastUpdated: true
---

# 创建工程

一个 MCFPP 工程包含配置、源码和资源。IDEA 向导与 CLI 使用同一套模板。普通工程生成数据包，MNI 工程还包含 Kotlin 源码和 JUnit 测试。

## 在 IDEA 中创建

1. 安装 [MCFPP 插件](https://github.com/Alumopper/mcfpp-language-support/releases)。
2. 选择 **File → New → Project → MCFPP**。
3. 输入名称和目录，选择 JDK 21。
4. 等待工程同步，打开 `src/main/mcfpp/main.mcfpp`。
5. 点击右侧 **MCFPP → Build**。

>[!NOTE]
> 需要编写 Kotlin 扩展时，选择 **MCFPP MNI**。创建后的 Kotlin 示例见 [MNI 入门](../09mni/01mni-framework)。

MCFPP插件内置匹配的 MCFPP CLI、标准库、语言服务和格式化工具。建议使用 JDK 21 及其以上版本运行编译器和 MNI 构建。需要 Node.js 20 或更新版本运行代码格式化服务。若要 MCFPP CLI 等自定义工具路径，可以在 **Settings → Tools → MCFPP** 中设置。

## 使用 CLI 创建

```sh
mcfpp init hello
cd hello
mcfpp build
```

对于一个普通的 MCFPP 普通工程，其结构和主要文件如下：

```text
hello/
├── .mcfpp/
├── build/ （仅在构建后出现）
├── mcfpp.toml
├── mcfpp-packages.json
├── src/main/mcfpp/main.mcfpp
├── src/main/resources/data/
└── src/test/mcfpp/
```

`mcfpp.toml` 用于保存工程配置。`mcfpp-packages.json` 用于保存依赖声明。构建使用 `.mcfpp/` 保存缓存，并将产物写入 `build/`。

## 编写第一个函数

在`src/main/mcfpp/main.mcfpp`中写下第一个函数：

```mcfpp
func main() {
    print("Hello MCFPP!")
}
```

在先前执行的创建工程的命令 `mcfpp init hello` 会将工程默认命名空间设为 `hello`。构建后，数据包目录为 `build/hello/`。接下来，将构建得到的数据包部署到 Minecraft 存档中：

1. 将 `build/hello/` 复制到存档的 `datapacks/` 目录。
2. 在游戏中执行 `/reload`。
3. 执行 `/function hello:main`。

若成功，聊天栏将显示 `Hello MCFPP!`。

构建或工具配置问题见[处理构建问题](./05troubleshooting)。
