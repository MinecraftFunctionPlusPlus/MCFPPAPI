---
lastUpdated: true
---

# 工程配置

在工程根目录中使用 `mcfpp.toml`。CLI 从当前目录向上查找这个文件，也可以通过 `--project` 指定工程。

## 一个完整的普通工程配置

```toml
schema = 1
name = "hello"
namespace = "hello"
version = "1.21.8"
description = "My first MCFPP datapack"
sourcePath = "src/main/mcfpp"
dataPath = "src/main/resources/data"
assetsPath = "src/main/resources/assets"
targetPath = "build"

[toolchain]
version = "java21-v1"

[mni]
enabled = false
```

| 字段 | 用途 |
| --- | --- |
| `schema` | 配置格式版本，当前为 `1` |
| `name` | 工程名称，也是输出数据包目录名 |
| `namespace` | 默认命名空间 |
| `version` | 本次构建的 Minecraft 目标版本 |
| `description` | 数据包描述 |
| `sourcePath` | MCFPP 源码目录，递归读取 `.mcfpp` 文件 |
| `dataPath` | 附加数据资源目录，其内容复制到数据包的 `data/` 下 |
| `assetsPath` | 客户端资源目录，非空时生成 `<name>-resources` 资源包 |
| `entrypoints` | 公开原版函数 ID 到 MCFPP 顶层函数的映射 |
| `resourceOverrides` | 允许替换编译产物的数据资源相对路径列表 |
| `targetPath` | 构建输出根目录，位于工程目录内 |
| `toolchain.version` | CLI 使用的工具链标识 |
| `mni.enabled` | 是否准备 Java MNI 源码和依赖 |

相对路径从工程根目录计算。`targetPath` 使用独立的子目录，例如 `build` 或 `out`。`mcfpp clean` 会删除这个输出目录。

## 编译选项

在顶层 `args` 中配置编译选项。将这一行放在第一个 `[表名]` 之前：

```toml
args = ["-level=INFO", "--dump-ir"]
```

命令行选项优先于文件中的同名选项：

```sh
mcfpp build -level=WARN
mcfpp build --dump-ir=inspect
mcfpp --project ./hello build
```

`--dump-ir=inspect` 将 IR 写入 `build/inspect/`。格式见[构建产物与 IR](./04build-and-ir)。

## 依赖和 MNI

在 `mcfpp-packages.json` 中声明 MCFPP 库和 Java 依赖。CLI 更新 `mcfpp.lock` 和 MNI 工程的 `mcfpp-mni.lock`。将配置、依赖声明和锁文件提交到版本库。

MNI 工程可使用 `[mni]` 配置 Java 仓库、插件和 Gradle 扩展。示例见 [Gradle 与 Java 构建](../10gradle/01gradle-configuration)。

版本条件见 [Minecraft 目标版本](../minecraft-versions)。

## 原版内容和资源包

将 mcfunction、进度、配方等放在 `dataPath/<namespace>/`，模型和贴图放在 `assetsPath/<namespace>/`。一次构建生成数据包和配套资源包，两者各自使用正确的包格式。详见[原版资源协同](./06vanilla-resources)。
