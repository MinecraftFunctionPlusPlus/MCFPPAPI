# 02 · Give a position a name

`Position` supplies `x` and `y`, and `Named` supplies `name`. The `Marker` factory returns all three fields together with its own `active` field. Each shorthand key reads the local variable of the same name. The instance method `total()` can read coordinates through `this`.

```mcfpp
data Marker: Position, Named {
    var active: bool
    new(x: int, y: int, name: string) {
        return { x, y, name, active: true }
    }
    func total(): int { return this.x + this.y }
}
```

## Try it

`Marker.new(3, 4, "spawn")` satisfies `label`’s `{ name: string }` parameter. The sum of its coordinates goes into a `Box<int>`. `main` prints `spawn`, `7`, `7`, `0`. The last two calls show how `?: 7` handles an omitted `amount` and an explicit zero.

The in-game entry point is `/function showcase.models:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/02-data-models/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/02-data-models/src/test/mcfpp/models_test.mcfpp)
