---
lastUpdated: true
---

# 字段继承与结构类型

`Marker: Position, Named` 合并两个父模板的字段。`Marker` 的值直接包含 `x`、`y`、`name` 和本地的 `active`，访问时不用先取一个父对象。

```mcfpp
data Position { var x: int; var y: int }
data Named { var name: string }
data Marker: Position, Named {
    var active: bool
    new(x: int, y: int, name: string) {
        return { x, y, name, active: true }
    }
}

func label(value: { name: string }): string { return value.name }

func main() {
    var marker = Marker.new(3, 4, "spawn")
    print(label(marker))
}
```

`label` 只读取 `name`，所以任何具有类型为 `string` 的 `name` 字段的值都可以传入；这个例子打印 `spawn`。这也适用于赋值和返回值。

## 如何组合父模板

类型位置的 `(Position & Named)` 要求同时具备两个模板的字段。若多个父模板声明同名字段，同一个值必须满足各自的类型要求。必需字段同时要求 `int` 和 `string` 时，交叉为 `never`，无法构造满足条件的对象。

子工厂负责返回包括父字段在内的完整值。要复用父工厂，先调用 `Parent.new(...)`，再用结果中的字段组装子值。普通 `data` 的继承组合字段。旧代码依赖 `override` 或 `super` 的虚分派时，把共享行为写成接收相应结构的函数，例如上面的 `label`。实体模板的召唤与构造示例见[工程 06](/zh/examples/06-entities-context)。
