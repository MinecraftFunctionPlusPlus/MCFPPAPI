---
lastUpdated: true
---

# MNIAccessor: native property reads

`@MNIAccessor("name")` marks a Kotlin property getter. `name` matches the MCFPP field. The method receives one `NativeCallContext`.

## Standard library example

The BossBar `max` getter uses this form:

```kotlin
package example.mni

import top.mcfpp.annotations.MNIAccessor
import top.mcfpp.mni.NativeCallContext
import top.mcfpp.backend.NativeMinecraftCommandOperations

object BossBarReadProperties {
    @JvmStatic
    @MNIAccessor("max")
    fun getMax(context: NativeCallContext) {
        NativeMinecraftCommandOperations.bossbarGetMax(context)
    }
}
```

Imports are `top.mcfpp.annotations.MNIAccessor`, `top.mcfpp.mni.NativeCallContext`, and `top.mcfpp.backend.NativeMinecraftCommandOperations`.

The context supplies the receiver. The backend generates a read command and publishes a result with the property type. This example forwards to the standard library BossBar backend.

A template property selects the provider class with `get = package.Provider`. The compiler finds the `@MNIAccessor` method with the matching field name. See [MNIMutator](./mnimutator) for writes.
