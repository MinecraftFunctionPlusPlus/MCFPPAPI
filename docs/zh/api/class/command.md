---
lastUpdated: true
---

# Command：组合命令

`top.mcfpp.command.Command` 保存命令片段。`Function.addCommand` 将完成的命令放入当前正在编译的函数。

```kotlin
package example.mni

import top.mcfpp.annotations.MNIFunction
import top.mcfpp.command.Command
import top.mcfpp.model.function.Function

object CommandMessages {
    @JvmStatic
    @MNIFunction
    fun ready() {
        val command = Command("say").build("Ready")
        Function.addCommand(command)
    }
}
```

上例生成 `say Ready`。`build(String)` 默认在片段前添加空格。`build(text, false)` 用于需要紧接前一个片段的位置。

| 操作 | 用途 |
| --- | --- |
| `Command(text)` | 创建第一个片段 |
| `build(text)` | 添加带空格的文本片段 |
| `build(text, false)` | 添加紧接的文本 |
| `build(otherCommand)` | 合并命令片段 |
| `Function.addCommand(command)` | 添加到当前函数 |

Kotlin 中传入命令正文，例如 `say Ready`。MCFPP 源码中的 `/say Ready` 由语言语法处理开头的斜杠。

运行时参数可涉及宏命令和实体选择器检查。实现这类操作时，使用匹配的后端或宏构造接口。固定文本命令可以直接采用上面的形式。

通过 [Dump IR](/zh/quickstart/01project/04build-and-ir) 检查最后写出的命令。
