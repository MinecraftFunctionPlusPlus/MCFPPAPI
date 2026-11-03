---
lastUpdated: true
---

# MNIAccessor：原生属性读取

`@MNIAccessor("name")` 标记一个属性的 Java getter。`name` 与 MCFPP 字段名一致，Java 方法接收单个 `NativeCallContext`。

## 标准库示例

BossBar 的 `max` 读取入口采用以下形式：

```java
@MNIAccessor("max")
public static void getMax(NativeCallContext context) {
    NativeMinecraftCommandOperations.INSTANCE.bossbarGetMax(context);
}
```

相关导入为 `top.mcfpp.annotations.MNIAccessor`、`top.mcfpp.mni.NativeCallContext` 和 `top.mcfpp.backend.NativeMinecraftCommandOperations`。

上下文提供属性接收者。后端生成读取命令，并向上下文提交属性类型的结果。这个例子展示标准库 BossBar 后端的转发方式。

模板属性用 `get = package.Provider` 选择原生提供类。编译器在类中查找名称匹配的 `@MNIAccessor` 方法。写入接口见 [MNIMutator](./mnimutator)。
