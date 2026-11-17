# 03 · 用集合回调结算奖励

从 `main` 的 `[1, 2]` 跟踪元素。`filter` 只留下偶数 `2`，`map` 的回调捕获外层的 `multiplier`，得到 `[10]`。`fold` 以 `0` 为初值，把累积值和当前元素作为两个显式参数传给回调。

```mcfpp
func rewardTotal(values: list<int>): int {
    var multiplier = 5
    var rewards = values.filter { it % 2 == 0 }.map { it * multiplier }
    return rewards.fold(0) { total, value -> total + value }
}
```

## 字符串的编译期处理

`main` 的最后一行输出 `mcfpp`。源码中的 `const label = "  MCFPP  ".trim().lowercase()` 先去掉两端空白，再把 ASCII 大写字母转成小写。这两个方法要求输入在编译期已知。需要处理运行时字符串时，`length()`、`substring` 和相等比较也可用于动态值。

## 动手验证

运行 `filteredRewards` 应得到 `10`。与 `doubledTotal` 对照，后者把两个元素都翻倍再求和，得到 `6`。在测试里把 `rewardTotal` 的输入换成 `[1, 3]`，没有元素通过筛选，预期值应改为 `0`。

游戏入口为 `/function showcase.collections:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/03-functions-collections/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/03-functions-collections/src/test/mcfpp/collections_test.mcfpp)
