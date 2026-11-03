---
lastUpdated: true
---

# 数值转换与类型视图

数值转换用于改变数值的表示方式。例如，把带小数的速度转换为整数，或把整数保存为一个 NBT 字节。

## 用函数转换数值

`toInt`、`toFloat`、`toByte`、`toShort`、`toLong` 和 `toDouble` 接收数值，返回指定类型。

```mcfpp
func main() {
    var speed = 3.75
    var whole = toInt(speed)
    var fraction = toFloat(whole)
    print(whole)
    print(fraction)
    print(toByte(128))
    print(toShort(65535))
}
```

结果依次为 `3`、`3.0`、`-128` 和 `-1`。浮点数转换为整数时向零取整。转换为 `byte` 或 `short` 时，超出的高位会被截去，结果按有符号整数解释。

`long`、`double` 与运行时浮点数之间的转换使用 Minecraft 26.3 的数值功能。为使用这些转换的工程设置 `version = "26.3"`。

## 用 as 创建类型视图

`as` 让编译器用指定类型访问同一份存储。它适合联合类型、`any` 和容器视图。改变数值类型时使用上面的转换函数。

下面的 `view` 与 `source` 指向同一列表。通过 `view` 写入的值也能从 `source` 读到。

```mcfpp
func main() {
    var source = [1, 2, 3]
    var view = source as list<int>
    view[0] = 9
    print(source[0])
}
```

普通赋值遵循值复制规则。比较下面的 `copy`：

```mcfpp
func main() {
    var source = [1, 2, 3]
    var copy = source
    copy[0] = 9
    print(source[0])
}
```

这里输出 `1`。`as` 用于访问已经确定的实际类型。编译器根据这个类型继续生成代码，运行时的类型判断需要由程序明确完成。

## 转为 NBT

`toNBT(value)` 把数值、布尔值、字符串、NBT 数组或数据模板对象转换为 NBT 值。需要直接读写游戏数据时，继续阅读 [NBTRef](../02base/06references)。
