---
lastUpdated: true
---

# 函数值与 lambda

函数值可以保存一段处理逻辑，并像普通函数一样调用。函数类型写作 `(参数类型) -> 返回类型`。

```mcfpp
func apply(value: int, transform: (int) -> int): int {
    return transform(value)
}

func main() {
    var add: (int, int) -> int = { left, right -> left + right }
    print(add(2, 3))

    print(apply(5, { value -> value * 2 }))
    print(apply(5) { it + 1 })
}
```

`(int, int) -> int` 表示接收两个整数并返回整数。`{ left, right -> left + right }` 是一个 lambda，也就是直接写出的匿名函数。

最后一个参数是回调时，可以把 lambda 放在调用括号后。单个参数可用默认名称 `it`。上例依次输出 `5`、`10` 和 `6`。

## 返回值与捕获

lambda 的最后一个表达式提供结果。也可以用 `return` 提前返回。需要结果时，将最后的表达式保留为表达式，省略其后的分号。

lambda 创建时会复制使用到的局部变量值：

```mcfpp
func main() {
    var bonus = 3
    var addBonus: (int) -> int = { value -> value + bonus }
    bonus = 9
    print(addBonus(2))
}
```

上例输出 `5`，因为 `addBonus` 保存了创建时的 `bonus = 3`。顶层变量通过对应的共享存储访问。普通 lambda 在调用时使用调用点的游戏执行上下文。

## 使用命名函数

```mcfpp
func doubleScore(value: int): int {
    return value * 2
}

func main() {
    var transform: (int) -> int = doubleScore
    print(transform(6))
}
```

函数值适合计分转换、列表处理和可复用回调。直接读写外部数据时，可以配合 [`tryRead`](../02base/06references)。
