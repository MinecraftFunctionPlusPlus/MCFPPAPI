---
lastUpdated: true
---

# 可选字段与联合类型

## 可选字段

模板字段后的 `?` 表示初始化数据可以省略这个字段。

```mcfpp
data Reward {
    var amount: int = 10
    var note: string?
}

func main() {
    var reward = Reward()
    print(reward.amount)
}
```

上例保留 `amount`，省略 `note`。读取字段前，应先建立它已经初始化的条件。外部 NBT 路径可以用 [`NBTRef<T>.tryRead`](../02base/06references) 处理存在性。

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
    print(numeric.value as int)
    print(named.value as string)
}
```

编译器追踪已知字段的实际类型。`as` 选择当前使用的类型视图。使用它时，当前值应与指定类型相符。涉及外部数据时，应先确认数据布局。

需要给已有类型另一个名字时，使用 `typealias int as Score`。类型别名与联合类型分别解决命名和多种值类型的问题。
