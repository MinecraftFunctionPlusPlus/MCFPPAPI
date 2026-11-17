# 09 · 在递归调用中观察局部变量

在 `var result = recurse(3)` 处设断点，从 `main` 旁启动 **Debug**。在 Watches 输入 `payload.values[1]`，应看到 `9`。单步进入 `recurse` 并切换调用帧，观察各层的 `depth` 和 `saved`，再单步跳出，回到 `main`。

```mcfpp
func main() {
    var count = 1
    count = increment(count)
    var payload = {values: [2, 9]} as Payload
    var decimal: float = 1.5
    decimal += 0.5
    var result = recurse(3)
    while (count < 4) { count += 1 }
    print(count)
    print(result)
    print(payload.values[1])
}
```

## 动手验证

继续运行后输出 `4`、`6`、`9`。另行运行测试时，`@BeforeEach` 写入初始分数，`@AfterEach` 清理它。预期两个测试通过、一个跳过。要练习失败定位，在本地暂时移除 `pendingFeature` 上的 `@Disabled` 后重新运行。

游戏入口为 `/function showcase.debugger:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/09-tests-debugger/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/09-tests-debugger/src/test/mcfpp/lifecycle_test.mcfpp)
