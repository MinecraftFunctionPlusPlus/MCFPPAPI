# public @interface MNIMutator

```java
package top.mcfpp.annotations;

public @interface MNIMutator {

    /**
     * 操作器的名称
     */
    String name();
}
```

这个方法用于标记一个Java方法是否是一个Native操作器。

::: info

在mcfpp中定义Native操作器：

```mcfpp
data BossBar{
    #...

    int max { set = top.mcfpp.mni.minecraft.BossBarData; };
    
    #...
}
```

在Java中实现Native操作器：

```java
package top.mcfpp.mni.minecraft;

//import ...

public class BossBarData {
    @MNIMutator(name = "max")
    public static void setMax(DataTemplateObject bossbar, MCInt value){
        //具体的实现
    }
}
```

:::

## 函数格式

### 定义要求

|静态|需要为静态|
|返回值|无要求|
|标识符|无要求，但是建议为`setXXX`的形式|

### 参数要求

|参数类型|描述|
|-|-|
|`DataTemplateObject`|这个操作器所在的数据模板对象|
|`T extends Var<?>`|传入操作器的变量|
