---
lastUpdated: true
---

# MNIMacro

`top.mcfpp.annotations.MNIMacro` 描述编译期生成代码的 Kotlin/JVM 宏入口。

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

每个可调用的宏都需要 MCFPP 声明，格式与 `@MNIFunction` 的显式绑定相同：

```mcfpp
func addOne(input: int): int = example.macros.MathMacros.addOne
```

公开名称、参数名和命名空间由 MCFPP 声明决定；声明类型必须与注解匹配。`injectedBy` 不会自动注册宏。

## 入口规则

- provider 和入口必须公开，方法必须具有 JVM static 入口。object/companion 方法使用 `@JvmStatic`；顶层函数通过其 file facade 类名绑定。
- 首参数精确为 `MacroContext`；`normalParams` 按顺序列出后续参数的 MCFPP 类型，不含 context。
- 模式直接从 JVM 包装类型推导：`Value<T>` 为 VALUE，`Const<T>` 为 CONST，`Ref<T>` 为 REF，`InlineFn<S>` 为 INLINE。
- `void` 宏返回 `Block`，非 void 宏返回 `Expr<T>`。实际 MCFPP 类型由编译器校验。
- `suspend`、普通实例方法和额外默认参数 mask 不符合该同步入口协议。Kotlin 默认参数不会变为 MCFPP 默认参数。
- 重载按 MCFPP 名称与参数类型区分；参数模式和返回类型不区分重载。

## 注解字段

| 字段 | 默认值 | 含义 |
| --- | --- | --- |
| `normalParams` | `[]` | 按顺序列出类型，如 `"int"`、`"ScoreRef"`、`"NBTRef<int>"`、`"(int)->void"` |
| `returnType` | `"void"` | MCFPP 返回类型 |
| `identifier` | `""` | 可省略；显式绑定始终使用 MCFPP `func` 声明的名称 |

宏声明目前使用圆括号参数，不支持只读泛型参数或参数默认值。`Const` 参数仍写在圆括号中。重载按公开名称和参数类型选择，返回类型、模式与 wrapper 不区分重载。

公开引用使用 `Value<ScoreRefT>` 或 `Value<NBTRefT<IntT>>` 与 VALUE 模式。注册、调用和完整引用转发示例见 [宏入门](/zh/quickstart/mni-macros/overview)与[参数教程](/zh/quickstart/mni-macros/parameters)。
