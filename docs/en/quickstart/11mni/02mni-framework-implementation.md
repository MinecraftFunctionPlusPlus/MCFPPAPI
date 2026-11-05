---
lastUpdated: true
---

# Native MNI: parameters and results

`@MNIFunction` uses compiler value classes and result wrappers for native interfaces. See [MNI projects](./01mni-framework) and [macros](../mni-macros/overview) for the default macro entry and structured DSL.

## Write a native entry in Kotlin

`src/main/kotlin/example/mni/Arithmetic.kt`:

```kotlin
package example.mni

import top.mcfpp.annotations.MNIFunction
import top.mcfpp.core.lang.MCInt
import top.mcfpp.util.ValueWrapper

object Arithmetic {
    @JvmStatic
    @MNIFunction(normalParams = ["int", "int"], returnType = "int")
    fun add(left: MCInt, right: MCInt, result: ValueWrapper<MCInt>) {
        result.set(left.plus(right) as MCInt)
    }

    @JvmStatic
    @MNIFunction(readOnlyParams = ["int"], normalParams = ["int"], returnType = "int")
    fun addBonus(bonus: MCInt, score: MCInt, result: ValueWrapper<MCInt>) {
        result.set(score.plus(bonus) as MCInt)
    }
}
```

`src/main/mcfpp/main.mcfpp`:

```mcfpp
func add(left: int, right: int): int = example.mni.Arithmetic.add
func addBonus<bonus: int>(score: int): int = example.mni.Arithmetic.addBonus

func main() {
    external count: int = 2
    print(add(count, 3))
    print(addBonus<5>(count))
}
```

The expected results are `5` and `7`. `MCInt` can represent a known value or runtime data; `plus` requests MCFPP addition from the compiler.

## Align the signatures

| MCFPP | Kotlin annotation | Kotlin parameter |
| --- | --- | --- |
| `left: int, right: int` | `normalParams = ["int", "int"]` | `left: MCInt, right: MCInt` |
| `<bonus: int>` | `readOnlyParams = ["int"]` | `bonus: MCInt` |
| `: int` | `returnType = "int"` | `result: ValueWrapper<MCInt>` |

Wrapper ABI order is readonly parameters, ordinary parameters, optional receiver, then the non-void result wrapper. The Kotlin method returns Unit, emitted as JVM void. It supplies the MCFPP result through `result.set(...)`. Kotlin defaults do not become MCFPP default arguments.

| MCFPP | Host type |
| --- | --- |
| `int` | `top.mcfpp.core.lang.MCInt` |
| `float` | `top.mcfpp.core.lang.MCFloat` |
| `bool` | `top.mcfpp.core.lang.bool.ScoreBool` |
| `string` | `top.mcfpp.core.lang.nbt.MCString` |

An alternative entry accepts only `NativeCallContext`, which supplies arguments and publishes results. See the [MNIFunction API](/en/api/annotation/mnifunction).
