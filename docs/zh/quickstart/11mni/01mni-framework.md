---
lastUpdate: true
---

# MNI框架

MNI框架（Minecraft Native Implement Framework）是MCFPP提供的一个在编译过程中与JVM虚拟机交互的逻辑。MNI允许开发者在mcfpp中调用Java方法，或者使用Java实现MCFPP函数的功能。MNI和Java中的JNI较为类似，但是比JNI更加简洁易用。

在MCFPP中，有大量的函数都是通过MNI实现的，例如`print`函数。下面是一个例子，展示`print`函数利用MNI的实现过程。

```mcfpp
#定义print函数以及它的重载
func print(int i) = top.mcfpp.lang.System.print;
func print(any a) = top.mcfpp.lang.System.print;
```

```java
//print函数在java中的具体实现
package top.mcfpp.lang;

import org.jetbrains.annotations.NotNull;
import top.mcfpp.annotations.InsertCommand;
import top.mcfpp.annotations.MNIRegister;
import top.mcfpp.command.Command;
import top.mcfpp.core.lang.*;
import top.mcfpp.lib.ScoreChatComponent;
import top.mcfpp.model.function.Function;
import top.mcfpp.util.NBTUtil;
import top.mcfpp.util.ValueWrapper;

public class System extends MNIMethodContainer {
    
    @InsertCommand
    @MNIRegister(normalParams = {"any a"})
    public static void print(@NotNull Var<?> value){
        Function.Companion.addCommand("tellraw @a " + "\"" + value + "\"");
    }

    @InsertCommand
    @MNIRegister(normalParams = {"int i"})
    public static void print(@NotNull MCInt var) {
        if (var instanceof MCIntConcrete varC) {
            //是确定的，直接输出数值
            Function.Companion.addCommand("tellraw @a " + varC.getValue());
        }else {
            Function.Companion.addCommand("tellraw @a " + new ScoreChatComponent(var).toCommandPart());
        }
    }
}
```

在接下来的章节中，我们将会详细介绍MNI框架的使用方法。
