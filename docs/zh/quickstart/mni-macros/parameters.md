---
lastUpdated: true
---

# 宏参数：传值、常量和可写位置

本节继续使用[上一节准备的宏库](./overview)。先实现 `addConstant(value, amount)`：输入一个运行时整数和一个固定增量，生成两者相加的代码。

## 先看源码调用

在已加载该宏的工程中，调用可以写成：

```mcfpp
external score: int = 10
print(addConstant(score, 5))
```

`score` 可以在游戏中变化，`5` 在构建时确定。宏把这两种输入分别声明为 `VALUE` 和 `CONST`。

这里两个参数都写在圆括号中。`CONST` 是宏对该输入提出的要求；源码[只读参数](../07generic/01concrete_var)则使用尖括号。

## 完整 Java 实现

`example/macros/ConstantMacros.java`：

```java
package example.macros;

import top.mcfpp.annotations.MNIMacro;
import top.mcfpp.annotations.MacroParam;
import top.mcfpp.mni.api.*;

public final class ConstantMacros {
    @MNIMacro(params = {
        @MacroParam(name = "value", type = "int"),
        @MacroParam(name = "amount", type = "int", mode = ParamMode.CONST)
    }, returnType = "int")
    public static Expr<IntT> addConstant(
            MacroContext context, Value<IntT> value, Const<IntT> amount) {
        int step = amount.intValue();
        return context.quote().expression(context.types().intType(), code -> {
            Local<IntT> result = code.local(
                "result", context.types().intType(), value.expr());
            code.assign(result, code.add(result.load(), code.intLiteral(step)));
            code.yield(result.load());
        });
    }
}
```

## VALUE：生成读取输入的代码

`value` 的类型为 `Value<IntT>`。它可以来自运行时分数，`value.expr()` 提供读取这个输入的表达式。

调用方先求值并绑定实参。之后多次使用 `value.expr()` 都引用同一份已绑定的输入。例如，实参来自一个函数调用时，宏重复使用输入会读取其绑定结果。

## CONST：让 Java 直接读取常量

`amount` 的类型为 `Const<IntT>`。`amount.intValue()` 在构建时取得普通 Java 整数，本例为 `5`。

Java 代码可以使用这个整数选择生成内容。例如，固定重复次数可以决定构造多少段代码。宏登记中的 `mode = ParamMode.CONST` 让编译器在调用入口前检查实参是否已知。

`step` 是 Java 数据，`code.intLiteral(step)` 则把它放进待生成的代码。

## Local：为生成代码创建变量

本例的 `result` 是 `Local<IntT>`，对应生成程序中的一个局部整数：

| 操作 | 本例中的效果 |
| --- | --- |
| `local("result", intType, value.expr())` | 创建局部变量，并用输入初始化 |
| `result.load()` | 读取局部变量 |
| `assign(result, expression)` | 把表达式结果写入局部变量 |
| `yield(result.load())` | 将最终整数作为宏调用结果 |

生成代码的含义可以写成下面的 MCFPP 片段：

```text
var result = score
result = result + 5
// 把 result 作为 addConstant(score, 5) 的结果
```

Java 的 `step + 1` 计算构建阶段的整数。`code.add` 创建生成程序中的加法。根据数据发生作用的阶段选择相应接口。

## REF：操作一个可写位置

`Ref<T>` 表示编译器已经提供的可写位置，例如上面的局部变量或 `minecraft.score(...)` 返回的计分项。`load()` 读它，`assign` 写它。

`ScoreRef` 与 `NBTRef<T>` 是源码中的游戏地址值，调用方可以保存和传递。它们与宏的 `Ref<T>` 分别用于源码接口和代码构造。游戏地址的使用见[地址引用](../02base/06references)。

## 四种参数模式

| 模式 | Java 参数 | 接收的内容 |
| --- | --- | --- |
| `VALUE` | `Value<T>` | 一个已经绑定的值 |
| `CONST` | `Const<T>` | 构建时已知的值 |
| `REF` | `Ref<T>` | 可读写的位置 |
| `INLINE` | `InlineFn<S>` | 待插入生成代码的用户回调 |

`VALUE` 是默认模式。下一节专门介绍 [INLINE 回调和循环](./callbacks)。
