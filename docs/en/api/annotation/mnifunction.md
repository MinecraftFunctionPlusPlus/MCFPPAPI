---
lastUpdated: true
---

# MNIFunction

`top.mcfpp.annotations.MNIFunction` describes a native Kotlin/JVM MNI entry invoked during compilation.

```kotlin
import top.mcfpp.annotations.MNIFunction
import top.mcfpp.core.lang.MCInt
import top.mcfpp.util.ValueWrapper

object Arithmetic {
    @JvmStatic
    @MNIFunction(normalParams = ["int", "int"], returnType = "int")
    fun add(left: MCInt, right: MCInt, result: ValueWrapper<MCInt>) {
        result.set(left.plus(right) as MCInt)
    }
}
```

Inputs use `Var` subclasses. Wrapper ABI order is readonly parameters, ordinary parameters, optional receiver, then the non-void result wrapper. The Kotlin method returns Unit/JVM void and supplies its MCFPP result through `result.set(value)`.

| Field | Default | Meaning |
| --- | --- | --- |
| `readOnlyParams` | `[]` | Readonly parameter types |
| `normalParams` | `[]` | Ordinary parameter types |
| `caller` | `"void"` | Receiver type marker |
| `returnType` | `"void"` | MCFPP result type |
| `override` | `false` | Inherited override |
| `genericType` | `[]` | Generic type parameter names |
| `tag` | `[]` | Additional tags |
| `identifier` | `""` | Registered name; empty uses the JVM method name |
| `returnsConstWhenArgsConst` | `false` | Constant-result property for constant inputs |

The annotation is retained at runtime. Entries must be public and static; Kotlin object/companion methods use `@JvmStatic`. Explicit MCFPP declarations define the source interface. Defaults are not converted automatically. See [native parameters and results](/en/quickstart/11mni/02mni-framework-implementation).

## NativeCallContext

An alternative entry accepts only `NativeCallContext`, which provides arguments, the receiver, and result publication. The method still returns Unit/JVM void. Property entries also use this form; see [MNIAccessor](./mniaccessor) and [MNIMutator](./mnimutator).

Structured macros use the separate [MNIMacro](./mnimacro) protocol and [Kotlin DSL](../kotlin-dsl).
