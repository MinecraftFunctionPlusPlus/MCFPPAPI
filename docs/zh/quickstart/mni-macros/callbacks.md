---
lastUpdated: true
---

# 宏回调：实现 repeat 循环

本节用 Kotlin 接收者 DSL 将源码 Lambda 插入运行时循环。创建 `src/main/kotlin/example/macros/RepeatMacros.kt`：

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object RepeatMacros {
    @JvmStatic
    @MNIMacro(normalParams = [
        "int",
        "(int)->void"
    ], returnType = "void")
    fun repeat(context: MacroContext, times: Value<IntT>, body: InlineFn<VoidT>): Block =
        context.quote.block {
            val index = local("index", literal(0))
            val limit = local("limit", times.value)
            whileLoop({ index.value lt limit.value }) {
                inlineVoid(body, index.value)
                index += 1
            }
        }
}
```

声明后调用：

```mcfpp
func repeat(times: int, body: (int)->void): void = example.macros.RepeatMacros.repeat

func main() {
    repeat(3) { index ->
        if (index == 1) { return; }
        print(index)
    }
    print("Finished")
}
```

预期依次显示 `0`、`2` 和 `Finished`。

## 条件与回调何时执行

`whileLoop({ index.value lt limit.value }) { ... }` 的两个 Kotlin 回调在构造时各执行一次，分别建立条件和循环体。生成的条件在每轮运行前重新求值。

`inlineVoid(body, index.value)` 把用户回调插入当前位置，并以 VALUE 方式传入序号。回调的 `return` 只结束本次内联区域，后面的 `index += 1` 仍会执行。`break` 和 `continue` 不能跨越回调边界。

## 捕获与带结果的回调

自由局部变量在 lambda 创建时按值快照，捕获值保持只读；全局声明按使用时的当前值访问。需要累积结果时显式返回下一值：

```mcfpp
// 此重载使用本页末尾链接的完整示例 provider。
func repeat(times: int, initial: int, body: (int,int)->int): int = example.mnirepeat.KotlinRepeatMacro.repeatFold

func main() {
    var total = repeat(3, 0) { sum, index -> sum + index }
    print(total)
}
```

结果为 `3`。这个重载接收 `InlineFn<IntT>`，回调签名为 `(int,int)->int`。宏用 `inline<IntT>(body, total.value, index.value)` 得到结果，再赋给累加器。

尾表达式提供结果；尾随分号会丢弃值；void 目标丢弃尾值。INLINE 接受静态 lambda 或普通源码函数引用，动态函数值、native 与 macro 目标不作为可内联源码体。

完整实现位于编译器仓库 `examples/mni/repeat/provider/kotlin/example/mnirepeat/KotlinRepeatMacro.kt`。处理普通集合时也可以使用 [fold 与 foreach](../advanced/collections)。
