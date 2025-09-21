---
lastUpdate: true
---

# MNI框架

MNI框架（Minecraft Native Implement Framework）是MCFPP提供的一个在编译过程中与JVM虚拟机交互的逻辑。MNI允许开发者在mcfpp中调用Java方法，或者使用Java实现MCFPP函数的功能。MNI和Java中的JNI较为类似，但是比JNI更加简洁易用。

在MCFPP中，有大量的函数都是通过MNI实现的，例如`print`函数。下面是一个例子，展示`print`函数利用MNI的实现过程。

```mcfpp
#定义print函数以及它的重载
func print(i as text) = top.mcfpp.mni.System.print;
```

```java
//print函数在java中的具体实现
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

在接下来的章节中，我们将会详细介绍MNI框架的使用方法。
