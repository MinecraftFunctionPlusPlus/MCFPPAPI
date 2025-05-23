---
lastUpdate: true
---

# 杂项

## 基实体

在本章节开头的例子中你可能已经发现，我们使用了`@Base<"creeper">`这行代码。这行代码被称为**注解**，我们会在后续的章节中讲到它。在类定义的前一行使用`@Base<"creeper">`注解，可以指定这个实体模板以哪个实体为基础。这个实体就是基实体。

一般来说，大部分的实体都不能很好的直接储存自定义数据，所以当基实体不是`item_display`或者`marker`的时候，将会在这个实体上骑乘一个`marker`实体，用于储存实体模板的自定义字段。

基实体带有标签`<命名空间>_class_<类名>_pointer"`，而用于储存数据的实体则带有标签`<命名空间>_class_<类名>_pointer_data"`。

::: info
在24w10a后，所有的实体都可以通过`minecraft:custom_data`实体组件储存自定义数据。这意味着，在未来的mcfpp版本中，任何类型的基实体构成的类都会把数据统一储存在`minecraft:custom_data`组件中。
:::

## 实体模板的生命周期

实体模板的生命周期和基实体的生命周期是一致的。当基实体被移除时，实体模板也会被移除。这个过程由垃圾处理器（GC）自动完成。

当然，你可以可以手动释放内存，使用`dispose`函数<Badge type="tip">未来特性</Badge>：

```mcfpp

var p = SuperCreeper("Super Creeper");

p.dispose();

```
