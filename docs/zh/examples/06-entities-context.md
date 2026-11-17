# 06 · 分别修改两个展示实体

`StoneMarker` 是 `BlockDisplay` 实体模板。模板的 `initialCount` 决定每个新实体的 `entity var count` 初值。两次 `summon` 各得到一个 `EntityRef<StoneMarker>`；第二次还覆盖方块外观。

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

## 动手验证

`consumeAndReport` 只对 `first` 调用 `consume()`，因此 `main` 打印 `19`、`20`。随后 `forEachAt` 遍历带 `showcase_marker` 标签的实体，在各自的执行上下文里给 `@s` 添加 `showcase_visited`。测试分别检查两个计数以及两个已访问实体。

游戏入口为 `/function showcase.entities:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/06-entities-context/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/06-entities-context/src/test/mcfpp/entities_test.mcfpp)
