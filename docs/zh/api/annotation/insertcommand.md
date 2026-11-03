---
lastUpdated: true
---

# InsertCommand：命令生成标记

`@InsertCommand` 标记会生成命令的 Java 方法或构造函数。注解保留到运行时，供编译器开发工具和诊断使用。

```java
package example.mni;

import top.mcfpp.annotations.InsertCommand;
import top.mcfpp.annotations.MNIFunction;
import top.mcfpp.model.function.Function;

public final class Messages {
    @InsertCommand
    @MNIFunction
    public static void ready() {
        Function.addCommand("say Ready");
    }
}
```

MNI 绑定由 `@MNIFunction` 和 MCFPP 原生声明确定。命令由 `Function.addCommand` 添加。`@InsertCommand` 记录方法的用途。

完整调用步骤见[从 Java 生成命令](/zh/quickstart/09mni/05access)。组合多个命令片段时，使用 [Command](../class/command)。
