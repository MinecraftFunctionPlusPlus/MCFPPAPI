---
lastUpdated: true
---

# 嵌套数据模板

一个字段可以使用另一个数据模板作为类型。这样可以把相关数据放在一起。

```mcfpp
data Position {
    var x: int
    var z: int

    new(x: int, z: int) {
        return { x, z }
    }
}

data Checkpoint {
    var name: string
    var position: Position

    new(name: string, position: Position) {
        return { name, position }
    }
}

func main() {
    var checkpoint = Checkpoint("Spawn", Position(10, 20))
    print(checkpoint.position.x)
}
```

`Checkpoint` 将名称与位置组成一个值。`checkpoint.position.x` 先访问 `position`，再访问 `x`。

内层 `Position(10, 20)` 先产生完整的位置值，外层工厂将它与名称一起返回。

如果函数只读取横坐标，参数可以写作 `p: { x: int }`。`Position` 同时有 `x` 和 `z`，因此可以直接传入。
