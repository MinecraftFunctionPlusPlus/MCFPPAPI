---
lastUpdated: true
---

# 通过函数更新数据

普通参数接收值的副本。函数通过返回值交给调用者一个新值：

```mcfpp
func increase(value: int): int {
    return value + 1
}

func main() {
    var count = 2
    count = increase(count)
    print(count)
}
```

这段代码打印 `3`。调用者明确写出 `count = ...`，可以直接看到数据何时改变。

需要更新 Minecraft 中的计分项或 NBT 时，使用 [`ScoreRef` 和 `NBTRef<T>`](../02base/06references)。
