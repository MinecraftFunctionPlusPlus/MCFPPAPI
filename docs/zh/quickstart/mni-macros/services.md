---
lastUpdated: true
---

# 诊断、辅助函数与资源

`MacroContext` 为一次展开提供类型查询、诊断、helper 和资源服务。完整例子创建返回 `10` 的 helper，再加上传入奖励并保存到自动分配的计分板：

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object RewardMacros {
    @JvmStatic
    @MNIMacro(normalParams = ["int"], returnType = "int")
    fun recordReward(context: MacroContext, bonus: Value<IntT>): Expr<IntT> {
        val signature = FunctionSignature.of(emptyList(), context.types().intType())
        val base = context.helpers().define("baseReward", signature) { code, _ ->
            code.kotlin { yield(literal(10)) }
        }
        val objective = context.resources().reserve(
            ResourceKind.OBJECTIVE, "reward",
            ResourceData.of(ConstantValue.record(
                mapOf("criteria" to ConstantValue.text("dummy"))
            ))
        )
        return context.quote.expression(context.types().intType()) {
            val saved = score(ScoreHolder.named("#reward"), objective.name())
            saved.value = call(base) + bonus.value
            yield(saved.value)
        }
    }
}
```

将它放入 `src/main/kotlin/example/macros/RewardMacros.kt`，再添加源码声明：

```mcfpp
func recordReward(bonus: int): int = example.macros.RewardMacros.recordReward
```

`print(recordReward(5))` 的预期结果为 `15`。

## 诊断

```kotlin
if (step < 0) {
    context.diagnostics().error(context.callSite(), "Amount must be zero or greater.")
}
```

这里的 `step` 来自前一页的 `amount.intValue()`。`callSite()` 定位源码调用；`error` 标记本次展开失败，`warning` 发出提示。代码、helper、声明与资源在成功后一起提交，失败时整体回滚。

## helper 与普通函数

`helpers().define(hint, signature) { code, parameters -> ... }` 立即构造 helper，返回 `FunctionRef<R>`。使用 `code.kotlin { ... }` 进入相同的接收者 DSL。helper 通过自己的参数取得输入，支持 VALUE/REF，不能捕获外层局部变量或执行者句柄。

`types().function(name, argumentTypes)` 查询可访问的普通函数重载，`call` 构造有结果调用，`callVoid` 追加无结果调用。忽略 `call` 返回的表达式不会执行它；独立调用使用 `evaluate(call(...))`。

## 资源描述

| 种类 | 描述字段 |
| --- | --- |
| `OBJECTIVE` | `criteria`, 例如 `"dummy"` |
| `STORAGE` | `initial`, 初始结构化数据 |

通过 `ConstantValue.record`、`text`、`integral`、`bool` 和 `sequence` 构造闭合数据，交给 `ResourceData.of(...)`。`reserve` 返回编译器分配的名称和资源句柄。下一节介绍[模板处理器](./declarations)。
