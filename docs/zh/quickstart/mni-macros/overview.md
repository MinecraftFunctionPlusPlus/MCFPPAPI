---
lastUpdated: true
---

# MNI 宏入门：把一次调用变成代码

上一组教程让 Java 入口提供值或命令。宏进一步把**一段待执行的代码**作为结果交给编译器。例如，`addOne(score)` 可以生成“读取分数，加一，再把结果交给调用者”的代码。

本组教程面向宏库作者。先熟悉 [Java MNI 入门](../09mni/01mni-framework)与 [Lambda](../04function/05lambda)，再从本页的单个表达式开始。

## 准备宏库与调用环境

宏开发包含两个步骤：实现 Java 入口，再把入口加入宏库的加载流程。加载后的函数具有 MCFPP 名字，源码才能找到它。

普通 MNI 工程可以编译本组的 Java 类。当前 CLI 的工程模板提供 `@MNIFunction` 绑定，宏的登记则通过库加载接口完成。体验已有宏时，可以使用编译器仓库中的完整示例：

| 示例 | Java 与 Kotlin 实现 | 源码用途 |
| --- | --- | --- |
| 重复执行 | `examples/mni/repeat` | 按序号调用用户回调 |
| 射线检测 | `examples/mni/raycast` | 沿朝向检查方块 |
| 字段与计分板同步 | `examples/mni/score-mapping` | 生成模板的 `load`、`save` 方法 |

仓库中的 `src/test/kotlin/top/mcfpp/test/MniRepeatTest.kt` 展示了入口准备、源码调用和生成命令检查。在编译器仓库根目录运行：

```sh
./gradlew test --tests top.mcfpp.test.MniRepeatTest
```

Windows 使用 `gradlew.bat`。该测试检查 `repeat` 的调用、回调和循环。Java MNI 工程自身的测试步骤见 [Gradle 与 Java 测试](../10gradle/01gradle-configuration)。

## 实现一个加一宏

在宏库中创建 `example/macros/ScoreMacros.java`：

```java
package example.macros;

import top.mcfpp.annotations.MNIMacro;
import top.mcfpp.annotations.MacroParam;
import top.mcfpp.mni.api.*;

public final class ScoreMacros {
    @MNIMacro(
        params = {@MacroParam(name = "value", type = "int")},
        returnType = "int"
    )
    public static Expr<IntT> addOne(MacroContext context, Value<IntT> value) {
        return context.quote().expression(context.types().intType(), code -> {
            code.yield(code.add(value.expr(), code.intLiteral(1)));
        });
    }
}
```

先看 Java 方法的输入和输出：

| Java 类型 | 本例中表示什么 |
| --- | --- |
| `MacroContext` | 为这次宏调用提供代码构造、类型和诊断服务 |
| `IntT` | 宏 API 中的整数类型标记 |
| `Value<IntT>` | 调用方传入的整数值 |
| `Expr<IntT>` | 执行后会产出整数的代码 |

`IntT` 只标记类型。实际输入由 `Value<IntT>` 表示，待生成的结果由 `Expr<IntT>` 表示。它们与普通 MNI 的 `MCInt` 分别属于两套入口接口。

## 读懂构造代码的三步

1. `quote().expression(intType, ...)` 开始构造一段结果为整数的代码。
2. `code.add(value.expr(), code.intLiteral(1))` 创建加法，两个输入是传入值和整数 `1`。
3. `code.yield(...)` 指定这段代码的结果。

`code -> { ... }` 是一个 Java 回调。编译器在构建时通过它建立代码结构。Java 方法返回的是代码对象，游戏执行这些代码后才得到整数结果。

在已加载此宏的工程中，`main` 内可以写：

```mcfpp
external score: int = 10
print(addOne(score))
```

运行后显示 `11`。构建时读取注解和生成加法，游戏运行时读取 `score` 并执行加法。

## 让宏具有可调用的名字

`@MNIMacro` 默认使用 Java 方法名作为源码名字，所以这里叫 `addOne`。`params` 给出源码参数名和类型，`returnType` 给出源码返回类型。

**登记**指把这些名字和入口方法加入一个 MCFPP 命名空间。宏库的加载代码负责这个步骤，调用方再按该库的命名空间规则导入函数。当前 CLI 尚无单独的宏登记配置项；库作者可以参考上述仓库测试中的加载流程。

普通 MNI 的 `func ... = package.Class.method` 对应 `@MNIFunction` 入口。本组宏的调用使用宏库已经登记的名字。

## 阅读顺序

1. [参数和表达式](./parameters)：区分运行时输入与构建时常量。
2. [循环和回调](./callbacks)：实现带用户代码的 `repeat`。
3. [实体、位置和计分板](./minecraft)：让宏生成 Minecraft 操作。
4. [诊断、辅助函数和资源](./services)：组织一个宏库。
5. [模板处理器](./declarations)：根据声明生成方法。

需要观察生成过程时，使用 `mcfpp build --dump-ir`，并按 [IR 说明](../01project/04build-and-ir)查看输出。
