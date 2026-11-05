---
lastUpdated: true
---

# Diagnostics, helpers, and resources

`MacroContext` supplies type lookup, diagnostics, helpers, and resources for one expansion. This example creates a helper returning `10`, adds the input bonus, and stores the result in an allocated objective:

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object RewardMacros {
    @JvmStatic
    @MNIMacro(normalParams = ["int"], returnType = "int")
    fun recordReward(context: MacroContext, bonus: Value<IntT>): Expr<IntT> {
        val signature = FunctionSignature.of(emptyList(), context.types().intType())
        val base = context.helpers().define("baseReward", signature) { code, _ ->
            code.kotlin { yield(literal(10)) }
        }
        val objective = context.resources().reserve(
            ResourceKind.OBJECTIVE, "reward",
            ResourceData.of(ConstantValue.record(
                mapOf("criteria" to ConstantValue.text("dummy"))
            ))
        )
        return context.quote.expression(context.types().intType()) {
            val saved = score(ScoreHolder.named("#reward"), objective.name())
            saved.value = call(base) + bonus.value
            yield(saved.value)
        }
    }
}
```

Place it in `src/main/kotlin/example/macros/RewardMacros.kt`, then add the source declaration:

```mcfpp
func recordReward(bonus: int): int = example.macros.RewardMacros.recordReward
```

The expected result of `print(recordReward(5))` is `15`.

## Diagnostics

```kotlin
if (step < 0) {
    context.diagnostics().error(context.callSite(), "Amount must be zero or greater.")
}
```

Here `step` is obtained from `amount.intValue()` in the parameter example. `callSite()` identifies the source call. `error` fails the expansion; `warning` emits a message. Code, helpers, declarations, and resources commit together on success and roll back on failure.

## Helpers and ordinary functions

`helpers().define(hint, signature) { code, parameters -> ... }` constructs a helper immediately and returns `FunctionRef<R>`. Enter the receiver DSL with `code.kotlin { ... }`. Helpers receive inputs through their own VALUE/REF parameters and cannot capture enclosing locals or executor handles.

`types().function(name, argumentTypes)` selects an accessible ordinary overload. `call` constructs an expression; `callVoid` appends a void call. Ignoring the result of `call` does not execute it. Use `evaluate(call(...))` for a standalone expression call.

## Resource descriptors

| Kind | Descriptor fields |
| --- | --- |
| `OBJECTIVE` | `criteria`, for example `"dummy"` |
| `STORAGE` | `initial`, initial structured data |

Construct closed data with `ConstantValue.record`, `text`, `integral`, `bool`, and `sequence`, then pass it to `ResourceData.of(...)`. `reserve` returns a compiler-allocated name and handle. Continue with [template processors](./declarations).
