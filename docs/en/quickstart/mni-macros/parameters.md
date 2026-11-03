---
lastUpdated: true
---

# Macro parameters: values, constants, and writable locations

Continue with the [macro library prepared earlier](./overview). Implement `addConstant(value, amount)`: generate addition from a runtime integer and a fixed increment.

## Read the source call first

In a project that loads this macro, write:

```mcfpp
external score: int = 10
print(addConstant(score, 5))
```

`score` can change during play. `5` is known during compilation. The macro declares these inputs as `VALUE` and `CONST`.

Both arguments use parentheses. `CONST` adds a requirement to the macro input. Source [readonly parameters](../07generic/01concrete_var) use angle brackets.

## Complete Java implementation

`example/macros/ConstantMacros.java`:

```java
package example.macros;

import top.mcfpp.annotations.MNIMacro;
import top.mcfpp.annotations.MacroParam;
import top.mcfpp.mni.api.*;

public final class ConstantMacros {
    @MNIMacro(params = {
        @MacroParam(name = "value", type = "int"),
        @MacroParam(name = "amount", type = "int", mode = ParamMode.CONST)
    }, returnType = "int")
    public static Expr<IntT> addConstant(
            MacroContext context, Value<IntT> value, Const<IntT> amount) {
        int step = amount.intValue();
        return context.quote().expression(context.types().intType(), code -> {
            Local<IntT> result = code.local(
                "result", context.types().intType(), value.expr());
            code.assign(result, code.add(result.load(), code.intLiteral(step)));
            code.yield(result.load());
        });
    }
}
```

## VALUE: generate a read of the input

`value` has type `Value<IntT>`. It can represent a runtime score. `value.expr()` supplies an expression that reads this input.

The caller evaluates and binds its arguments first. Repeated uses of `value.expr()` then reference the same bound input. If an argument comes from a function call, repeated macro uses read that call's bound result.

## CONST: read a constant directly in Java

`amount` has type `Const<IntT>`. `amount.intValue()` obtains an ordinary Java integer during compilation. Here, it obtains `5`.

Java can use this integer to select generated content. For example, a fixed repetition count can determine how many code fragments to construct. `mode = ParamMode.CONST` makes the compiler check the argument before invoking the entry.

`step` is Java data. `code.intLiteral(step)` places it into the generated code.

## Local: create a variable in generated code

`result` has type `Local<IntT>`. It represents a local integer in the generated program:

| Operation | Effect here |
| --- | --- |
| `local("result", intType, value.expr())` | Create a local initialized from the input |
| `result.load()` | Read the local |
| `assign(result, expression)` | Write an expression result to the local |
| `yield(result.load())` | Use the final integer as the macro call result |

The generated behavior corresponds to:

```text
var result = score
result = result + 5
// Use result as the value of addConstant(score, 5)
```

Java `step + 1` calculates an integer during compilation. `code.add` constructs addition in the generated program. Choose the interface according to when the data takes effect.

## REF: operate on a writable location

`Ref<T>` describes a writable location supplied by the compiler. Locals and `minecraft.score(...)` can provide these locations. `load()` reads them. `assign` writes them.

Source types `ScoreRef` and `NBTRef<T>` contain game addresses that callers can store and pass. They serve source interfaces. Macro `Ref<T>` serves code construction. Read [Address values](../02base/06references) for game address usage.

## The four parameter modes

| Mode | Java parameter | Input |
| --- | --- | --- |
| `VALUE` | `Value<T>` | A bound value |
| `CONST` | `Const<T>` | A value known during compilation |
| `REF` | `Ref<T>` | A readable and writable location |
| `INLINE` | `InlineFn<S>` | A user callback for generated code |

`VALUE` is the default. Continue with [INLINE callbacks and loops](./callbacks).
