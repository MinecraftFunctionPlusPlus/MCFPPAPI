---
lastUpdated: true
---

# MNIMember: member marker

`top.mcfpp.annotations.MNIMember` is a method marker retained at runtime. It has no configuration elements.

```java
import top.mcfpp.annotations.MNIMember;

public final class MemberMetadata {
    @MNIMember
    public static void marker() {
    }
}
```

This example shows annotation placement. Integration code that consumes the marker controls member discovery and registration.

Library authors declare structures with `data` fields and Java functions with [MNIFunction](./mnifunction). Use [MNIAccessor](./mniaccessor) and [MNIMutator](./mnimutator) for native properties. These declarations expose member names and types to callers.
