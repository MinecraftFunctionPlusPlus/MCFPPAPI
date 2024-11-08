---
lastUpdate: true
---

# JVM Access Operator

## Basic Usage

In MCFPP, you can use the `::` operator to access the Java object of a variable in the compiler.

```mcfpp
int i = 0;
i::jvm.toString(); # Call the `toString` method of `i`
var qwq = i::jvm.type.build("test"); # Call the `build` method of the `type` object of `i`
# The `build` method returns a variable of type `MCIntConcrete`, so the type of `qwq` is `JavaVar`, and the value is `MCIntConcrete`
int awa = qwq; # The value of `qwq` is automatically converted to an MCFPP variable
print(i + qwq);
```

Also, you can directly access a static method of a Java static class using `::`.

```mcfpp
::top.mcfpp.model.function$Function.addCommand(::top.mcfpp.command$Command.build("say hello"))
```

Note that you should use the fully qualified name.

## Command Insertion

In the previous section, we mentioned that you can insert a vanilla command using `/`. You can use a string template-like syntax to insert members and methods of Java objects into vanilla commands.

```mcfpp
int i = 0;
/say ${i}
/say ${i::jvm.toString()}
/scoreboard players get ${i::jvm.name} ${i::jvm.sbObject}
```

Normally, the content in `${}` will automatically call the `toString()` function after calculation, so there is no need to add `.toString()` separately. However, if the calculation result is `MCFPPValue<*>`, which is a determined value, the `toString()` function of the value will be called. For example, `JavaVar` is an `MCFPPValue<*>`. Therefore, the compilation result of the above code is:

```mcfunction
say 0
say [int,value=0]
scoreboard players get default_func_main_qwq mcfpp_default
```
