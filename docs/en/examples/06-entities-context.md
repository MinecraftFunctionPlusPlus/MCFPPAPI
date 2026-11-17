# 06 · Change one of two display entities

`StoneMarker` is a `BlockDisplay` entity template. Its `initialCount` supplies the initial `entity var count` for each summon. Each call returns its own `EntityRef<StoneMarker>`. The second summon also overrides the displayed block.

```mcfpp
/// 模板默认值、构造函数和 summon 生成类型化的实体引用。
func spawnFromTemplate() {
    cleanup()
    var template = StoneMarker({})
    template.initialCount = 20
    var first = template.summon()
    var second = template.summon({block_state: {Name: "minecraft:granite"}})
    consumeAndReport(first, second)
}
```

## Try it

`consumeAndReport` calls `consume()` only on `first`, so `main` prints `19` and `20`. `forEachAt` then visits the entities tagged `showcase_marker` and tags `@s` with `showcase_visited` in each execution context. The test checks the two counts and finds two visited entities.

The in-game entry point is `/function showcase.entities:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/06-entities-context/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/06-entities-context/src/test/mcfpp/entities_test.mcfpp)
