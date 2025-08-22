---
lastUpdate: true
---

# MNI Functions

## Declaration

If we want to declare a function whose implementation is handled by Java code, we need to declare it as a **native function**. The format for declaring a native function is as follows:

```mcfpp
func functionName(parameterList) = JavaClassName.methodName;
```

For example, as mentioned in the previous example for the `print` function, its declaration is:

```mcfpp
func print(i as text) = top.mcfpp.mni.System.print;
```

This indicates that the `print` function takes an `int` type parameter, and its logic is implemented by the `print` method of the `top.mcfpp.lang.System` class. Note that the class name needs to be fully qualified, including the package name, otherwise, the compiler won't be able to locate the class.

## Implementation

The `System` class is referred to as an **MNI implementation class**, and the specific logic for the `print` function is implemented within this class. By using the `@MNIRegister` annotation, we can register a Java function as an MNI implementation function. The source code for this annotation is as follows, with detailed explanations of its parameters provided in the comments.

```java
package top.mcfpp.annotations;

//import ...

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MNIRegister {

    /**
     * Read-only parameters. The format is type + space + parameter name.
     */
    String[] readOnlyParams() default {};

    /**
     * Regular parameters. The format is type + space + parameter name.
     */
    String[] normalParams() default {};

    /**
     * Type of the caller. Defaults to void.
     */
    String caller() default "void";

    /**
     * Return type of the function. Defaults to void.
     */
    String returnType() default "void";

    /**
     * Whether the function overrides a parent class function. Defaults to false.
     */
    boolean override() default false;

}
```

The parameter order for the Java function used in the implementation follows the principle: `read-only parameters + regular parameters + caller + ValueWrapper<return type>`.

Let's go back to the earlier example:

```mcfpp
func print(a as any) = top.mcfpp.mni.System.print;
```

```java
    //...

    @MNIRegister(normalParams = {"any a"})
    public static void print(@NotNull Var<?> value){
        Function.Companion.addCommand("tellraw @a " + "\"" + value + "\"");
    }

    //...
```

The `print` function has one parameter of type `any`, so in the annotation, we use `normalParams = {"any a"}` to declare this parameter. In the actual implementation, we need to accept a regular parameter. Here, we use the `Var` class, the base class for all variables, to accept any type of variable.

Let's look at a slightly more complex example:

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

The `toText` function is similar to Java's `toString` method, which converts any type into raw JSON text that can be printed in the chat bar. This function has no parameters, the caller is `DataObject`, and the return type is `text`. Therefore, in the Java method parameters, we first write `DataTemplateObject caller` to receive the caller, followed by `ValueWrapper<JsonTextConcrete> returnValue` to handle the return value.

:::tip
The `Function.addCommand` function is used to add a command to the end of the currently compiling MCF function.

`ValueWrapper` is a wrapper class used to wrap return values.

```kotlin
package top.mcfpp.util

class ValueWrapper<T>(var value: T)
```

You can modify the value inside using `getValue` and `setValue`.

The `xxxConcrete` naming convention refers to compiler-traceable versions of types like `xxx`, meaning the compiler knows what value is inside the variable. This approach is used extensively in the implementation of the standard library to optimize performance as much as possible.
:::

## Injection

The `CompoundData` class has a member method `injectedBy(cls: Class<*>)`, used to inject all methods from the class `cls` into the current type.

```kotlin
class MCFPPBaseType {
    object Int: MCFPPType(arrayListOf(Any)){

        override val instanceData by lazy {
            CompoundData("int","mcfpp").apply {
                this.commonType = Int
                extends(Any.instanceData)
                injectedBy(MCIntData::class.java)
            }
        }

        override val concreteInstanceData by lazy {
            CompoundData("int","mcfpp").apply {
                this.commonType = Int
                extends(Any.concreteInstanceData)
                injectedBy(MCIntConcreteData::class.java)
            }
        }
    }
}
```

In addition, you can use the `@From<fully qualified class name>` annotation in MCFPP code to inject methods into a class or data template.

```mcfpp
@From<top.mcfpp.mni.minecraft.AreaData>
data Area{
    int startX;
    int startY;
    int startZ;
    int endX;
    int endY;
    int endZ;
}
```

## Calling

In MCFPP, MNI functions can be called directly just like regular functions. For example:

```mcfpp
print(5);
```

However, an important difference between MNI functions and regular functions is that MNI functions are executed during the compilation phase. When the compiler encounters this function, it executes it. In other words, MNI functions are not tied to logic statements and do not appear in the data pack.

For example:

```mcfpp
if(b){
    print(7);
}else{
    print(8);
}
```

The compiler compiles from top to bottom, and during compilation, it doesn't care about the logic statements. So, regardless of the value of `b`, the compiler will always encounter both `print(7)` and `print(8)`, and execute these functions. Therefore, both `tellraw @a 7` and `tellraw @a 8` commands will always be present in the data pack.

Of course, since the two branches of the `if` statement correspond to two different functions, `tellraw @a 7` and `tellraw @a 8` will appear in different functions. However, if the MNI function implementations differ, unexpected situations may arise. Therefore, you should pay extra attention when using MNI functions.