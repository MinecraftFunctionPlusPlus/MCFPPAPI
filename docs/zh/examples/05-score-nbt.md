# 05 · 复制 NBT 地址

`current` 最初指向 `first`。`saved` 复制这个地址，随后给 `current` 重新赋值只会把 `current` 指向 `second`。因此 `saved.set(21)` 修改的是 `first`。前面的 `increment` 对计分板地址做了相似的读写。

```mcfpp
    var current = nbtStorageRef<int>("showcase:references", "first")
    const saved = current
    current = nbtStorageRef<int>("showcase:references", "second")
    saved.set(21)
    saved.tryRead { value -> print(value) }

    const absent = nbtStorageRef<int>("showcase:references", "missing")
    var present = absent.tryRead { value -> print(value) }
    if (!present) { print("missing is different from zero") }
```

## 动手验证

`addressCopiesKeepTheirTarget` 检查计分板为 `11`、`first` 为 `21`、`second` 仍为 `99`。读取缺失的 `missing` 时，`tryRead` 跳过回调并返回 `false`；已有路径即使存着 `0`，也会进入回调。

游戏入口为 `/function showcase.references:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/05-score-nbt/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/05-score-nbt/src/test/mcfpp/references_test.mcfpp)
