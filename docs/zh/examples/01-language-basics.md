# 01 · 范围、递归与浮点数

先预测 `sumTo(5)` 的结果。`1..limit` 包含右端点，循环把 1、2、3、4、5 依次加到局部变量。`factorial` 则把每一步留在自己的调用帧中，到参数为 1 时开始返回。

```mcfpp
func sumTo(limit: int): int {
    var total = 0
    for (value : 1..limit) {
        total += value
    }
    return total
}
```

## 动手验证

运行 `main`，依次看到 `sum=15`、`factorial=120`、`2.5`。最后一项来自 26.3 分支的 `half(5.0)`。再比较测试里的 `award(10)` 和 `award(10, 7)`，省略第二个参数时取默认值 5。

游戏入口为 `/function showcase.basics:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/01-language-basics/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/01-language-basics/src/test/mcfpp/basics_test.mcfpp)
