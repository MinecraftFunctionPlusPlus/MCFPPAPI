---
lastUpdated: true
---

# MCFPP 语法总览

从[创建工程](/zh/quickstart/01project/01create-project)开始，可以在 IDEA 或终端中构建第一个数据包。

```mcfpp
data Reward {
    var amount: int = 10
}

func doubled(value: int): int {
    return value * 2
}

func main() {
    var reward = Reward()
    var transform: (int) -> int = { it + 5 }
    print(doubled(transform(reward.amount)))
}
```

上例依次展示数据模板、函数、变量、函数类型和 lambda。它打印 `30`。

## 常用语法

| 用途 | 写法 |
| --- | --- |
| 可变值 | `var score: int = 0` |
| 一次赋值 | `const limit = 10` |
| 运行时存储 | `external score: int = 0` |
| 函数结果 | `func add(a: int, b: int): int` |
| 类型参数 | `func identity<T>(value: T): T` |
| 类型别名 | `typealias int as Score` |
| 函数类型 | `(int) -> int` |
| lambda | `{ value -> value + 1 }` |
| 数据模板 | `data Reward { var amount: int }` |
| 共享对象 | `object data Settings { var limit: int = 10 }` |
| 抽象模板 | `abstract data Readable { abstract func read(): int }` |
| 普通注释 | `// explanation` |
| 文档注释 | `/// Markdown documentation` |

普通语句用换行分隔。同一行的多条语句用分号分隔。整数更新使用 `+=` 和 `-=`。

## 开发入口

- [IDEA 开发流程](/zh/quickstart/01project/03idea)：保存格式化、诊断和任务。
- [工程配置](/zh/quickstart/01project/02config-file)：TOML、目录和目标版本。
- [MNI 入门](/zh/quickstart/09mni/01mni-framework)：Java 原生函数和测试。
- [地址引用](/zh/quickstart/02base/06references)：计分板与 NBT 读写。
- [构建与 IR](/zh/quickstart/01project/04build-and-ir)：数据包和编译记录。
