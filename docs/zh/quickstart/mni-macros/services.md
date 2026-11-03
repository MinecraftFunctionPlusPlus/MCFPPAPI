---
lastUpdated: true
---

# 组织宏：诊断、辅助函数与资源

当宏开始包含多步计算时，`MacroContext` 还提供三类服务：报告源码问题、创建可复用的辅助函数、为数据包申请资源。本节分别解释，再把辅助函数和计分板组合为一个完整例子。

## 在调用处报告问题

假设[参数教程](./parameters)中 `ConstantMacros` 的固定增量应当大于或等于零。紧接 `int step = amount.intValue();` 加入：

```java
if (step < 0) {
    context.diagnostics().error(
        context.callSite(), "Amount must be zero or greater.");
}
```

`callSite()` 给出 MCFPP 源码中此次调用的位置。错误会定位到调用处。`error` 标记本次宏展开失败，编译器会丢弃这次生成的内容。需要提示但允许继续构建时，使用 `warning`。

## 辅助函数解决什么问题

宏可以让多个生成位置调用同一个辅助函数。创建时要提供：

1. 函数名称提示，例如 `baseReward`。
2. 参数和结果类型组成的 `FunctionSignature`。
3. 用代码构造接口编写的函数体。

创建结果 `FunctionRef<T>` 表示可调用的函数。`code.call(function, arguments)` 生成一次调用。辅助函数使用自己的参数取得数据，调用处明确传入所需值。

## 为什么让编译器分配资源名字

假设宏需要一个计分板保存结果。多个源码调用可能各自需要存储位置。`resources().reserve(...)` 让编译器分配彼此区分的名称，并生成资源初始化内容。

申请计分板时，`ResourceKind.OBJECTIVE` 指定资源种类。`ResourceData` 描述计分规则，例如 `criteria = "dummy"`。返回的 `ResourceRef.name()` 是实际名称。

## 完整例子：计算并保存奖励

`recordReward(bonus)` 调用一个提供基础奖励 `10` 的辅助函数，加上 `bonus`，再把结果保存在自己申请的计分板中。

`example/macros/RewardMacros.java`：

```java
package example.macros;

import java.util.List;
import java.util.Map;
import top.mcfpp.annotations.MNIMacro;
import top.mcfpp.annotations.MacroParam;
import top.mcfpp.mni.api.*;

public final class RewardMacros {
    @MNIMacro(params = {
        @MacroParam(name = "bonus", type = "int")
    }, returnType = "int")
    public static Expr<IntT> recordReward(MacroContext context, Value<IntT> bonus) {
        FunctionSignature<IntT> signature = FunctionSignature.of(
            List.of(), context.types().intType());
        FunctionRef<IntT> base = context.helpers().define(
            "baseReward", signature,
            (code, parameters) -> code.yield(code.intLiteral(10)));
        ResourceRef objective = context.resources().reserve(
            ResourceKind.OBJECTIVE, "reward",
            ResourceData.of(ConstantValue.record(
                Map.of("criteria", ConstantValue.text("dummy")))));
        return context.quote().expression(context.types().intType(), code -> {
            Ref<IntT> saved = code.minecraft().score(
                ScoreHolder.named("#reward"), objective.name());
            code.assign(saved, code.add(code.call(base, List.of()), bonus.expr()));
            code.yield(saved.load());
        });
    }
}
```

在已加载该宏的工程中，`print(recordReward(5))` 显示 `15`。

可以按下面的顺序阅读实现：

| 步骤 | 代码位置 | 做什么 |
| --- | --- | --- |
| 1 | `FunctionSignature.of(...)` | 声明无参数、返回整数的辅助函数 |
| 2 | `helpers().define(...)` | 生成返回 `10` 的函数体 |
| 3 | `resources().reserve(...)` | 申请 `dummy` 计分板 |
| 4 | `score(ScoreHolder.named("#reward"), ...)` | 选中该计分板上的固定持有者 |
| 5 | `call`、`add`、`assign` | 调用、相加并写入 |
| 6 | `yield` | 把保存的整数作为宏调用结果 |

`"#reward"` 是固定计分持有者，所以这个例子可以独立于玩家身份工作。

## 资源描述中的数据

`ConstantValue` 提供整数、布尔值、文本、序列和记录。`ConstantValue.record(...)` 创建字段记录，`ResourceData.of(...)` 将记录作为资源描述交给编译器。

| 可申请资源 | 描述中的主要字段 |
| --- | --- |
| `OBJECTIVE` | `criteria`，如 `"dummy"` |
| `STORAGE` | `initial`，描述初始结构化数据 |

资源和生成代码在宏成功后一起提交。生成辅助函数使用 `helpers().define`。需要定位相关源码与命令时，查看[构建 IR](../01project/04build-and-ir)。

下一节介绍[模板处理器](./declarations)，把同一套代码构造接口用于生成数据模板方法。
