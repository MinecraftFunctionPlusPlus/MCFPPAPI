---
lastUpdated: true
---

# 嵌套数据模板

一个字段可以使用另一个数据模板作为类型。这样可以把相关数据放在一起。

```mcfpp
data Position {
    var x: int
    var z: int

    constructor(x: int, z: int) {
        this.x = x
        this.z = z
    }
}

data Checkpoint {
    var name: string
    var position: Position

    constructor(name: string, position: Position) {
        this.name = name
        this.position = position
    }
}

func main() {
    var checkpoint = Checkpoint("Spawn", Position(10, 20))
    print(checkpoint.position.x)
}
```

`Checkpoint` 将名称与位置组成一个值。`checkpoint.position.x` 先访问 `position`，再访问 `x`。

构造函数接收明确类型的字段值。字段声明使用 `var name: Type`。嵌套对象通过普通构造调用创建。

需要多处复用结构时，给它声明一个名字。匿名结构也使用 `data { ... }` 类型语法和相同的字段声明规则。
