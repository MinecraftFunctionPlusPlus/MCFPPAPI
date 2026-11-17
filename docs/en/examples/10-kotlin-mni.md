# 10 · Expand a callback macro with Kotlin

The two `func` declarations bind static methods on Kotlin’s `ShowcaseMacros`. `answer` emits an integer expression. `repeatFold` generates a loop at compile time and inlines the MCFPP callback into its body. The annotation lists the parameter types. The `Value` and `InlineFn` wrappers in the Kotlin signature determine how each argument is handled.

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

## Try it

Sync the MNI dependencies and navigate from the `repeatFold` binding to its Kotlin implementation. Find `whileLoop` and `inline`. The generated pack prints `42` and `6` (`0 + 1 + 2 + 3`). Kotlin/JUnit checks the helper, while `verify.dps.json` runs the pack and checks both scoreboard results.

From the example repository root, run both checks with the paths to your local JARs.

```sh
node tools/verify.mjs --example 10 --mode test --compiler /path/to/MCFPP-0.1.0.jar --dsb /path/to/datapack-sandbox-cli.jar
```

The in-game entry point is `/function showcase.mni:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/10-kotlin-mni/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/10-kotlin-mni/src/test/kotlin/showcase/mni/ShowcaseMacrosTest.kt) · [ShowcaseMacros.kt](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/10-kotlin-mni/src/main/kotlin/showcase/mni/ShowcaseMacros.kt) · [verify.dps.json](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/10-kotlin-mni/verify.dps.json)
