---
lastUpdated: true
---

# 模板处理器：为 data 生成方法

`TemplateProcessor` 在声明完成后读取 `TemplateView`，返回新增方法、内部函数和白名单元数据。下面生成一个返回 `42` 的公开实例方法：

```kotlin
package example.macros

import top.mcfpp.mni.api.*

class AnswerProcessor : TemplateProcessor {
    override fun expand(context: DeclarationContext, template: TemplateView): DeclarationEdits {
        val signature = FunctionSignature.of(emptyList(), context.types().intType())
        val answer = context.declarations().method(template.type(), "answer", signature) { method ->
            method.builder().kotlin {
                yield(literal(42))
            }
        }
        return context.declarations().edits(listOf(answer))
    }
}
```

创建 `src/main/kotlin/example/macros/AnswerProcessor.kt`。库的注册钩子通过 `namespace.registerTemplateProcessor(annotationName, processorClass)` 将已有注解与处理器关联；处理器需要可公开实例化的无参构造器。完整注解与注册实现可参考编译器仓库 `examples/mni/score-mapping/provider/kotlin/example/mniscore/KotlinScoreMappingProvider.kt`。

注册后，源码可以使用注解并调用生成方法：

```mcfpp
@Answer
data Reward {}

func main() {
    var reward = Reward()
    print(reward.answer())
}
```

预期结果为 `42`。`method.builder().kotlin { ... }` 使用与宏相同的 DSL，`yield` 提供方法结果。

## 读取声明与生成字段访问

| API | 内容 |
| --- | --- |
| `template.type()` | 当前 owner 类型 |
| `fields()` / `fieldDeclarations()` | 字段、类型、可写性、访问级别和注解 |
| `methods()` | 方法签名、只读参数与修饰符 |
| `annotations()` / `source()` | 模板注解与声明位置 |
| `method.self()` / `parameters()` | 生成方法的实例与参数 |

在方法 DSL 中，`fieldRef(method.self(), field).value = expression` 构造字段写入。字段必须属于合法 owner、可访问且可写。新方法不能覆盖已有可见签名；self 和参数只在该方法及其合法子作用域有效。

score-mapping 案例根据 `@ScoreMapping` 和 `@Score` 生成 `load`、`save`；整数保存原值，布尔值保存为 `0` 或 `1`。在编译器仓库运行 `./gradlew test --tests top.mcfpp.test.MniScoreMappingTest` 可检查生成与读写行为。
