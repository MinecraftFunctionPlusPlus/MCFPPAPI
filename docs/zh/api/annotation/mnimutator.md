---
lastUpdated: true
---

# MNIMutator：原生属性写入

`@MNIMutator("name")` 标记一个属性的 Java setter。`name` 与 MCFPP 字段名一致，Java 方法接收单个 `NativeCallContext`。

## 标准库示例

BossBar 的 `max` 写入入口采用以下形式：

```java
@MNIMutator("max")
public static void setMax(NativeCallContext context) {
    NativeMinecraftCommandOperations.INSTANCE.bossbarSetMax(context);
}
```

相关导入为 `top.mcfpp.annotations.MNIMutator`、`top.mcfpp.mni.NativeCallContext` 和 `top.mcfpp.backend.NativeMinecraftCommandOperations`。

上下文提供属性接收者和待写入值。后端按属性类型生成写入命令。

模板属性用 `set = package.Provider` 选择原生提供类。编译器按字段名查找 `@MNIMutator` 方法。读取接口见 [MNIAccessor](./mniaccessor)。
