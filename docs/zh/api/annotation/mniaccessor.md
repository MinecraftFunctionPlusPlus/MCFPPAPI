# public @interface MNIAccessor

```java
package top.mcfpp.annotations;

public @interface MNIAccessor {
    
    /**
     * 访问器的名称
     */
    String name();
}
```

这个方法用于标记一个Java方法是否是一个Native访问器。

::: info

在mcfpp中定义Native访问器：

```mcfpp
data BossBar{
    #...

    int max { get = top.mcfpp.mni.minecraft.BossBarData; };
    
    #...
}
```

在Java中实现Native访问器：

```java
package top.mcfpp.mni.minecraft;

//import ...

public class BossBarData {
    @MNIAccessor(name = "max")
    public static void getMax(DataTemplateObject bossbar, ValueWrapper<MCInt> returnValue){
        //具体的实现
    }
}
```

:::

## 函数格式

### 定义要求

|静态|需要为静态|
|返回值|无要求|
|标识符|无要求，但是建议为`getXXX`的形式|

### 参数要求

|参数类型|描述|
|-|-|
|`DataTemplateObject`|这个访问器所在的数据模板对象|
|`ValueWrapper<T extends Var<?>>`|访问器获取到的变量，类型为T|
