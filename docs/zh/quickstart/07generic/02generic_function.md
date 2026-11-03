---
lastUpdated: true
---

# 泛型函数：用参数选择类型

同一段处理逻辑经常需要接收不同类型的数据。例如，返回传入的整数，或返回传入的字符串。泛型让你写一份函数，再在调用时选择具体类型。

本节先使用类型参数。下一节把同样的写法用于[数据模板](./03generic_class)。固定数值参数放在[编译时参数](./01concrete_var)中介绍。

## 写一个保留原类型的函数

将下面的完整示例放入普通工程的 `main.mcfpp`：

```mcfpp
func identity<T>(value: T): T {
    return value
}

func main() {
    var score = identity<int>(42)
    var message = identity<string>("Ready")
    print(score)
    print(message)
}
```

调用 `main` 时，依次显示 `42` 和 `Ready`。`score` 的类型是 `int`，`message` 的类型是 `string`。

## 逐项读懂声明和调用

`T` 是我们为类型参数起的名字。它可以换成 `Item` 等名称。声明中的每一个 `T` 都指向这同一个类型参数。

| 声明的一部分 | 含义 |
| --- | --- |
| `identity<T>` | 调用者为 `T` 选择一个类型 |
| `value: T` | 参数使用调用者选择的类型 |
| `: T` | 返回值也使用该类型 |

调用 `identity<int>(42)` 时：

1. `<int>` 让本次调用中的 `T` 表示 `int`。
2. `(42)` 将整数 `42` 传给 `value`。
3. 函数返回一个 `int`，因此 `score` 也推导为 `int`。

可以把这次调用理解为使用了签名 `identity(value: int): int`。`identity<string>("Ready")` 则使用签名 `identity(value: string): string`。

`<T>` 是 `<T: type>` 的简写。`type` 表示这个位置接收一个类型。类型参数写在尖括号中，普通数据参数写在圆括号中。

## 让多个参数使用同一类型

```mcfpp
func choose<T>(first: T, second: T, useFirst: bool): T {
    if (useFirst) {
        return first
    }
    return second
}

func main() {
    external useFirst: bool = true
    print(choose<int>(10, 20, useFirst))
    print(choose<string>("Start", "Stop", false))
}
```

`first`、`second` 和返回值都使用 `T`。本例的整数调用传入两个整数，字符串调用传入两个字符串。`useFirst` 始终为 `bool`，与 `T` 无关。

编译时，`<int>` 和 `<string>` 决定函数采用的类型。游戏运行时，生成的函数接收普通参数，并执行分支和返回。`external useFirst` 明确让第一处调用使用运行时条件。

## 在泛型函数中使用类型

函数体可以使用参数、返回它，或调用该类型已有的接口。给 `T` 起名后，编译器仍需要确认每个操作适用于本次选中的类型。需要整数算术的函数，可以直接使用 `int` 参数。

泛型也能出现在函数类型中，例如 `callback: (T) -> T`。先熟悉本节的类型对应关系，再阅读 [Lambda 与函数类型](../04function/05lambda)。

继续阅读[泛型数据模板](./03generic_class)，把类型参数用于字段和构造函数。
