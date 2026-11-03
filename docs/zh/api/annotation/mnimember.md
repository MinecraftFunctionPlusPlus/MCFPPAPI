---
lastUpdated: true
---

# MNIMember：成员标记

`top.mcfpp.annotations.MNIMember` 是运行时保留的方法标记，定义中没有配置元素。

```java
import top.mcfpp.annotations.MNIMember;

public final class MemberMetadata {
    @MNIMember
    public static void marker() {
    }
}
```

这个例子展示注解的位置。具体成员的发现和注册由使用该标记的集成代码负责。

普通库作者使用 `data` 字段声明数据结构，使用 [MNIFunction](./mnifunction) 声明 Java 函数，使用 [MNIAccessor](./mniaccessor) 和 [MNIMutator](./mnimutator) 实现原生属性。这样调用者可以从 MCFPP 声明中看到成员和类型。
