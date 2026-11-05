---
lastUpdated: true
---

# 原生 MNI：参数与返回值

`@MNIFunction` 使用编译器值类和返回值包装，适合已有原生接口。新工程的宏入口与结构化 DSL 见 [MNI 入门](./01mni-framework)和[宏教程](../mni-macros/overview)。

## 用 Kotlin 编写原生入口

`src/main/kotlin/example/mni/Arithmetic.kt`:

```kotlin
package example.mni

import top.mcfpp.annotations.MNIFunction
import top.mcfpp.core.lang.MCInt
import top.mcfpp.util.ValueWrapper

object Arithmetic {
    @JvmStatic
    @MNIFunction(normalParams = ["int", "int"], returnType = "int")
    fun add(left: MCInt, right: MCInt, result: ValueWrapper<MCInt>) {
        result.set(left.plus(right) as MCInt)
    }

    @JvmStatic
    @MNIFunction(readOnlyParams = ["int"], normalParams = ["int"], returnType = "int")
    fun addBonus(bonus: MCInt, score: MCInt, result: ValueWrapper<MCInt>) {
        result.set(score.plus(bonus) as MCInt)
    }
}
```

`src/main/mcfpp/main.mcfpp`:

```mcfpp
func add(left: int, right: int): int = example.mni.Arithmetic.add
func addBonus<bonus: int>(score: int): int = example.mni.Arithmetic.addBonus

func main() {
    external count: int = 2
    print(add(count, 3))
    print(addBonus<5>(count))
}
```

预期结果分别为 `5` 和 `7`。`MCInt` 可以表示构建时已知值或运行时数据，`plus` 请求编译器生成 MCFPP 加法。

## 对齐签名

| MCFPP | Kotlin 注解 | Kotlin 参数 |
| --- | --- | --- |
| `left: int, right: int` | `normalParams = ["int", "int"]` | `left: MCInt, right: MCInt` |
| `<bonus: int>` | `readOnlyParams = ["int"]` | `bonus: MCInt` |
| `: int` | `returnType = "int"` | `result: ValueWrapper<MCInt>` |

包装 ABI 的参数顺序为：只读参数 → 普通参数 → 可选接收者 → 非 void 结果包装。Kotlin 方法返回 Unit，在 JVM 上为 void；MCFPP 的结果通过 `result.set(...)` 提交。默认参数不会自动变成 MCFPP 默认参数。

| MCFPP | 宿主类型 |
| --- | --- |
| `int` | `top.mcfpp.core.lang.MCInt` |
| `float` | `top.mcfpp.core.lang.MCFloat` |
| `bool` | `top.mcfpp.core.lang.bool.ScoreBool` |
| `string` | `top.mcfpp.core.lang.nbt.MCString` |

另一种入口只接收 `NativeCallContext`，由上下文提供参数并发布结果。详细规则见 [MNIFunction API](/zh/api/annotation/mnifunction)。
