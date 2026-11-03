---
lastUpdated: true
---

# MNIMacro

`top.mcfpp.annotations.MNIMacro` describes a Java entry that generates code. Read the [MNI macro tutorial](/en/quickstart/mni-macros/overview) for the development process.

## Entry signatures

```text
public static Expr<R> method(MacroContext context, macro inputs...)
public static Block method(MacroContext context, macro inputs...)
```

`Expr<R>` describes code with a result. `Block` describes code without a result. The first Java parameter is `MacroContext`. Remaining parameters match `params` order.

`R` uses a macro API marker, such as `IntT` for integers. Interfaces such as `Value<T>` supply inputs.

## MNIMacro fields

| Field | Default | Meaning |
| --- | --- | --- |
| `identifier` | `""` | Source function name, defaulting to the Java method name |
| `params` | `{}` | Ordered `MacroParam` declarations |
| `returnType` | `"void"` | Source result type |

## MacroParam fields

| Field | Default | Meaning |
| --- | --- | --- |
| `name` | Required | Source parameter name |
| `type` | Required | MCFPP type, such as `"int"` or `"(int)->void"` |
| `mode` | `VALUE` | Input mode |

Read [Parameters and expressions](/en/quickstart/mni-macros/parameters) for `VALUE`, `CONST`, `REF`, `INLINE`, and complete examples. Macro library loading registers the annotated names. Read [Make the macro callable](/en/quickstart/mni-macros/overview#make-the-macro-callable) for that process.
