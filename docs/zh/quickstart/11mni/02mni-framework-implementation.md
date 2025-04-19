---
lastUpdate: true
---

# MNI函数

## 声明

如果我们想要声明一个函数的具体实现逻辑是由Java代码实现的，我们就需要将它声明为**Native函数**。Native函数的声明格式如下：

```mcfpp
func 函数名(参数列表) = Java类名.函数名;
```

例如我们刚刚例子中提到的`print`函数，它的声明是：

```mcfpp
func print(int i) = top.mcfpp.lang.System.print;
```

它表示，print函数拥有一个int类型的参数，同时它的逻辑交给了`top.mcfpp.lang.System`类的`print`函数来实现。注意这里的类名需要是完全限定名，需要包含包名，否则编译器将无法找到这个类。

## 实现

`System`类被称为**MNI实现类**，`print`函数的具体逻辑就是在这个类中实现的。通过使用`@MNIRegister`注解，我们可以将一个Java函数注册为MNI实现函数。这个注解的源码如下，它的参数在注释中已经有详细的解释。

```java
package top.mcfpp.annotations;

//import ...

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MNIRegister {

    /**
     * 只读参数。格式是类型+空格+参数名
     */
    String[] readOnlyParams() default {};

    /**
     * 普通参数。格式是类型+空格+参数名
     */
    String[] normalParams() default {};

    /**
     * 调用者类型。默认为void
     */
    String caller() default "void";

    /**
     * 函数的返回类型。默认为void
     */
    String returnType() default "void";

    /**
     * 是否重写了父类中的函数。默认为false
     */
    boolean override() default false;

}
```

而具体实现用的这个Java函数的参数顺序，遵循：`只读参数 + 普通参数 + 调用者 + ValueWrapper<返回值类型>`的原则。

我们回到刚刚的例子：

```mcfpp
func print(a as any) = top.mcfpp.lang.System.print;
```

```java
    //...

    @MNIRegister(normalParams = {"any a"})
    public static void print(@NotNull Var<?> value){
        Function.Companion.addCommand("tellraw @a " + "\"" + value + "\"");
    }

    //...
```

`print`函数有一个`any`类型的变量，因此注解中，我们使用`normalParams = {"any a"}`来声明这个参数。而在具体实现中，我们需要接受一个普通参数。在这里，我们用所有变量类的基类`Var`类，来表示任意类型的变量都可以被接收。

我们看一个稍微复杂一些的例子：

```java

    @MNIRegister(caller = "DataObject", returnType = "text", override = true)
    public static void toText(DataTemplateObject caller, ValueWrapper<JsonTextConcrete> returnValue) throws IOException {
        var l = new ListChatComponent();
        if(caller instanceof DataTemplateObjectConcrete callerC){
            l.getComponents().add(new PlainChatComponent(SNBTUtil.toSNBT(callerC.getValue())));
        }else {
            l.getComponents().add(new NBTChatComponent(caller.toNBTVar(), false, null));
        }
        returnValue.setValue(new JsonTextConcrete(l, "re"));
    }

```

这是`toText`函数，类似于java中的`toString`方法，旨在将任意类型转换为可以打印在聊天栏的原始Json文本。这个函数没有参数，调用者是`DataObject`，返回值是`text`类型。因此在Java方法的参数中，我们先写一个`DataTemplateObject caller`用于接收调用者，然后再写一个`ValueWrapper<JsonTextConcrete> returnValue`用于处理返回值。

:::tip
`Function.addCommand`函数用于向当前正在编译的mcf函数的末尾添加一条命令

`ValueWrapper`是一个包装类，用于包装返回值。

```kotlin
package top.mcfpp.util

class ValueWrapper<T>(var value: T)
```

使用`getValue`和`setValue`来修改其中的值。

`xxxConcrete`这种命名的类表示是xxx类型变量的编译器可追踪版本，就是编译器知道这个变量里面的值是什么。在标准库的实现中随处可见这种分类处理，为的是尽可能地优化性能。
:::

## 注入

`CompoundData`类拥有成员方法`getNativeFromClass(cls: Class<*>)`，用于向当前类型中注入来自类`cls`中的所有方法。

```kotlin
open class MCInt : MCNumber<Int> {
    
    //...

    companion object {
        val data = CompoundData("int","mcfpp")

        init {
            data.initialize()
            data.extends(MCAny.data)
            data.getNativeFromClass(MCIntData::class.java)
        }
    }

    //...

}

此外，你也可以在mcfpp代码中使用注解`@From<类的完全限定名>`，来向这个类或者数据模板中注入方法。

```mcfpp
@From<top.mcfpp.mni.minecraft.AreaData>
data Area{
    startX as int;
    startY as int;
    startZ as int;
    endX as int;
    endY as int;
    endZ as int;
}
```

## 调用

在MCFPP中，我们可以直接调用MNI函数，就像调用普通函数一样。例如：

```mcfpp
print(5);
```

但是MNI函数和普通函数一个非常重要的区别就是，MNI是在编译期执行的。在编译到此函数的时候，将会执行这个函数。也就是说，MNI函数的执行和逻辑语句无关，MNI函数也不会出现在数据包中。

例如：

```mcfpp
if(b){
    print(7);
}else{
    print(8);
}
```

编译器编译的时候是从上往下编译的，并且编译过程中不会在意逻辑语句。因此，无论`b`的值是什么，编译器始终都会先后遇到`print(7)`和`print(8)`，并且执行这两个函数。因此，数据包中始终会有`tellraw @a 7`和`tellraw @a 8`这两条命令。

当然，由于if的两个分支会对应两个不同的函数，因此`tellraw @a 7`和`tellraw @a 8`会分别出现在两个函数中。但是若调用的MNI函数的实现不同，那么可能会出现更多意想不到的情况。因此在使用MNI函数的时候，应当额外注意这一点。
