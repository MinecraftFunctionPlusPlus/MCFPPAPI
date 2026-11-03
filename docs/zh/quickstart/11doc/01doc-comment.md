---
lastUpdated: true
---

# 文档注释

在声明前使用连续的 `///` 行书写 Markdown。IDEA 文档提示可以显示这些说明。

```mcfpp
/// # Reward calculation
/// Adds the configured bonus to a score.
///
/// - Input: the current score.
/// - Result: the score plus five.
func addBonus(score: int): int {
    return score + 5
}

func main() {
    print(addBonus(10))
}
```

`///` 后的一个空格用于分隔，之后的缩进和 Markdown 标记保留。可以使用标题、列表、粗体和行内代码。

为函数说明参数单位、边界和返回结果。为模板说明字段含义。为 MNI 函数说明 Java 在编译时执行，以及它生成的游戏行为。

使用普通 `//` 注释解释某条实现语句。使用 `///` 说明对调用者有用的接口。
