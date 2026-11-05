---
lastUpdated: true
---

# MNIMutator: native property writes

`@MNIMutator("name")` marks a Kotlin property setter. `name` matches the MCFPP field. The method receives one `NativeCallContext`.

## Standard library example

The BossBar `max` setter uses this form:

```kotlin
package example.mni

import top.mcfpp.annotations.MNIMutator
import top.mcfpp.mni.NativeCallContext
import top.mcfpp.backend.NativeMinecraftCommandOperations

object BossBarWriteProperties {
    @JvmStatic
    @MNIMutator("max")
    fun setMax(context: NativeCallContext) {
        NativeMinecraftCommandOperations.bossbarSetMax(context)
    }
}
```

Imports are `top.mcfpp.annotations.MNIMutator`, `top.mcfpp.mni.NativeCallContext`, and `top.mcfpp.backend.NativeMinecraftCommandOperations`.

The context supplies the receiver and assigned value. The backend generates write commands for the property type.

A template property selects its provider class with `set = package.Provider`. The compiler matches `@MNIMutator` by field name. See [MNIAccessor](./mniaccessor) for reads.
