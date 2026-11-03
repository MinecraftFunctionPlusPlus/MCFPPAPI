---
lastUpdated: true
---

# 构建产物与 IR

## 查看数据包

运行 `mcfpp build` 后，输出位于 `targetPath` 指定的目录。以下配置使用 `name = "hello"` 和 `targetPath = "build"`：

```text
build/
├── hello/
│   ├── pack.mcmeta
│   └── data/
│       ├── hello/function/
│       └── minecraft/tags/function/
├── bin.mclib
└── module.json
```

`hello/` 是游戏加载的数据包。`bin.mclib` 和 `module.json` 用于库导出，位于数据包目录之外。Minecraft 目标版本决定包格式和命令生成方式。

`assetsPath` 中有文件时，同时生成 `hello-resources/` 资源包。两份输出各自带有 `pack.mcmeta`；资源引用和插件操作见[原版资源协同](./06vanilla-resources)。

编译器从项目函数、加载与 tick 标签、显式资源开始寻找引用。随后保留这些引用使用的标准库函数和资源。动态函数目标会保留可能匹配的函数族。

`dataPath` 中的资源按用户声明保留。查看链接记录可以了解某个文件来自哪里，以及为何保留它。

## 导出可读的编译记录

IR 是编译器处理中间结果的文本表示。它帮助你比较源码、生成命令和最终输出。

在 IDEA 右侧选择 **MCFPP → Dump IR**，或运行：

```sh
mcfpp build --dump-ir
```

默认生成三个文件：

| 文件 | 内容 |
| --- | --- |
| `build/ir/01-compiled.ir` | 已编译函数的类型化基本块、指令、源码位置和已生成命令 |
| `build/ir/02-optimized.ir` | 编译器整理入口与运行时初始化后的结果 |
| `build/ir/03-linked.ir` | 最终保留、省略的资源及引用来源 |

基本块是一段顺序执行的指令。部分函数直接生成 Minecraft 命令，这类函数会明确标为直接生成，记录中保留实际命令。

控制台中的 IR 路径可以点击。也可以指定另一个输出目录：

```sh
mcfpp build --dump-ir=inspection
```

相对目录从构建输出根目录计算，上例输出到 `build/inspection/`。

## 用一个小例子跟踪输出

```mcfpp
func add(a: int, b: int): int {
    return a + b
}

func main() {
    external count: int = 2
    print(add(count, 3))
}
```

1. 运行 **Dump IR**。
2. 在 `01-compiled.ir` 中查找 `add` 和 `main`。
3. 比较 `02-optimized.ir` 中的入口及初始化命令。
4. 在 `03-linked.ir` 中查看标准库资源的保留理由。
5. 打开数据包中的 `main.mcfunction`，检查最后生成的命令。

生成的内部函数名称由编译器决定。按源码位置和调用关系查找，可以更稳定地跟踪结果。
