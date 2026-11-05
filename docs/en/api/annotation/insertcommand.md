---
lastUpdated: true
---

# InsertCommand: command generation marker

`@InsertCommand` marks a Kotlin method or constructor that generates commands. The annotation remains available at runtime for compiler tools and diagnostics.

```kotlin
package example.mni

import top.mcfpp.annotations.InsertCommand
import top.mcfpp.annotations.MNIFunction
import top.mcfpp.model.function.Function

object MarkedMessages {
    @JvmStatic
    @InsertCommand
    @MNIFunction
    fun ready() {
        Function.addCommand("say Ready")
    }
}
```

`@MNIFunction` and the MCFPP declaration define the native binding. `Function.addCommand` adds the command. `@InsertCommand` records the method's purpose.

See [Generate commands from Kotlin](/en/quickstart/11mni/05access) for a complete call. Use [Command](../class/command) to compose fragments.
