# class Command

top.mcfpp.command

## 概述

一条命令。在MCFPP编译过程中，一条命令可能会被分为多个命令片段，由接口`ICommandPart`实现。一个`Command`对象可以包含多个`CommandPart`对象。命令中的片段可以被字符串标签标记，从而能够对命令的某些片段进行替换操作。

要开始构建一个命令，可以使用`Command`的伴随对象中的`Command.build`方法，或者使用`Command(String)`构造函数。此后，可以继续通过链式调用成员方法`build(String)`或者`build(Command)`来添加命令片段，或者使用`build(command:String, pointID: String)`来在添加命令片段的同时，标记该片段的替换标签为`pointID`。

对于宏命令而言，可以使用成员方法`buildMacro(id: Var<*>)`来构建一个宏命令，其中`id`代表的变量就是要传递给宏的变量。随后，构建出的宏命令需要再使用`buildMacroFunction`方法将宏命令转换为宏函数来调用，从而提高宏命令的效率。此方法将会返回一个新的`Command`对象，即调用此宏函数的命令。

要替换命令中的一些片段，可以使用成员方法`replace(pointID: String, target: String)`或者`replace(pointID: String, target: Command)`。它将会把标记为`pointID`的片段替换为`target`。

## 例子

```kotlin
fun sbPlayerOperation(a: MCInt, operation: String, b: MCInt): Command {
        return Command.build("scoreboard players operation")
            .build(a.name,a.name)
            .build(a.sbObject.toString(),a.sbObject.toString())
            .build(operation,"operation")
            .build(b.name,b.name)
            .build(b.sbObject.toString(),b.sbObject.toString())
}
```

```kotlin
class XPredicate(val x: MCInt): EntitySelectorPredicate {
    override fun toCommandPart(): Command {
        return if(x is MCIntConcrete){
            Command.build("x=${x.value}")
        }else{
            Command.build("x=").buildMacro(x, false)
        }
    }

    override fun isConcrete(): Boolean = x is MCIntConcrete
}
```

```java
public static void print(@NotNull JsonText text){
    if(text instanceof JsonTextConcrete textC){
        Function.Companion.addCommand(new Command("tellraw @a").build(textC.getValue().toCommandPart(), true));
    }else {
        Function.Companion.addCommand(new Command("tellraw @a").build(text.toCommandPart(), true));
    }
}
```
