# public @interface MNIMember

```java
package top.mcfpp.annotations;

public @interface MNIMember {}
```

此方法用于在调用`getNativeFromClass`方法的过程中，标记一个Java方法能够用于向当前的复合数据类型变量中添加成员（变量、函数等。）

::: info

在java中使用：

```java

    @MNIMember
    public static ArrayList<Var<?>> getMembers() {
        NormalCompoundDataObject attributes = new NormalCompoundDataObject("attributes", Map.of());
        CompoundData attributeData = new CompoundData("attribute", "mcfpp.hidden");
        attributeData.getNativeFromClass(AttributeData.class);
        attributes.getData().addMember(new NormalCompoundDataObject(attributeData, "armor", Map.of()));
        return new ArrayList<>(List.of(attributes));
    }

```

:::

## 函数格式

### 定义要求

|静态|需要为静态|
|返回值|`ArrayList<Var<?>>`|
|标识符|`getMembers()`|

### 参数要求

参数列表为空。
