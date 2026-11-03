---
lastUpdated: true
---

# 只读列表、NBT 数组与范围

## 通过只读视图访问列表

`ImmutableList<T>` 提供读取、查找和遍历操作。它适合声明只需要读取列表的函数参数。

```mcfpp
func first(values: ImmutableList<int>): int {
    return values[0]
}

func main() {
    var source = [2, 4, 6]
    var view = source as ImmutableList<int>
    print(first(view))
    print(view.contains(4))
}
```

`as` 创建共享存储的只读视图。`source` 仍然可以修改列表，`view` 会读到这些变化。只读约束作用于列表本身，元素若为可变对象，仍有各自的修改规则。

## 使用 Minecraft NBT 数组

NBT 数组保存固定的整数种类，使用 `B`、`I` 或 `L` 标记。

```mcfpp
func main() {
    var bytes = [B; 1b, 2b, 3b]
    var numbers = [I; 10, 20, 30]
    var longs = [L; 1L, 2L, 3L]
    print(bytes)
    print(numbers)
    print(longs)
}
```

对应类型为 `ByteArray`、`IntArray` 和 `LongArray`。游戏数据要求这些 NBT 类型时，使用相应数组字面量。通用的可变序列使用 `list<T>`。

## 遍历整数范围

```mcfpp
func main() {
    for (index: 1..3) {
        print(index)
    }
}
```

范围包含两端。这个循环依次输出 `1`、`2` 和 `3`。边界也可以使用整数变量。循环开始时确定边界，之后按范围推进。循环体内的 `index` 是当前迭代值。
