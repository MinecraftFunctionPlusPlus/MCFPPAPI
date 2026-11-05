---
lastUpdated: true
---

# 从 Kotlin 原生入口生成命令

原生入口可以在构建时添加命令。下面的 `ready()` 使生成的数据包发送一条消息。

`src/main/kotlin/example/mni/Messages.kt`:

```kotlin
package example.mni

import top.mcfpp.annotations.MNIFunction
import top.mcfpp.model.function.Function

object Messages {
    @JvmStatic
    @MNIFunction
    fun ready() {
        Function.addCommand("say MNI is ready")
    }
}
```

`src/main/mcfpp/main.mcfpp`:

```mcfpp
func ready() = example.mni.Messages.ready

func main() {
    ready()
}
```

执行 `mcfpp build`，加载数据包并调用 main，预期执行 `say MNI is ready`。`Function.addCommand` 接收不带 `/` 的命令正文；选择器与坐标使用命令执行时的上下文。

Kotlin 的 if 根据构建时数据决定生成哪些命令。MCFPP 的 if 控制游戏运行时是否执行生成的分支。

此页面使用原生接口，可访问编译器命令对象。结构化宏使用 `MacroContext` 和 `CodeScope`，通过 DSL 构造表达式、循环与上下文操作。见 [Kotlin 宏](../mni-macros/overview)、[Minecraft 操作](../mni-macros/minecraft)和 [Command API](/zh/api/class/command)。
