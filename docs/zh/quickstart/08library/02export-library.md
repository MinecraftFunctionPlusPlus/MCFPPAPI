---
lastUpdated: true
---

# 导出 MCFPP 库

库保存可复用的函数、类型和资源。消费者安装库后，可以继续根据实际调用分析和生成函数正文。

## 编写库

在新工程中，将 `mcfpp.toml` 设置为：

```toml
schema = 1
name = "score-utils"
namespace = "example.utils"
version = "1.21.8"
sourcePath = "src/main/mcfpp"
targetPath = "build"
dataPath = "src/main/resources/data"
noDatapack = true
args = ["-isLib"]

[library]
coordinate = "example:score-utils"
version = "1.0.0"
classifier = "mcfpp"
```

`src/main/mcfpp/rewards.mcfpp`：

```mcfpp
namespace example.utils

func addBonus(score: int): int {
    return score + 5
}
```

执行 `mcfpp build`。输出包含 `build/bin.mclib`、`build/module.json` 和模块资源。`noDatapack = true` 选择库用途，`-isLib` 按库模式处理入口。

## 打包

Mcfpm 负责包的打包和仓库发布。先在工程根目录准备 `mcfpm.toml`：

```toml
schema = 1

[package]
id = "example:score-utils"
version = "1.0.0"
license = "MIT"
minecraft = "1.21.8"

[tool]
consumer-profile = "all"
```

这里的包 ID、版本和 Minecraft 目标与 `mcfpp.toml` 保持一致。随后运行：

```sh
mcfpm pack --input build --type compiler.mcfpp.library --classifier mcfpp --output score-utils-1.0.0-mcfpp.zip --register
```

打包结果是库载荷。发布时还需按目标仓库的 Mcfpm 流程提供包描述和载荷。`mcfpp build` 与 `mcfpm pack` 分别完成编译和打包。

## 消费者使用

将包发布到已配置仓库后，消费者执行：

```sh
mcfpp add 'example:score-utils@^1.0.0'
mcfpp build
```

源码中导入 `example.utils:*` 并调用 `addBonus(10)`。包坐标决定安装的包，命名空间决定源码中的名字。

库正文、资源和依赖信息应作为一组发布。最终数据包按[引用关系](../01project/04build-and-ir)保留所需的标准库和库资源。
