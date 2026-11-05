---
lastUpdated: true
---

# Macro callbacks: implement a repeat loop

Use the Kotlin receiver DSL to insert a source lambda into a runtime loop. Create `src/main/kotlin/example/macros/RepeatMacros.kt`:

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object RepeatMacros {
    @JvmStatic
    @MNIMacro(normalParams = [
        "int",
        "(int)->void"
    ], returnType = "void")
    fun repeat(context: MacroContext, times: Value<IntT>, body: InlineFn<VoidT>): Block =
        context.quote.block {
            val index = local("index", literal(0))
            val limit = local("limit", times.value)
            whileLoop({ index.value lt limit.value }) {
                inlineVoid(body, index.value)
                index += 1
            }
        }
}
```

Declare the macro before calling it:

```mcfpp
func repeat(times: int, body: (int)->void): void = example.macros.RepeatMacros.repeat

func main() {
    repeat(3) { index ->
        if (index == 1) { return; }
        print(index)
    }
    print("Finished")
}
```

The expected output is `0`, `2`, then `Finished`.

## When conditions and callbacks execute

The two Kotlin callbacks in `whileLoop({ index.value lt limit.value }) { ... }` each run once to construct the condition and body. The generated condition is evaluated again before every runtime iteration.

`inlineVoid(body, index.value)` inserts the user's callback and passes the index by VALUE. A callback `return` exits only that insertion region. The following `index += 1` still runs. `break` and `continue` cannot cross callback boundaries.

## Captures and callback results

Free locals are captured by value when the lambda is created and remain readonly. Global declarations are accessed using their current values. Return the next accumulator explicitly:

```mcfpp
// This overload uses the complete example provider linked below.
func repeat(times: int, initial: int, body: (int,int)->int): int = example.mnirepeat.KotlinRepeatMacro.repeatFold

func main() {
    var total = repeat(3, 0) { sum, index -> sum + index }
    print(total)
}
```

The result is `3`. This overload takes `InlineFn<IntT>` with signature `(int,int)->int`. The macro obtains the result with `inline<IntT>(body, total.value, index.value)` and assigns it to the accumulator.

A tail expression supplies the result. A trailing semicolon discards it; void targets discard tail values. INLINE accepts static lambdas or ordinary source function references. Dynamic function values, native targets, and macro targets cannot supply inline source bodies.

The complete implementation is `examples/mni/repeat/provider/kotlin/example/mnirepeat/KotlinRepeatMacro.kt` in the compiler repository. For ordinary collections, see [fold and foreach](../advanced/collections).
