---
lastUpdated: true
---

# MNI macros: turn a call into code

Ordinary Java MNI entries supply values or commands. A macro returns **code for later execution**. For example, `addOne(score)` can generate code that reads a score, adds one, and supplies the result.

This guide is for macro library authors. First read [Java MNI introduction](../11mni/01mni-framework) and [Lambdas](../04function/05lambda). Then start with the single expression below.

## Prepare a macro library and caller

Macro development has two steps: implement a Java entry, then add it to a library loading process. Loading gives the function an MCFPP name that source code can resolve.

An ordinary MNI project can compile these Java classes. Current CLI templates provide `@MNIFunction` bindings. Macros register through library loading interfaces. The compiler repository contains complete examples:

| Example | Java and Kotlin implementations | Source behavior |
| --- | --- | --- |
| Repetition | `examples/mni/repeat` | Invoke user callbacks with iteration indexes |
| Raycasting | `examples/mni/raycast` | Test blocks along a direction |
| Field and score synchronization | `examples/mni/score-mapping` | Generate template `load` and `save` methods |

`src/test/kotlin/top/mcfpp/test/MniRepeatTest.kt` demonstrates entry preparation, source calls, and generated command checks. Run this command from the compiler repository root:

```sh
./gradlew test --tests top.mcfpp.test.MniRepeatTest
```

Use `gradlew.bat` on Windows. This test checks `repeat` calls, callbacks, and loops. Read [Gradle and Java tests](../12gradle/01gradle-configuration) for tests in an ordinary MNI project.

## Implement an increment macro

Create `example/macros/ScoreMacros.java` in the macro library:

```java
package example.macros;

import top.mcfpp.annotations.MNIMacro;
import top.mcfpp.annotations.MacroParam;
import top.mcfpp.mni.api.*;

public final class ScoreMacros {
    @MNIMacro(
        params = {@MacroParam(name = "value", type = "int")},
        returnType = "int"
    )
    public static Expr<IntT> addOne(MacroContext context, Value<IntT> value) {
        return context.quote().expression(context.types().intType(), code -> {
            code.yield(code.add(value.expr(), code.intLiteral(1)));
        });
    }
}
```

Read its inputs and result first:

| Java type | Meaning in this example |
| --- | --- |
| `MacroContext` | Code construction, types, and diagnostics for this macro call |
| `IntT` | The macro API marker for integers |
| `Value<IntT>` | An integer value supplied by the caller |
| `Expr<IntT>` | Code that produces an integer when executed |

`IntT` only marks a type. `Value<IntT>` represents the input. `Expr<IntT>` represents result code. These interfaces belong to the macro API. Ordinary MNI uses interfaces such as `MCInt`.

## Read the three construction steps

1. `quote().expression(intType, ...)` starts code construction with an integer result.
2. `code.add(value.expr(), code.intLiteral(1))` creates addition of the input value and integer `1`.
3. `code.yield(...)` specifies the result of this code.

`code -> { ... }` is a Java callback. The compiler invokes it during compilation to construct code. The Java method returns a code object. Executing that code in the game produces the integer.

Inside `main` of a project that loads this macro, write:

```mcfpp
external score: int = 10
print(addOne(score))
```

Execution displays `11`. Compilation reads the annotation and generates addition. Game execution reads `score` and performs that addition.

## Make the macro callable

`@MNIMacro` defaults to the Java method name, so this source function is `addOne`. `params` specifies source parameter names and types. `returnType` specifies the source result type.

**Registration** adds these names and the entry method to an MCFPP namespace. Library loading performs registration. Callers then import functions according to that library's namespace rules. The current CLI has no separate macro registration configuration. Library authors can follow the loading process in the repository test above.

Ordinary `func ... = package.Class.method` declarations bind `@MNIFunction` entries. Macro calls use names already registered by their library.

## Reading order

1. [Parameters and expressions](./parameters): runtime inputs and compilation constants.
2. [Loops and callbacks](./callbacks): implement `repeat` with user code.
3. [Entities, positions, and scores](./minecraft): generate Minecraft operations.
4. [Diagnostics, helpers, and resources](./services): organize a macro library.
5. [Template processors](./declarations): generate methods from declarations.

Use `mcfpp build --dump-ir` to inspect generation. Read [IR output](../01project/04build-and-ir) for file locations.
