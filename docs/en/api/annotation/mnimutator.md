---
lastUpdated: true
---

# MNIMutator: native property writes

`@MNIMutator("name")` marks a Java property setter. `name` matches the MCFPP field. The method receives one `NativeCallContext`.

## Standard library example

The BossBar `max` setter uses this form:

```java
@MNIMutator("max")
public static void setMax(NativeCallContext context) {
    NativeMinecraftCommandOperations.INSTANCE.bossbarSetMax(context);
}
```

Imports are `top.mcfpp.annotations.MNIMutator`, `top.mcfpp.mni.NativeCallContext`, and `top.mcfpp.backend.NativeMinecraftCommandOperations`.

The context supplies the receiver and assigned value. The backend generates write commands for the property type.

A template property selects its provider class with `set = package.Provider`. The compiler matches `@MNIMutator` by field name. See [MNIAccessor](./mniaccessor) for reads.
