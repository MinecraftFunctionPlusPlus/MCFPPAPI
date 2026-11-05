---
lastUpdated: true
---

# Macro inputs: values, constants, and addresses

Continue with the [macro project](./overview). Use `Value<T>` for ordinary inputs and `Const<T>` for inputs known during compilation.

## VALUE and CONST

Create `src/main/kotlin/example/macros/ConstantMacros.kt`:

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object ConstantMacros {
    @JvmStatic
    @MNIMacro(normalParams = [
        "int",
        "int"
    ], returnType = "int")
    fun addConstant(context: MacroContext, value: Value<IntT>, amount: Const<IntT>): Expr<IntT> {
        val step = amount.intValue()
        return context.quote.expression(context.types().intType()) {
            val result = local("result", value.value)
            result += step
            yield(result.value)
        }
    }
}
```

Declare the macro in MCFPP:

```mcfpp
func addConstant(value: int, amount: int): int = example.macros.ConstantMacros.addConstant
```

`addConstant(score, 5)` returns `score + 5` at runtime. Both arguments use parentheses. Source readonly parameters use angle brackets and are a separate feature. `normalParams` lists types; `Value` and `Const` determine the modes.

- `VALUE`: the caller evaluates arguments once, in source order. Repeated `value.value` reads use the same stable result. Argument side effects execute even when the macro ignores the input.
- `CONST`: `amount.intValue()` returns a Kotlin `Int` during compilation. Dynamic inputs are rejected before invoking the macro.
- `Local<T>`: `local("result", expression)` infers the type from its initializer. `.value` accesses the generated variable; `+=` constructs an update.

Kotlin `step + 1` computes a host integer immediately. DSL `value.value + 1` constructs runtime code. See the [Kotlin DSL API](/en/api/kotlin-dsl).

## `Ref<T>` and public addresses

| Type | Contents | Access |
| --- | --- | --- |
| `Ref<IntT>` / `Local<IntT>` | A writable integer location issued by the compiler | DSL `.value`, `assign`, and `+=` |
| `Value<ScoreRefT>` | An address descriptor for MCFPP `ScoreRef` | Forward it to source code using `tryRead` / `set` |
| `Value<NBTRefT<IntT>>` | An address descriptor for MCFPP `NBTRef<int>` | Use source reference operations to access NBT |

For `health: Value<ScoreRefT>`, `health.value` has type `Expr<ScoreRefT>` and contains the address descriptor. Reading its target requires `tryRead`. Calling `set` on a captured reference updates the game target; the captured descriptor remains readonly.

Construct references from explicit Minecraft addresses. The removed `ref local` syntax cannot take the address of an ordinary local variable.

## Forward a reference to an ordinary function

Use this page's imports and place this entry in `DamageMacros.kt` in the same package:

```kotlin
object DamageMacros {
    @JvmStatic
    @MNIMacro(normalParams = [
        "ScoreRef",
        "int"
    ], returnType = "void")
    fun damage(context: MacroContext, health: Value<ScoreRefT>, amount: Value<IntT>): Block {
        @Suppress("UNCHECKED_CAST")
        val target = context.types().function(
            "applyDamage", listOf(health.type(), amount.type())
        ) as FunctionRef<VoidT>
        return context.quote.block {
            callVoid(target, health.value, amount.value)
        }
    }
}
```

Provide the explicit macro declaration and the ordinary source helper:

```mcfpp
func damage(health: ScoreRef, amount: int): void = example.macros.DamageMacros.damage

func applyDamage(health: ScoreRef, amount: int) {
    health.tryRead { current ->
        if (current < amount) { health.set(0); }
        else { health.set(current - amount); }
    }
}

func main() {
    /scoreboard objectives add hp dummy
    /scoreboard players set #health hp 100
    damage(scoreRef("#health", "hp"), 30)
    var alias = scoreRef("#health", "hp")
    alias.tryRead { current -> damage(alias, current); }
}
```

The first call produces `70`. The second call, inside the callback, produces `0`. Factory calls can be macro arguments directly. Callback parameters and captured references can be passed to macros. `tryRead` invokes its callback synchronously only when reading the target succeeds.

An NBT entry uses `normalParams = ["NBTRef<int>", "int"]` and `Value<NBTRefT<IntT>>`. Its source helper accepts `NBTRef<int>`. The complete example binds and calls it as follows:

```mcfpp
func damageNbt(health: NBTRef<int>, amount: int): void = example.mnidamage.KotlinDamageMacro.damageNbt
func main() {
    damageNbt(nbtStorageRef<int>("example:health", "normal.hp"), 30)
}
```

The complete provider is `examples/mni/damage/provider/kotlin/example/mnidamage/KotlinDamageMacro.kt` in the compiler repository. Its caller projects are `examples/mni/damage` and `examples/mni/nbt-reference`. See [address references](../02base/06references).

## The four modes

| Mode | Kotlin parameter | Meaning |
| --- | --- | --- |
| `VALUE` | `Value<T>` | An evaluated value, including a public address descriptor |
| `CONST` | `Const<T>` | A proven closed constant |
| `REF` | `Ref<T>` | A compiler-issued writable location |
| `INLINE` | `InlineFn<S>` | A statically insertable source callback |

`REF` remains available for builder and helper locations. Public reference inputs use the default `VALUE` mode. Continue with [INLINE and loops](./callbacks).
