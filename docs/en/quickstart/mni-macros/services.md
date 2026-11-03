---
lastUpdated: true
---

# Organize macros: diagnostics, helper functions, and resources

As a macro grows, `MacroContext` provides three more services: source diagnostics, reusable helper functions, and datapack resources. This page explains each, then combines a helper and an objective.

## Report a problem at the source call

Suppose `ConstantMacros` from the parameter page requires a nonnegative increment. Add this check immediately after `int step = amount.intValue();`:

```java
if (step < 0) {
    context.diagnostics().error(
        context.callSite(), "Amount must be zero or greater.");
}
```

`callSite()` identifies this call in MCFPP source. The diagnostic points to that location. `error` fails the current expansion. The compiler discards its generated content. Use `warning` for advice that permits compilation to continue.

## What a helper function provides

Several generated locations can call one helper function. Its definition needs:

1. A name hint, such as `baseReward`.
2. A `FunctionSignature` that specifies parameters and result type.
3. A body written through the code construction API.

The resulting `FunctionRef<T>` describes a callable function. `code.call(function, arguments)` generates a call. Helpers receive data through their own parameters. Call sites explicitly supply required values.

## Why the compiler allocates resource names

A macro may need an objective to store a result. Separate source calls may require separate storage. `resources().reserve(...)` gives resources distinct names and generates initialization.

`ResourceKind.OBJECTIVE` specifies an objective. `ResourceData` describes its criteria, such as `criteria = "dummy"`. `ResourceRef.name()` returns the allocated name.

## Complete example: calculate and store a reward

`recordReward(bonus)` calls a helper that supplies a base reward of `10`. It adds `bonus` and stores the result in its allocated objective.

`example/macros/RewardMacros.java`:

```java
package example.macros;

import java.util.List;
import java.util.Map;
import top.mcfpp.annotations.MNIMacro;
import top.mcfpp.annotations.MacroParam;
import top.mcfpp.mni.api.*;

public final class RewardMacros {
    @MNIMacro(params = {
        @MacroParam(name = "bonus", type = "int")
    }, returnType = "int")
    public static Expr<IntT> recordReward(MacroContext context, Value<IntT> bonus) {
        FunctionSignature<IntT> signature = FunctionSignature.of(
            List.of(), context.types().intType());
        FunctionRef<IntT> base = context.helpers().define(
            "baseReward", signature,
            (code, parameters) -> code.yield(code.intLiteral(10)));
        ResourceRef objective = context.resources().reserve(
            ResourceKind.OBJECTIVE, "reward",
            ResourceData.of(ConstantValue.record(
                Map.of("criteria", ConstantValue.text("dummy")))));
        return context.quote().expression(context.types().intType(), code -> {
            Ref<IntT> saved = code.minecraft().score(
                ScoreHolder.named("#reward"), objective.name());
            code.assign(saved, code.add(code.call(base, List.of()), bonus.expr()));
            code.yield(saved.load());
        });
    }
}
```

In a project that loads the macro, `print(recordReward(5))` displays `15`.

Read its implementation in this order:

| Step | Code location | Purpose |
| --- | --- | --- |
| 1 | `FunctionSignature.of(...)` | Declare a zero-argument function returning an integer |
| 2 | `helpers().define(...)` | Generate a body returning `10` |
| 3 | `resources().reserve(...)` | Reserve a `dummy` objective |
| 4 | `score(ScoreHolder.named("#reward"), ...)` | Select a fixed holder on that objective |
| 5 | `call`, `add`, `assign` | Call, add, and store |
| 6 | `yield` | Return the stored integer as the macro result |

`"#reward"` is a fixed score holder. This example therefore operates independently of player identity.

## Data in resource descriptions

`ConstantValue` supplies integers, booleans, text, sequences, and records. `ConstantValue.record(...)` creates a field record. `ResourceData.of(...)` supplies that record as a resource description.

| Supported resource | Main description field |
| --- | --- |
| `OBJECTIVE` | `criteria`, such as `"dummy"` |
| `STORAGE` | `initial`, describing structured initial data |

Resources and generated code commit together after successful expansion. Use `helpers().define` to generate helper functions. Read [build IR](../01project/04build-and-ir) to locate related source and commands.

Continue with [Template processors](./declarations) to generate data template methods with the same code construction API.
