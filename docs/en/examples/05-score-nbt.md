# 05 · Copy an NBT address

`current` initially points to `first`. `saved` copies that address. Reassigning `current` points it at `second`, while `saved.set(21)` still writes to `first`. Earlier in the file, `increment` reads and writes a scoreboard address.

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

## Try it

`addressCopiesKeepTheirTarget` checks a score of `11`, `first` equal to `21`, and `second` still equal to `99`. Reading the missing path skips the `tryRead` callback and returns `false`. An existing path holding zero still calls the callback.

The in-game entry point is `/function showcase.references:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/05-score-nbt/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/05-score-nbt/src/test/mcfpp/references_test.mcfpp)
