# 10 · 用 Kotlin 展开带回调的宏

两个 `func` 声明分别绑定 Kotlin `ShowcaseMacros` 的静态方法。`answer` 生成整数表达式；`repeatFold` 在编译时生成循环，将 MCFPP 回调内联到循环体。注解列出参数类型，Kotlin 签名中的 `Value` 与 `InlineFn` 指定参数的处理方式。

```mcfpp
func answer(): int = showcase.mni.ShowcaseMacros.answer
func repeatFold(times: int, initial: int, body: (int, int) -> int): int = showcase.mni.ShowcaseMacros.repeatFold

func main() {
    var total = repeatFold(4, 0) { accumulator, index -> accumulator + index }
    var value = answer()
    /scoreboard objectives add showcase_mni dummy
    /scoreboard players set #answer showcase_mni ${value}
    /scoreboard players set #total showcase_mni ${total}
    print(value)
    print(total)
}
```

## 动手验证

先同步 MNI 依赖，在 IDEA 中从 `repeatFold` 的绑定跳到 Kotlin 实现，查看 `whileLoop` 和 `inline`。执行生成的数据包得到 `42` 和 `6`（`0 + 1 + 2 + 3`）。Kotlin/JUnit 检查辅助方法，`verify.dps.json` 则运行数据包并检查两项计分板结果。

在示例仓库根目录执行完整验证，将两个 JAR 路径换成本机路径。

```sh
node tools/verify.mjs --example 10 --mode test --compiler /path/to/MCFPP-0.1.0.jar --dsb /path/to/datapack-sandbox-cli.jar
```

游戏入口为 `/function showcase.mni:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/10-kotlin-mni/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/10-kotlin-mni/src/test/kotlin/showcase/mni/ShowcaseMacrosTest.kt) · [ShowcaseMacros.kt](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/10-kotlin-mni/src/main/kotlin/showcase/mni/ShowcaseMacros.kt) · [verify.dps.json](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/10-kotlin-mni/verify.dps.json)
