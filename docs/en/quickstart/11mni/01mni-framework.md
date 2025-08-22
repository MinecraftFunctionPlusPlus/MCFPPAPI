---
lastUpdate: true
---

# MNI Framework

The MNI (Minecraft Native Implement) Framework is a feature provided by MCFPP that enables interaction between the compiler and the JVM during the compilation process. MNI allows developers to call Java methods within MCFPP or use Java to implement functions in MCFPP. It is somewhat similar to JNI in Java but much simpler and easier to use.

Many functions in MCFPP are implemented using MNI, such as the `print` function. Below is an example showing how the `print` function is implemented using MNI.

```mcfpp
# Define the print function and its overload
func print(i as text) = top.mcfpp.mni.System.print;
```

```java
// Java implementation of the print function
package top.mcfpp.mni;

//import ...

public class System {
    @InsertCommand
    @MNIFunction(normalParams = {"text"})
    public static void print(@NotNull JsonText text){
        if(text instanceof JsonTextConcrete textC){
            Function.addCommand(new Command("tellraw @a").build(textC.getValue().toCommandPart()));
        }else {
            Function.addCommand(new Command("tellraw @a").build(text.toCommandPart()));
        }
    }
}
```

In the following sections, we will discuss in detail how to use the MNI framework.
