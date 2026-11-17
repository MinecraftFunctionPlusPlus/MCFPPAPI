# 03 · Calculate rewards with collection callbacks

Start with `[1, 2]` in `main`. The filter keeps the even number `2`. The mapping callback captures `multiplier` from the enclosing function and produces `[10]`. The fold starts at `0` and passes the running total and the next element to its two-parameter callback.

```mcfpp
func rewardTotal(values: list<int>): int {
    var multiplier = 5
    var rewards = values.filter { it % 2 == 0 }.map { it * multiplier }
    return rewards.fold(0) { total, value -> total + value }
}
```

## Working with a known string

The last line printed by `main` is `mcfpp`. In `const label = "  MCFPP  ".trim().lowercase()`, the first call trims the spaces and the second lowercases ASCII letters. Both operations require compile-time input. For runtime strings, operations such as `length()`, `substring` and equality also accept dynamic values.

## Try it

Run `filteredRewards` to check the total of `10`. Compare it with `doubledTotal`, which doubles both elements and sums them to `6`. Try `[1, 3]` as the reward input. The filter leaves no elements, so the expected result becomes the initial accumulator, `0`.

The in-game entry point is `/function showcase.collections:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/03-functions-collections/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/03-functions-collections/src/test/mcfpp/collections_test.mcfpp)
