---
lastUpdated: true
---

# Generate commands from a Kotlin native entry

A native entry can append commands during compilation. This `ready()` entry makes the generated datapack send a message.

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

Build with `mcfpp build`, load the datapack, and call main. It executes `say MNI is ready`. `Function.addCommand` takes the command body without `/`; selectors and coordinates use the runtime execution context.

Kotlin if selects generated content using build-time data. MCFPP if controls which generated branch executes at runtime.

This page uses the native interface, which exposes compiler command objects. Structured macros use `MacroContext` and `CodeScope` to build expressions, loops, and context operations. See [Kotlin macros](../mni-macros/overview), [Minecraft operations](../mni-macros/minecraft), and the [Command API](/en/api/class/command).
