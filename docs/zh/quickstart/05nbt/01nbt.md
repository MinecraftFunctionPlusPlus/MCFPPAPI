---
lastUpdated: true
---

# NBT 数据

NBT 是 Minecraft 保存数据的树状格式。复合数据包含有名字的键，列表包含有顺序的元素。MCFPP 根据字面量推断字典、列表和数组等具体类型。

```mcfpp
func main() {
    var position = {x: 5, z: 8}
    var rewards = [10, 20, 30]

    print(position["x"])
    print(rewards[0])
}
```

使用字符串索引读取复合数据，使用整数索引读取列表。MCFPP 复合字面量中的键写作标识符，例如 `title: "Round one"`。

整数数组采用 SNBT 写法：

```mcfpp
func main() {
    var values = [I; 1, 2, 3]
    print(values)
}
```

编译器知道数据布局时，会检查字段和索引。读取外部 storage、实体或方块的数据时，使用 [`NBTRef<T>.tryRead`](../02base/06references) 处理数据存在性。

字段固定时，使用[数据模板](../06template/01define)描述结构。元素类型固定时，使用[列表](./02list)或[字典](./03dict)。
