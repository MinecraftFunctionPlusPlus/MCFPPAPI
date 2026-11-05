---
lastUpdated: true
---

# MNI 入门：创建 Kotlin 工程

MNI 在编译期执行宿主 Kotlin，生成供 Minecraft 执行的数据包。默认工程使用结构化宏 API，实现 `answer()` 返回 `42`。

## 创建与构建

准备 JDK 21，在 IDEA 中选择 **MCFPP MNI**，或运行：

```sh
mcfpp init hello-mni --mni
cd hello-mni
mcfpp build
mcfpp test
```

```text
hello-mni/
├─ mcfpp.toml
├─ mcfpp-packages.json
├─ src/main/mcfpp/main.mcfpp
├─ src/main/kotlin/example/mni/Example.kt
└─ src/test/kotlin/example/mni/ExampleTest.kt
```

CLI 自动准备 Kotlin/Gradle 依赖，首次准备需要联网。生成的 Gradle 工程在 `.mcfpp/gradle`，MNI 编译产物在 `build/.mcfpp/mni`。

## Kotlin 宏入口

`src/main/kotlin/example/mni/Example.kt`:

```kotlin
package example.mni

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object Example {
    @JvmStatic
    fun answerValue(): Int = 42

    @JvmStatic
    @MNIMacro(returnType = "int")
    fun answer(context: MacroContext): Expr<IntT> =
        context.quote.expression(context.types().intType()) {
            yield(literal(answerValue()))
        }
}
```

`answerValue()` 在 Kotlin 中计算整数。宏的 `yield(literal(...))` 将它作为生成代码的结果。`@JvmStatic` 为 object 方法生成注册器需要的公开静态 JVM 入口。

## 声明与调用

`src/main/mcfpp/main.mcfpp`:

```mcfpp
func answer(): int = example.mni.Example.answer

func main() {
    print(answer())
}
```

宏需要与 MNI 函数一样显式声明。名称由 `func answer` 决定，注解描述 JVM 实现的参数和返回类型；`injectedBy` 不会自动暴露宏。`mcfpp build` 生成数据包；默认输出为 `build/hello-mni/`。放入存档的 `datapacks/` 后执行：

```mcfunction
reload
function hello-mni:main
```

预期显示 `42`。Kotlin 在构建期间完成代码生成，Minecraft 执行生成的命令。

## Kotlin 单元测试

`src/test/kotlin/example/mni/ExampleTest.kt`:

```kotlin
package example.mni

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertEquals

class ExampleTest {
    @Test fun answerIs42() {
        assertEquals(42, Example.answerValue())
    }
}
```

`mcfpp test` 执行 Kotlin/JUnit 测试；`mcfpp build` 检查 provider 编译、显式绑定、源码调用和数据包生成。

## 继续阅读

- [MNI 宏与 Kotlin DSL](../mni-macros/overview)
- [原生入口参数与返回值](./02mni-framework-implementation)
- [生成命令](./05access)
- [Gradle 与 Kotlin 测试](../10gradle/01gradle-configuration)
