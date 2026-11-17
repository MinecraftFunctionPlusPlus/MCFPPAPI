---
lastUpdated: true
---

# 可选字段与联合类型


## 安全访问与缺省值

`var amount: int?` 允许对象省略 `amount` 字段。下面的函数先用 `?.` 访问可能缺失的奖励，再用 `?:` 在没有金额时返回 7。

```mcfpp
data Reward { var amount: int? }
data Player { var reward: Reward? }

func points(player: Player): int {
    return player.reward?.amount ?: 7
}

func main() {
    var missing: Player = {}
    var zero: Player = { reward: { amount: 0 } }
    print(points(missing))
    print(points(zero))
}
```

两个调用分别输出 `7` 和 `0`。`?:` 仅在左侧缺失时才计算右侧；`0`、`false` 和空字符串都是已存在的值。缺失的接收者还会跳过 `?.` 方法的实参求值。需要提前退出时可用 `value ?: return`。后缀 `!!` 直接读取，调用者须保证字段存在。

## 联合类型

`(int | string)` 表示字段可以保存所列类型之一：

```mcfpp
data DisplayValue {
    var value: (int | string) = 0
}

func main() {
    var numeric = DisplayValue()
    numeric.value = 10
    var named = DisplayValue()
    named.value = "Ready"
}
```

两次赋值都满足联合类型。通过联合类型读取时，只能直接使用各分支共有的成员。`as` 重新解释底层数据；无法证明表示兼容时编译器会给出警告。

需要给已有类型另一个名字时，使用 `typealias int as Score`。类型别名与联合类型分别解决命名和多种值类型的问题。
