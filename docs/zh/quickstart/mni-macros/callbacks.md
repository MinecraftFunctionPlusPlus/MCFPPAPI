---
lastUpdated: true
---

# 宏回调：实现 repeat 循环

上一节生成整数加法。本节把用户写的一段 Lambda 放进生成的循环，实现 `repeat(times, body)`。

## 先确定调用效果

继续使用[已准备的宏库](./overview)。在 `main` 内调用：

```mcfpp
repeat(3) { index ->
    print(index)
}
print("Finished")
```

目标效果为依次显示 `0`、`1`、`2` 和 `Finished`。`times` 决定循环次数，`body` 是每轮执行的用户回调，`index` 从零开始。

## 完整 Java 实现

`example/macros/RepeatMacros.java`：

```java
package example.macros;

import java.util.List;
import top.mcfpp.annotations.MNIMacro;
import top.mcfpp.annotations.MacroParam;
import top.mcfpp.mni.api.*;

public final class RepeatMacros {
    @MNIMacro(params = {
        @MacroParam(name = "times", type = "int"),
        @MacroParam(name = "body", type = "(int)->void", mode = ParamMode.INLINE)
    }, returnType = "void")
    public static Block repeat(
            MacroContext context, Value<IntT> times, InlineFn<VoidT> body) {
        return context.quote().block(code -> {
            Local<IntT> index = code.local(
                "index", context.types().intType(), code.intLiteral(0));
            Local<IntT> limit = code.local(
                "limit", context.types().intType(), times.expr());
            code.whileLoop(
                condition -> condition.lt(index.load(), limit.load()),
                loop -> {
                    loop.inlineVoid(body, List.of(InlineArgument.value(index.load())));
                    loop.assign(index, loop.add(index.load(), loop.intLiteral(1)));
                });
        });
    }
}
```

## 先看参数，再看循环

| 参数或变量 | 用途 |
| --- | --- |
| `times: Value<IntT>` | 运行时重复次数 |
| `body: InlineFn<VoidT>` | 接收一个整数、无返回结果的用户回调 |
| `index` | 生成循环的当前序号，初始值为 `0` |
| `limit` | 保存此次调用的循环上限 |

注解中的 `"(int)->void"` 与源码 `{ index -> ... }` 对应。`INLINE` 表示编译器会把这段用户代码插入宏生成的代码中。

## 读懂 whileLoop 和 inlineVoid

`whileLoop` 接收两段 Java 构造逻辑：第一段生成 `index < limit` 条件，第二段生成循环体。

循环体先执行 `inlineVoid(body, ...)`，把用户回调放进当前位置。`InlineArgument.value(index.load())` 把当前序号作为回调的整数参数。随后，`assign` 生成序号加一的操作。

它生成的运行逻辑可以理解为：

```text
index = 0
limit = times
while (index < limit) {
    执行用户回调，传入 index
    index = index + 1
}
```

Java 构造这些代码发生在构建期间。`whileLoop` 生成的循环则在游戏中运行，所以 `times` 可以是运行时整数。

## 回调中的 return

```mcfpp
repeat(3) { index ->
    if (index == 1) {
        return
    }
    print(index)
}
print("Finished")
```

这里依次显示 `0`、`2` 和 `Finished`：

| 序号 | 用户回调的行为 | 循环接下来做什么 |
| --- | --- | --- |
| `0` | 显示 `0` | 序号加一 |
| `1` | `return` 结束本次回调 | 序号加一 |
| `2` | 显示 `2` | 序号加一，然后结束循环 |

循环递增属于宏自身，`return` 只结束当前这次插入的用户回调。

## 带结果的回调

编译器仓库中的 `examples/mni/repeat` 还提供累计重载：

```mcfpp
var total = repeat(3, 0) { sum, index -> sum + index }
print(total)
```

它的参数为重复次数、初始累计值和回调，结果为 `3`。回调签名是 `(int,int)->int`，Java 入口使用 `InlineFn<IntT>`。生成时通过 `inline` 取得回调结果，再保存为下一轮累计值。

完整累计实现位于 `examples/mni/repeat/provider/java/example/mnirepeat/JavaRepeatMacro.java`。处理普通列表时，可以直接使用内置的 [fold 和 foreach](../advanced/collections)。
