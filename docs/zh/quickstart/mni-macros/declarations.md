---
lastUpdated: true
---

# 模板处理器：为 data 生成方法

表达式宏处理一次函数调用。模板处理器处理一个 `data` 声明，并为它增加方法。例如，可以根据字段生成 `load()` 和 `save()`。

本节先生成一个固定返回 `42` 的 `answer()` 方法，再解释字段同步案例。

## 处理器在什么时候工作

| 阶段 | 编译器做什么 |
| --- | --- |
| 读取模板声明 | 收集字段、方法和注解 |
| 调用 `TemplateProcessor` | 把模板信息交给 Java 实现 |
| 接收生成内容 | 将新增方法加入模板 |
| 编译普通源码调用 | 检查并编译 `reward.answer()` 等调用 |

因此，处理器可以根据“有哪些字段”决定生成哪些方法。实例在游戏中运行时，执行的是这些方法已经生成的命令。

## 完整的处理器类

`example/macros/AnswerProcessor.java`：

```java
package example.macros;

import java.util.List;
import top.mcfpp.mni.api.*;

public final class AnswerProcessor implements TemplateProcessor {
    @Override
    public DeclarationEdits expand(DeclarationContext context, TemplateView template) {
        FunctionSignature<IntT> signature = FunctionSignature.of(
            List.of(), context.types().intType());
        MethodEdit answer = context.declarations().method(
            template.type(), "answer", signature,
            method -> {
                CodeBuilder code = method.builder();
                code.yield(code.intLiteral(42));
            });
        return context.declarations().edits(List.of(answer));
    }
}
```

按输入和输出阅读 `expand`：

| 名称 | 本例中的用途 |
| --- | --- |
| `template` | 读取当前数据模板的信息 |
| `context` | 提供生成方法和诊断等服务 |
| `signature` | 描述 `answer(): int` |
| `answer` | 保存一项“新增 answer 方法”的生成结果 |
| `DeclarationEdits` | 将本次要增加的内容交给编译器 |

`template.type()` 指明新方法属于哪个模板。`declarations().method(...)` 创建公开实例方法。`method.builder()` 取得方法体的代码构造接口，`yield(intLiteral(42))` 提供结果。

## 把注解与处理器关联起来

宏库的加载代码使用 `namespace.registerTemplateProcessor(annotationName, processorClass)` 登记关联。例如，让命名空间中的 `Answer` 注解对应 `AnswerProcessor`。

完成这个准备步骤后，调用方可以声明：

```mcfpp
@Answer
data Reward {}

func inspectReward() {
    var reward = Reward()
    print(reward.answer())
}
```

调用 `inspectReward` 后显示 `42`。`answer` 来自处理器生成的公开方法。注解与库加载的关系见[宏入门](./overview#让宏具有可调用的名字)。

## 读取字段，生成实例读写

`TemplateView` 提供这些信息：

| 接口 | 内容 |
| --- | --- |
| `fields()` | 字段名称、类型、可写性和源码位置 |
| `fieldDeclarations()` | 字段所属类型、访问级别、可空性和注解 |
| `methods()` | 方法名、签名、只读参数和修饰符 |
| `annotations()` | 模板注解名称及常量参数 |
| `source()` | 模板声明的位置 |

生成实例方法时，`method.self()` 表示当前实例。`code.fieldRef(method.self(), field)` 选中它的一个字段，随后可以通过 `assign` 写入。

把新行为放进新方法中。原有可见方法继续保持自身定义，编译器检查字段访问和参数类型。

## 完整案例：字段与计分板同步

编译器仓库 `examples/mni/score-mapping` 中的库使用 `@ScoreMapping` 指定固定计分持有者，用 `@Score` 指定字段对应的计分板：

```mcfpp
@ScoreMapping("#scores")
data Player {
    @Score("health_hp")
    var health: int = 0

    @Score("state_alive")
    var alive: bool = false
}

func inspectPlayer() {
    var player = Player()
    player.health = 7
    player.alive = true
    player.save()

    player.health = 0
    player.alive = false
    player.load()
    print(player.health)
    print(player.alive)
}
```

使用这个示例库时，先在游戏中创建 `health_hp` 和 `state_alive` 两个 `dummy` 计分板。调用 `inspectPlayer` 后，`save` 将字段保存为分数，`load` 再读回，结果为 `7` 和 `true`。

`load`、`save` 都由处理器生成。整数保存原值，布尔值保存为 `0` 或 `1`。Java 实现位于 `examples/mni/score-mapping/provider/java/example/mniscore/JavaScoreMappingProcessor.java`。

在编译器仓库根目录运行 `./gradlew test --tests top.mcfpp.test.MniScoreMappingTest`，可以检查这个案例的生成与读写行为。
