---
lastUpdated: true
---

# MNIMacro

`top.mcfpp.annotations.MNIMacro` describes a Kotlin/JVM entry that constructs code during compilation.

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object MathMacros {
    @JvmStatic
    @MNIMacro(normalParams = ["int"], returnType = "int")
    fun addOne(context: MacroContext, input: Value<IntT>): Expr<IntT> =
        context.quote.expression(context.types().intType()) {
            yield(input.value + 1)
        }
}
```

Each callable macro needs an MCFPP declaration, using the same explicit binding syntax as `@MNIFunction`:

```mcfpp
func addOne(input: int): int = example.macros.MathMacros.addOne
```

The MCFPP declaration supplies the public name, parameter names, and namespace. Declared types must match the annotation. `injectedBy` does not register macros automatically.

## Entry rules

- The provider and entry must be public, with a static JVM entry. Use `@JvmStatic` on object/companion methods. Bind top-level functions through their file facade class name.
- The first parameter is exactly `MacroContext`. `normalParams` lists the MCFPP types of subsequent parameters in order, excluding the context.
- JVM wrappers determine modes: `Value<T>` is VALUE, `Const<T>` is CONST, `Ref<T>` is REF, and `InlineFn<S>` is INLINE.
- Void macros return `Block`; other macros return `Expr<T>`. The compiler validates actual MCFPP types.
- Suspend functions, ordinary instance methods, and extra default-argument masks do not match this synchronous protocol. Kotlin defaults do not become MCFPP defaults.
- Overloads are distinguished by MCFPP name and argument types. Modes and return types do not distinguish overloads.

## Annotation fields

| Field | Default | Meaning |
| --- | --- | --- |
| `normalParams` | `[]` | Ordered types, such as `"int"`, `"ScoreRef"`, `"NBTRef<int>"`, or `"(int)->void"` |
| `returnType` | `"void"` | MCFPP result type |
| `identifier` | `""` | Optional; explicit bindings always use the MCFPP `func` declaration's name |

Macro declarations currently use parenthesized parameters, with no readonly generic parameters or argument defaults. `Const` parameters also use parentheses. Overloads use public names and parameter types; result types, modes, and wrappers do not distinguish overloads.

Public references use `Value<ScoreRefT>` or `Value<NBTRefT<IntT>>` with VALUE mode. See [macro setup](/en/quickstart/mni-macros/overview) and [parameters](/en/quickstart/mni-macros/parameters) for registration and reference forwarding.
