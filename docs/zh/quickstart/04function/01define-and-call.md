---
lastUpdated: true
---

# 定义与调用函数

`func` 声明函数。每个普通参数写出名称和类型，返回类型写在参数列表后的 `:` 右侧。

```mcfpp
func add(left: int, right: int): int {
    return left + right
}

func main() {
    var result = add(2, 3)
    print(result)
}
```

`add` 接收两个整数，返回它们的和。`main` 调用 `add(2, 3)`，然后打印 `5`。

## 返回结果

`return expression` 结束函数并返回一个值。有返回类型的函数，每条可达路径都应提供相应结果。

```mcfpp
func clamp(value: int): int {
    if value > 10 {
        return 10
    }
    return value
}

func main() {
    print(clamp(15))
}
```

省略返回类型时，函数返回 `void`。这类函数可以使用单独的 `return` 提前结束。

## 普通参数按值传递

```mcfpp
func increase(value: int): int {
    value += 1
    return value
}

func main() {
    var count = 2
    var next = increase(count)
    print(count)
    print(next)
}
```

输出依次为 `2` 和 `3`。需要更新游戏中的数据时，传递[地址引用](../02base/06references)。需要传递一段处理逻辑时，使用[函数值与 lambda](./05lambda)。

只读参数写在 `<...>` 中。它们适合[类型参数和编译时配置](../07generic/02generic_function)。
