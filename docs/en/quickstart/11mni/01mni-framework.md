---
lastUpdate: true
---

# MNI Framework

The MNI (Minecraft Native Implement) Framework is a feature provided by MCFPP that enables interaction between the compiler and the JVM during the compilation process. MNI allows developers to call Java methods within MCFPP or use Java to implement functions in MCFPP. It is somewhat similar to JNI in Java but much simpler and easier to use.

Many functions in MCFPP are implemented using MNI, such as the `print` function. Below is an example showing how the `print` function is implemented using MNI.

```mcfpp
# Define the print function and its overload
func print(int i) = top.mcfpp.lang.System.print;
func print(any a) = top.mcfpp.lang.System.print;
```

```java
// Java implementation of the print function
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
            //It's concrete and output the value directly.
            Function.Companion.addCommand("tellraw @a " + varC.getValue());
        }else {
            Function.Companion.addCommand("tellraw @a " + new ScoreChatComponent(var).toCommandPart());
        }
    }
}
```

In the following sections, we will discuss in detail how to use the MNI framework.
