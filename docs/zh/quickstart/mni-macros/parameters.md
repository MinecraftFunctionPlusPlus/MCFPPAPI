---
lastUpdated: true
---

# 宏参数：值、常量与引用地址

继续使用[宏工程](./overview)。普通输入使用 `Value<T>`，构建时已知输入使用 `Const<T>`。

## VALUE 与 CONST

创建 `src/main/kotlin/example/macros/ConstantMacros.kt`：

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object ConstantMacros {
    @JvmStatic
    @MNIMacro(normalParams = [
        "int",
        "int"
    ], returnType = "int")
    fun addConstant(context: MacroContext, value: Value<IntT>, amount: Const<IntT>): Expr<IntT> {
        val step = amount.intValue()
        return context.quote.expression(context.types().intType()) {
            val result = local("result", value.value)
            result += step
            yield(result.value)
        }
    }
}
```

先在 MCFPP 中声明：

```mcfpp
func addConstant(value: int, amount: int): int = example.macros.ConstantMacros.addConstant
```

`addConstant(score, 5)` 在运行时返回 `score + 5`。两个参数都写在圆括号中；源码只读参数使用的尖括号属于另一套语法。`normalParams` 只列类型；`Value` 和 `Const` 决定两个参数的模式。

- `VALUE`：调用方按源码顺序求值一次。反复读取 `value.value` 使用同一份稳定结果；宏未使用该参数时，实参的副作用仍会执行。
- `CONST`：`amount.intValue()` 在构建时得到 Kotlin `Int`。动态输入会在宏入口执行前被拒绝。
- `Local<T>`：`local("result", expression)` 根据初值推导类型；`.value` 读写生成的变量，`+=` 构造复合赋值。

Kotlin 的 `step + 1` 立即计算宿主整数；DSL 的 `value.value + 1` 构造运行时代码。运算表见 [Kotlin DSL API](/zh/api/kotlin-dsl)。

## `Ref<T>` 与公开地址

| 类型 | 保存什么 | 读写方式 |
| --- | --- | --- |
| `Ref<IntT>` / `Local<IntT>` | 编译器提供的可写整数位置 | DSL 中使用 `.value`、`assign`、`+=` |
| `Value<ScoreRefT>` | MCFPP `ScoreRef` 的地址描述 | 传给源码函数，由 `tryRead` / `set` 访问目标 |
| `Value<NBTRefT<IntT>>` | MCFPP `NBTRef<int>` 的地址描述 | 通过源码引用操作访问 NBT |

当 `health: Value<ScoreRefT>` 时，`health.value` 的类型为 `Expr<ScoreRefT>`，内容是地址描述。读取目标分数需要执行 `tryRead`。对捕获的引用执行 `set` 修改的是游戏目标，引用描述自身仍保持只读。

源码通过显式地址工厂创建引用；已移除的 `ref local` 不能对普通局部变量取地址。

## 将引用转发给普通函数

下面的 Kotlin 入口沿用本页 imports，放入同包的 `DamageMacros.kt`：

```kotlin
object DamageMacros {
    @JvmStatic
    @MNIMacro(normalParams = [
        "ScoreRef",
        "int"
    ], returnType = "void")
    fun damage(context: MacroContext, health: Value<ScoreRefT>, amount: Value<IntT>): Block {
        @Suppress("UNCHECKED_CAST")
        val target = context.types().function(
            "applyDamage", listOf(health.type(), amount.type())
        ) as FunctionRef<VoidT>
        return context.quote.block {
            callVoid(target, health.value, amount.value)
        }
    }
}
```

提供显式宏声明和普通源码函数：

```mcfpp
func damage(health: ScoreRef, amount: int): void = example.macros.DamageMacros.damage

func applyDamage(health: ScoreRef, amount: int) {
    health.tryRead { current ->
        if (current < amount) { health.set(0); }
        else { health.set(current - amount); }
    }
}

func main() {
    /scoreboard objectives add hp dummy
    /scoreboard players set #health hp 100
    damage(scoreRef("#health", "hp"), 30)
    var alias = scoreRef("#health", "hp")
    alias.tryRead { current -> damage(alias, current); }
}
```

第一次调用把分数改为 `70`，回调中的第二次调用改为 `0`。工厂调用可以直接作为宏实参，回调参数和外部引用可以继续传入宏。`tryRead` 只在目标读取成功时同步执行回调。

NBT 入口使用 `normalParams = ["NBTRef<int>", "int"]` 和 `Value<NBTRefT<IntT>>`，由普通函数接收 `NBTRef<int>`。完整示例中的绑定与调用为：

```mcfpp
func damageNbt(health: NBTRef<int>, amount: int): void = example.mnidamage.KotlinDamageMacro.damageNbt
func main() {
    damageNbt(nbtStorageRef<int>("example:health", "normal.hp"), 30)
}
```

完整 provider 位于编译器仓库 `examples/mni/damage/provider/kotlin/example/mnidamage/KotlinDamageMacro.kt`。调用工程为 `examples/mni/damage` 和 `examples/mni/nbt-reference`；地址语义见[地址引用](../02base/06references)。

## 四种模式

| 模式 | Kotlin 参数 | 含义 |
| --- | --- | --- |
| `VALUE` | `Value<T>` | 已求值并绑定的值，包括公开地址描述 |
| `CONST` | `Const<T>` | 可证明的闭合常量 |
| `REF` | `Ref<T>` | 编译器提供的原可写位置能力 |
| `INLINE` | `InlineFn<S>` | 可静态插入的源码回调 |

`REF` 继续用于 builder 和 helper 的位置传递。公开引用参数使用默认的 `VALUE`。下一节介绍 [INLINE 与循环](./callbacks)。
