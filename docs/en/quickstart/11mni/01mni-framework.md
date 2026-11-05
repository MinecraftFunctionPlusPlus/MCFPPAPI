---
lastUpdated: true
---

# MNI: create a Kotlin project

MNI executes host Kotlin during compilation and generates a datapack for Minecraft. The default project uses the structured macro API to make `answer()` return `42`.

## Create and build

Use JDK 21. Choose **MCFPP MNI** in IDEA, or run:

```sh
mcfpp init hello-mni --mni
cd hello-mni
mcfpp build
mcfpp test
```

```text
hello-mni/
├─ mcfpp.toml
├─ mcfpp-packages.json
├─ src/main/mcfpp/main.mcfpp
├─ src/main/kotlin/example/mni/Example.kt
└─ src/test/kotlin/example/mni/ExampleTest.kt
```

The CLI prepares Kotlin and Gradle dependencies automatically; the first preparation needs network access. Generated Gradle files are in `.mcfpp/gradle`; MNI output is in `build/.mcfpp/mni`.

## Kotlin macro entry

`src/main/kotlin/example/mni/Example.kt`:

```kotlin
package example.mni

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object Example {
    @JvmStatic
    fun answerValue(): Int = 42

    @JvmStatic
    @MNIMacro(returnType = "int")
    fun answer(context: MacroContext): Expr<IntT> =
        context.quote.expression(context.types().intType()) {
            yield(literal(answerValue()))
        }
}
```

`answerValue()` computes a Kotlin integer. The macro's `yield(literal(...))` supplies it as the generated code's result. `@JvmStatic` provides the public static JVM entry required by registration.

## Declare and call

`src/main/mcfpp/main.mcfpp`:

```mcfpp
func answer(): int = example.mni.Example.answer

func main() {
    print(answer())
}
```

Macros need explicit declarations, just like native MNI functions. `func answer` supplies the public name; the annotation describes the JVM implementation's parameter and result types. `injectedBy` does not expose macros automatically. `mcfpp build` generates the datapack, normally under `build/hello-mni/`. Put it in the world's `datapacks/` directory and run:

```mcfunction
reload
function hello-mni:main
```

The expected output is `42`. Kotlin generates code during the build; Minecraft executes the generated commands.

## Kotlin unit test

`src/test/kotlin/example/mni/ExampleTest.kt`:

```kotlin
package example.mni

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals

class ExampleTest {
    @Test fun answerIs42() {
        assertEquals(42, Example.answerValue())
    }
}
```

`mcfpp test` runs Kotlin/JUnit tests. `mcfpp build` checks provider compilation, explicit bindings, source calls, and datapack generation.

## Continue reading

- [MNI macros and the Kotlin DSL](../mni-macros/overview)
- [Native entry parameters and results](./02mni-framework-implementation)
- [Generate commands](./05access)
- [Gradle and Kotlin tests](../12gradle/01gradle-configuration)
