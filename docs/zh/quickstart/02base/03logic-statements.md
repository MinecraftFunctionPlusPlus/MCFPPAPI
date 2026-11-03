---
lastUpdated: true
---

# 条件与循环

## if 与 else

`if` 根据 `bool` 条件选择代码块。条件可以使用括号，也可以直接写在 `if` 后。

```mcfpp
func classify(score: int) {
    if score >= 10 {
        print("Gold")
    } else if score >= 5 {
        print("Silver")
    } else {
        print("Bronze")
    }
}

func main() {
    external score: int = 7
    classify(score)
}
```

比较运算包括 `==`、`!=`、`<`、`<=`、`>` 和 `>=`。使用 `&&`、`||`、`!` 组合布尔条件。

## while 与 do while

`while` 在执行循环体前检查条件。`do while` 先执行一次循环体，再检查条件。

```mcfpp
func main() {
    external count: int = 0
    while count < 3 {
        print(count)
        count += 1
    }

    do {
        count -= 1
    } while count > 0
}
```

使用 `break` 结束循环，使用 `continue` 开始下一轮。计数更新使用 `+=` 或 `-=`。

## 遍历列表

```mcfpp
func main() {
    var rewards: list<int> = [10, 20, 30]
    for (reward: rewards) {
        print(reward)
    }
}
```

循环变量接收当前元素。更多列表操作见[列表](../05nbt/02list)。
