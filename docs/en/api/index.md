---
lastUpdated: true
---

# MNI API reference

MNI APIs, the DSL, and project templates prioritize Kotlin. Java can call the generated JVM methods. Start with a [Kotlin MNI project](/en/quickstart/11mni/01mni-framework).

| API | Purpose |
| --- | --- |
| [Kotlin DSL](./kotlin-dsl) | Quote, expressions, location writes, control flow, calls, and contexts |
| [MNIMacro](./annotation/mnimacro) | Structured macro entries and input modes |
| [MNIFunction](./annotation/mnifunction) | Native entries, compiler values, and result wrappers |
| [MNIAccessor](./annotation/mniaccessor) / [MNIMutator](./annotation/mnimutator) | Native property access |
| [MNIMember](./annotation/mnimember) | Member metadata |
| [InsertCommand](./annotation/insertcommand) / [Command](./class/command) | Native command construction |

Structured macros use `top.mcfpp.mni.api` and construct code through `MacroContext`, `Value<T>`, `Expr<T>`, and `Block`. Native `@MNIFunction` entries use `Var` subclasses, `ValueWrapper`, or `NativeCallContext`. Each entry protocol validates its own signature.

The current macro API version is `ApiVersion.VERSION = "0.2.0-experimental"`, independent of the compiler release. Providers can check it with `ApiVersion.isCompatibleWith("0.2")`.

See the [macro tutorial](/en/quickstart/mni-macros/overview) and [public address inputs](/en/quickstart/mni-macros/parameters).
