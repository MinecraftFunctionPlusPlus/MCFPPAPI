---
lastUpdated: true
---

# MNI 宏入门：用 Kotlin 生成代码

MNI 宏在编译期运行 Kotlin，通过类型化代码树生成 MCFPP/Minecraft 的运行时代码。API、DSL、示例和工程模板以 Kotlin 为主要设计对象；Java 可以调用生成的 JVM 方法。

## 创建工程

使用 JDK 21：

```sh
mcfpp init hello-mni --mni
cd hello-mni
mcfpp build
mcfpp test
```

provider 放在 `src/main/kotlin`，JUnit 测试放在 `src/test/kotlin`。默认的 `answer()` 宏及目录说明见 [MNI 工程](../09mni/01mni-framework)。

## 实现一个加一宏

创建 `src/main/kotlin/example/macros/ScoreMacros.kt`：

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object ScoreMacros {
    @JvmStatic
    @MNIMacro(
        normalParams = ["int"],
        returnType = "int"
    )
    fun addOne(context: MacroContext, value: Value<IntT>): Expr<IntT> =
        context.quote.expression(context.types().intType()) {
            yield(value.value + 1)
        }
}
```

| 类型或写法 | 含义 |
| --- | --- |
| `MacroContext` | 此次展开的代码、类型、诊断和资源服务 |
| `IntT` | MCFPP 整数的宿主类型标记 |
| `Value<IntT>` | 调用方已求值并绑定一次的整数 |
| `Expr<IntT>` | 执行后产生整数的代码 |
| `yield(...)` | 指定当前表达式区域的结果 |

`value.value` 和 `+ 1` 是 `CodeScope` 内的 DSL 操作。Kotlin 在构建时建立加法节点，游戏运行时读取输入并计算。完整操作表见 [Kotlin DSL API](/zh/api/kotlin-dsl)。

## 让宏具有可调用的名字

在 MCFPP 中显式声明，格式与 MNI 函数相同：

```mcfpp
func addOne(value: int): int = example.macros.ScoreMacros.addOne
```

CLI 构建的 provider 会自动加入类加载器；独立 JAR 使用 `mcfpp.toml` 中的 `jars`。`@MNIMacro` 只描述 JVM 实现；每个可调用的宏都需要源码声明，`injectedBy` 不会自动暴露宏。

```mcfpp
func main() {
    external score: int = 10
    print(addOne(score))
}
```

预期输出为 `11`。公开名称、参数名和命名空间由 MCFPP 声明决定，可以用不同名称绑定同一个 JVM 方法。参数类型与返回类型必须和注解匹配；参数模式由 JVM 包装类型推导。

## 入口与生成阶段

入口必须是公开的 JVM 静态方法，首参数为 `MacroContext`。`object` 和 companion 成员使用 `@JvmStatic`；顶层函数天然是静态方法，可用 `@file:JvmName("ScoreMacros")` 固定绑定所用的类名。

`void` 宏返回 `Block`；其他宏返回 `Expr<T>`，所有可达正常出口用 `yield` 给出结果。DSL 回调在构造时执行一次，builder 与句柄属于本次展开及相应作用域。

Kotlin 的 `if`、`for` 控制生成过程；DSL 的 `ifThen`、`whileLoop` 构造运行时控制流。

## 阅读顺序

1. [参数和表达式](./parameters)：值、常量、位置句柄和公开地址。
2. [循环和回调](./callbacks)：INLINE、累加器与局部 return。
3. [实体、位置和计分板](./minecraft)：Minecraft 执行上下文。
4. [诊断、辅助函数和资源](./services)：组织宏库。
5. [模板处理器](./declarations)：生成实例方法。

实际 Kotlin provider 位于编译器仓库 `examples/mni/*/provider/kotlin`。在该仓库根目录运行 `./gradlew test --tests top.mcfpp.test.MniLambdaMigrationTest` 可检查 repeat、raycast 等示例；Windows 使用 `gradlew.bat`。
