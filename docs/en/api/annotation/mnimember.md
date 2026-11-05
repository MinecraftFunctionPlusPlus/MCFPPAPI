---
lastUpdated: true
---

# MNIMember: member marker

`top.mcfpp.annotations.MNIMember` is a method marker retained at runtime. It has no configuration elements.

```kotlin
package example.mni

import top.mcfpp.annotations.MNIMember

object MemberMetadata {
    @JvmStatic
    @MNIMember
    fun marker() {}
}
```

This example shows annotation placement. Integration code that consumes the marker controls member discovery and registration.

Library authors declare structures with `data` fields and Kotlin/JVM native functions with [MNIFunction](./mnifunction). Use [MNIAccessor](./mniaccessor) and [MNIMutator](./mnimutator) for native properties. These declarations expose member names and types to callers.
