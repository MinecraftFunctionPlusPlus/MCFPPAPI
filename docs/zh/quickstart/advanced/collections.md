---
lastUpdated: true
---

# 用回调处理集合

列表提供 `map`、`filter`、`fold` 和 `foreach`。它们接收函数或 Lambda，适合处理奖励表、价格和分数。

| 方法 | 回调得到的参数 | 结果 |
| --- | --- | --- |
| `map` | 当前元素 | 用回调结果组成的新列表 |
| `filter` | 当前元素 | 保留回调返回 `true` 的元素 |
| `fold(initial)` | 累计值、当前元素 | 最终累计值 |
| `foreach` | 当前元素 | 依次执行回调 |

## 计算奖励

```mcfpp
func main() {
    var scores = [1, 2, 3, 4]
    var bonus = 10
    var rewards = scores.map { it + bonus }
    var eligible = scores.filter { it >= 3 }
    var total = scores.fold(0) { sum, score -> sum + score }
    print(rewards)
    print(eligible)
    print(total)
}
```

`rewards` 为 `[11, 12, 13, 14]`，`eligible` 为 `[3, 4]`，`total` 为 `10`。只有一个参数时，可以用 `it` 表示当前元素。也可以写出参数名称。

## 复用已有函数

```mcfpp
func doubled(value: int): int {
    return value * 2
}

func main() {
    var prices = [5, 10, 15]
    var saleValues = prices.map(doubled)
    print(saleValues)
}
```

`map` 的结果类型由回调决定。例如，`scores.map { it > 2 }` 得到 `list<bool>`。

## 跳过本次回调

```mcfpp
func main() {
    var values = [1, 2, 3]
    values.foreach {
        if (it == 2) {
            return
        }
        print(it)
    }
    print("Finished")
}
```

该示例依次输出 `1`、`3` 和 `Finished`。回调中的 `return` 结束当前这次回调，之后继续处理其他元素。

`fold` 按列表顺序处理元素。空列表的结果就是传入的初始值。回调可以读取外部变量，读取的是创建回调时捕获的值。函数类型和尾随 Lambda 的写法见 [Lambda](../04function/05lambda)。

## 取出匹配元素并汇总

```mcfpp
func main() {
    var values = [1, 2, 3, 4]
    var rewards = values.filter { it % 2 == 0 }.sumOf { it * 5 }
    var next = values.firstOrElse({ it > 10 }, { 0 })
    print(rewards)
    print(next)
}
```

`sumOf` 把回调的数值结果相加，这里得到 `30`。`firstOrElse` 找到首个满足条件的值便停止，全部不匹配时才执行后备回调，得到 `0`。需要索引时用 `mapIndexed { index, value -> ... }`；将每个元素映射到子列表后再拼接用 `flatMap`。
