---
lastUpdate: true
---

# 注解<Badge type="tip">WIP</Badge>

你可以在类、数据模板、方法声明的最前方使用@+名字+只读参数列表的方式来为它们添加注解。注解是MNI框架的一部分，只存在于编译阶段。

## MNI实现

```java
//继承DataTemplateAnnotation，表示这是数据模板才能使用的注解
public class Example extends DataTemplateAnnotation {

    @SuppressWarnings("unused")
    public Example(String className) {
        super("Example", "mcfpp.annotation");
        //RESOVLE_FIELD表示解析成员阶段，在这个阶段完成后将注解注册到编译器中
        Project.INSTANCE.getStageProcessor()[Project.INSTANCE.getRESOVLE_FIELD()].add(() -> {
            GlobalField.INSTANCE.getLocalNamespaces().get("mcfpp.annotation").getField().addAnnotation("Example",this.getClass(), false);
            return null;
        });
    }

    //当编译器在注解解析阶段遇到这个注解的时候，会对这个注解修饰的数据模板做什么
    @Override
    public void forDataObject(@NotNull DataTemplate data) {
        System.out.println(data.getNamespaceID());
    }
}
```

## mcfpp声明

WIP
