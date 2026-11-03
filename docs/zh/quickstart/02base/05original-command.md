---
lastUpdated: true
---

# 原生命令与插值

在一行的开头写 `/`，可以直接插入 Minecraft 命令。生成的数据包使用命令正文。

```mcfpp
func main() {
    /say Hello from MCFPP
    /give @s minecraft:stone 1
}
```

每条原生命令占一行。命令中的引号、JSON 和 NBT 按 Minecraft 命令的内容书写。

## 将值放入命令

`${expression}` 将表达式的结果放到命令中。下面的例子将脚下的方块改成金块：

```mcfpp
func main() {
    const block = "minecraft:gold_block"
    /setblock ~ ~-1 ~ ${block}
}
```

已知值可以直接写入命令。运行时值的处理取决于目标版本和对应命令接口。需要类型检查和返回结果时，可以使用标准库函数。

## 通过函数复用命令

把固定命令放入普通函数，可以在多个位置重复调用：

```mcfpp
func announce() {
    /say Ready
}

func main() {
    announce()
}
```

需要用 Java 组合命令时，参阅 [MNI 命令生成](../09mni/05access)。

## 换行与除法

行首的单个 `/` 表示命令。将除法表达式分行时，把除号放在上一行：

```mcfpp
func main() {
    var count = 12 /
        3
    print(count)
}
```
