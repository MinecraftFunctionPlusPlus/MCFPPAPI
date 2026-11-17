# 01 · Ranges, recursion and floats

Predict `sumTo(5)` before running it. The range includes both endpoints, so the loop adds 1 through 5. `factorial` takes a different route to its result. Each recursive call keeps its argument until the call below it returns.

```mcfpp
func sumTo(limit: int): int {
    var total = 0
    for (value : 1..limit) {
        total += value
    }
    return total
}
```

## Try it

Run `main` to see `sum=15`, `factorial=120` and `2.5`. The last line comes from `half(5.0)` in the 26.3 branch. Compare `award(10)` and `award(10, 7)` in the test. Omitting the second argument uses the default bonus of 5.

The in-game entry point is `/function showcase.basics:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/01-language-basics/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/01-language-basics/src/test/mcfpp/basics_test.mcfpp)
