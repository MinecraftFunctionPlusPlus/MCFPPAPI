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

`System`类被称为**MNI实现类**，`print`函数的具体逻辑就是在这个类中实现的。MNI的实现类必须继承`MNIMethodContainer`类：

```kotlin
package top.mcfpp.model.function

typealias MNIMethod = (Array<Var<*>?>, Array<Var<*>?>, CanSelectMember?, ValueWrapper<Var<*>>) -> Void

abstract class MNIMethodContainer{

    abstract fun getMNIMethod(name: String): MNIMethod

}
```

其中，定义了一个名为`getMNIMethod`的抽象方法，它的参数是一个函数名，即在之前声明native方法的时候，在等号后面的部分，类名.函数名中的函数名。方法需要根据传入的函数名，返回一个`MNIMethod`函数。

而`MNIMethod`是一个lambda函数类型，它接受四个参数：

* `Array<Var<*>?> readonlyArgs`：传入函数的泛型参数数组。参数的顺序和定义一致。

* `Array<Var<*>?> normalArgs`：传入函数的普通参数数组。参数的顺序和定义一致。

* `CanSelectMember? caller`：这个函数的调用者。比如对于`a.test()`，变量`a`就是调用者。如果调用者不存在，比如对于全局函数，那么这个参数就是`null`

* `ValueWrapper<Var<*>> returnVar`：这个参数即为函数的返回值。它的成员变量`value`即为函数的返回值对应的变量，可以通过修改value达到返回某个值的目的。如果函数没有返回值，可以不用管这个参数。

在MNI调用执行Native函数的过程中，将会自动调用`getMNIMethod`方法，根据函数名获取到对应的函数，传入上述四个参数，然后执行这个函数。

一般来说，我们会在MNI实现类中定义一个静态的`HashMap`，用于存储所有的MNI函数。这个`HashMap`的key是函数名，value是对应的`MNIMethod`函数。在`getMNIMethod`方法中，我们只需要根据传入的函数名，从`HashMap`中获取到对应的函数即可，例如对于`System`类，我们的实现是这样的：

```java
package top.mcfpp.lang;

//略去import函数

public class System extends MNIMethodContainer {

    @NotNull
    @Override
    public Function4<Var<?>[], Var<?>[], CanSelectMember, ValueWrapper<Var<?>>, java.lang.Void> getMNIMethod(@NotNull String name) {
        return methods.get(name);
    }

    static HashMap<String, Function4<Var<?>[], Var<?>[], CanSelectMember, ValueWrapper<Var<?>>, java.lang.Void>> methods;

    static {
        methods = new HashMap<>();
        //实现print函数
        methods.put("print", (vars, vars2, canSelectMember, varValueWrapper) -> {
            //具体逻辑在这里实现
        });
    }
}
```

其中，我们在`System`类中定义了一个`HashMap`，并在静态代码块中初始化了`print`函数的实现。现在，我们来具体实现这个函数。

```java
    //...

    static {
        //...
        //实现print函数
        methods.put("print", (vars, vars2, canSelectMember, varValueWrapper) -> {
            //只会有一个参数哦
            var value = vars2[0];
            if (value instanceof MCInt) print((MCInt) value);
            else print(value);
            return null;
        });
    }

    @InsertCommand
    public static void print(@NotNull MCInt var) {
        if (var instanceof MCIntConcrete varC) {
            //是确定的，直接输出数值
            Function.Companion.addCommand("tellraw @a " + varC.getValue());
        }else {
            Function.Companion.addCommand("tellraw @a " + new JsonTextNumber(var).toJson());
        }
    }

    @InsertCommand
    public static void print(@NotNull Var<?> var){
        Function.Companion.addCommand("tellraw @a " + "\"" +var + "\"");
    }

    //...
```

首先，我们获取到了传入`print`的参数。由于`print`函数只有一个普通参数，因此我们直接使用`var2[0]`就可以获取到这个传入的参数了。此后，我们使用`instanceof`关键字判断这个参数的类型，如果是`MCInt`类型，那么我们就调用`print(MCInt var)`函数。在不同类型对应的函数中，我们再进行具体的实现。

:::tip
`Function.addCommand`函数用于向当前正在编译的mcf函数的末尾添加一条命令
:::

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
