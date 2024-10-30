# public @interface MNIFunction

```java
package top.mcfpp.annotations;

//import ...

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MNIFunction {

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

    /**
     * 是否是单例对象
     */
    boolean isObject() default false;

}
```

这个方法用于标记一个Java方法是否是一个MNINative函数。

::: info
在mcfpp中定义MNINative函数：

```mcfpp
func print(text t) = top.mcfpp.mni.System.print;
```

在java中实现MNINative函数：

```java
package top.mcfpp.mni;

//import ...

public class System {

    @InsertCommand
    @MNIFunction(normalParams = {"text t"})
    public static void print(@NotNull JsonText text){
        if(text instanceof JsonTextConcrete textC){
            Function.Companion.addCommand(new Command("tellraw @a").build(textC.getValue().toCommandPart(), true));
        }else {
            Function.Companion.addCommand(new Command("tellraw @a").build(text.toCommandPart(), true));
        }
    }
    
}
```
:::

## 函数格式

### 定义要求

|静态|需要为静态|
|返回值|无要求|
|标识符|无要求。使用`getNativeFromClass`方法获取函数时，mcfpp函数的标识符和java标识符相对一致。|

### 参数要求

|参数类型|描述|、
|-|-|
|（可选）`T extends Var<?>...`|这个函数的只读参数列表。需要按照定义顺序。|
|（可选）`T extends Var<?>...`|这个函数的普通参数列表。需要按照定义顺序。|
|（可选）`T extends Var<?>`|这个函数的调用者。|
|（可选）`ValueWrapper<T>`|这个函数的返回值。|
