---
lastUpdate: true
---

# JVM访问符

## 基本使用

在MCFPP中，你可以使用`::`运算符来简单地访问一个变量对象在编译过程中编译器中Java对象，以及这个对象的成员和方法。

```mcfpp
int i = 0;
i::jvm.toString();  #调用i的toString方法
var qwq = i::jvm.type.build("test"); #调用i的type对象的build方法
# build方法返回一个MCIntConcrete类型的变量，所以这里qwq的类型JavaVar，值是MCIntConcrete
int awa = qwq;  #JavaVar自动转换为MCFPP变量
print(i + qwq);
```

同时，你可以直接用`::`访问一个Java静态类的静态方法。

```mcfpp
::top.mcfpp.model.function$Function.addCommand(::top.mcfpp.command$Command.build("say hello"))
```

请注意使用完全限定名。

## 命令插入

在前文中，我们提到使用`/`可以插入一段原版命令。你可以使用类似字符串模板的语法，将Java对象的成员和方法插入到原版命令中。

```mcfpp
int i = 0;
/say ${i}
/say ${i::jvm.toString()}
/scoreboard players get ${i::jvm.name} ${i::jvm.sbObject}
```

一般来说，`${}`中的内容会在计算完毕后自动调用`toString()`函数，所以无须额外添加`.toString()`。但是若计算结果是`MCFPPValue<*>`，也就是一个确定的值，那么将会调用值的`toString()`函数。例如`JavaVar`就是一个`MCFPPValue<*>`。所以，上述的编译结果是：

```mcfunction
say 0
say [int,value=0]
scoreboard players get default_func_main_qwq mcfpp_default
```
