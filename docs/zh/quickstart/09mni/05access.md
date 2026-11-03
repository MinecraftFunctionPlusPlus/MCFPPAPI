---
lastUpdated: true
---

# 从 Java 生成 Minecraft 命令

上一节通过返回值交付整数。本节让 Java 入口生成一个操作：游戏调用 `ready()` 时发送消息。

## 完整实现

`src/main/java/example/mni/Messages.java`：

```java
package example.mni;

import top.mcfpp.annotations.MNIFunction;
import top.mcfpp.model.function.Function;

public final class Messages {
    @MNIFunction
    public static void ready() {
        Function.addCommand("say MNI is ready");
    }
}
```

`src/main/mcfpp/main.mcfpp`：

```mcfpp
func ready() = example.mni.Messages.ready

func main() {
    ready()
}
```

执行 `mcfpp build`，加载生成的数据包，再调用 `main`。游戏将执行 `say MNI is ready`。

## 两个阶段发生什么

构建时，编译器处理源码中的 `ready()` 调用，并执行 Java 方法 `Messages.ready`。`Function.addCommand` 把一条命令放进当前生成的函数。

游戏运行时，Minecraft 执行这条已生成的命令。每次调用 `main` 都会执行它。Java 入口在构建时完成工作。

`Function.addCommand` 接收命令正文，字符串从 `say` 等命令名称开始。命令中的选择器和坐标以实际运行时的执行上下文为准。

## Java 条件与游戏条件

源码中的条件控制游戏运行时是否执行命令。例如，把上面的 `main` 改为：

```mcfpp
func ready() = example.mni.Messages.ready

func main() {
    external enabled: bool = true
    if (enabled) {
        ready()
    }
}
```

编译器在构建时处理这条调用，把命令放入对应分支。游戏执行时，`enabled` 决定是否进入分支。

如果在 Java 入口中写 Java `if`，它根据构建时 Java 能取得的数据选择要生成哪些命令。这适合读取工程配置后选择固定内容。

## 什么时候使用这种入口

固定命令可以直接写在 [MCFPP 源码](../02base/05original-command)中。需要复用 Java 库、读取构建配置或整理资源时，可以用 MNI 完成这些工作，并输出命令。

需要组合命令片段时，查看 [Command API](/zh/api/class/command)。需要生成循环、表达式或插入用户回调时，继续阅读 [MNI 宏框架](../mni-macros/overview)。
