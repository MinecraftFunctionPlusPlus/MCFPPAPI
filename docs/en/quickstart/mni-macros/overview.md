---
lastUpdated: true
---

# MNI macros: generate code with Kotlin

An MNI macro runs Kotlin during compilation and constructs typed code for the MCFPP/Minecraft runtime. APIs, the DSL, examples, and project templates prioritize Kotlin. Java can call the emitted JVM methods.

## Create a project

Use JDK 21:

```sh
mcfpp init hello-mni --mni
cd hello-mni
mcfpp build
mcfpp test
```

Write providers in `src/main/kotlin` and JUnit tests in `src/test/kotlin`. See [MNI projects](../11mni/01mni-framework) for the generated files and default `answer()` macro.

## Implement an add-one macro

Create `src/main/kotlin/example/macros/ScoreMacros.kt`:

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object ScoreMacros {
    @JvmStatic
    @MNIMacro(
        normalParams = ["int"],
        returnType = "int"
    )
    fun addOne(context: MacroContext, value: Value<IntT>): Expr<IntT> =
        context.quote.expression(context.types().intType()) {
            yield(value.value + 1)
        }
}
```

| Type or expression | Meaning |
| --- | --- |
| `MacroContext` | Code, type, diagnostic, and resource services for this expansion |
| `IntT` | A host type marker for MCFPP integers |
| `Value<IntT>` | An integer argument evaluated and bound once by the caller |
| `Expr<IntT>` | Code that produces an integer when executed |
| `yield(...)` | Supply the current expression region's result |

`value.value` and `+ 1` are DSL operations inside `CodeScope`. Kotlin constructs the addition during the build. The game reads the input and computes the result later. See the [Kotlin DSL API](/en/api/kotlin-dsl).

## Declare the macro

Declare the macro explicitly in MCFPP, using the same syntax as a native MNI function:

```mcfpp
func addOne(value: int): int = example.macros.ScoreMacros.addOne
```

The CLI automatically loads its provider output. Load standalone JARs through `jars` in `mcfpp.toml`. `@MNIMacro` describes the JVM implementation. Each callable macro needs a source declaration; `injectedBy` does not expose macros automatically.

```mcfpp
func main() {
    external score: int = 10
    print(addOne(score))
}
```

The expected output is `11`. The MCFPP declaration supplies the public name, parameter names, and namespace. Different names can bind the same JVM method. Parameter and return types must match the annotation; JVM wrappers determine parameter modes.

## Entry and construction phase

The entry must be a public static JVM method whose first parameter is `MacroContext`. Use `@JvmStatic` on object and companion members. Top-level functions are already static; `@file:JvmName("ScoreMacros")` can fix the class name used in bindings.

A void macro returns `Block`. Other macros return `Expr<T>`, with `yield` on every reachable normal exit. DSL callbacks run once during construction. Builders and handles belong to the current expansion and their lexical scopes.

Kotlin `if` and `for` control construction. DSL `ifThen` and `whileLoop` construct runtime control flow.

## Reading order

1. [Parameters and expressions](./parameters): values, constants, locations, and public addresses.
2. [Loops and callbacks](./callbacks): INLINE, accumulators, and local return.
3. [Entities, positions, and scores](./minecraft): Minecraft execution contexts.
4. [Diagnostics, helpers, and resources](./services): organize a macro library.
5. [Template processors](./declarations): generate instance methods.

Actual providers live under `examples/mni/*/provider/kotlin` in the compiler repository. Run `./gradlew test --tests top.mcfpp.test.MniLambdaMigrationTest` there to check repeat and raycast examples. On Windows, use `gradlew.bat`.
