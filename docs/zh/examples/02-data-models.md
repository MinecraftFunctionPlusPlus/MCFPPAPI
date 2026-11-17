# 02 · 给坐标加上名字

`Position` 声明 `x`、`y`，`Named` 声明 `name`。`Marker` 的工厂一次返回三个父字段和自己的 `active`。`{ x, y, name }` 中的每个简写都读取同名局部变量。`total()` 在实例上执行，可以用 `this` 读坐标。

```mcfpp
data Marker: Position, Named {
    var active: bool
    new(x: int, y: int, name: string) {
        return { x, y, name, active: true }
    }
    func total(): int { return this.x + this.y }
}
```

## 动手验证

`Marker.new(3, 4, "spawn")` 同时可以传给只要求 `{ name: string }` 的 `label`，也可以把坐标之和存入 `Box<int>`。`main` 依次打印 `spawn`、`7`、`7`、`0`。最后两次调用比较省略 `amount` 和明确传入 `0` 时 `?: 7` 的结果。

游戏入口为 `/function showcase.models:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/02-data-models/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/02-data-models/src/test/mcfpp/models_test.mcfpp)
