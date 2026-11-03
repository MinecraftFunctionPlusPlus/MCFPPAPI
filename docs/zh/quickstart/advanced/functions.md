---
lastUpdated: true
---

# 扩展函数与默认参数

## 为已有类型增加函数

扩展函数的语法把接收者类型写在函数名前面：

下面展示扩展函数语法。当前 CLI 中，整数扩展函数的 `this` 绑定仍待完善。

```text
func int.withBonus(bonus: int): int {
    return this + bonus
}

func main() {
    var score = 20
    print(score.withBonus(5))
    print(score)
}
```

需要同样计算时，下面的普通函数可以完成构建：

```mcfpp
func withBonus(score: int, bonus: int): int {
    return score + bonus
}

func main() {
    var score = 20
    print(withBonus(score, 5))
    print(score)
}
```

这里返回计算后的值，原变量仍为 `20`。跨文件复用函数时，按普通函数的方式导入所属命名空间。

## 给参数设置默认值

```mcfpp
func reward(base: int, bonus: int = 5): int {
    return base + bonus
}

func main() {
    print(reward(10))
    print(reward(10, 20))
}
```

第一处调用使用默认值，输出 `15`。第二处显式传入 `bonus`，输出 `30`。把需要默认值的参数放在参数表末尾，调用时按位置传参。

需要让一个函数接收另一段逻辑时，使用 [Lambda 和函数类型](../04function/05lambda)。
