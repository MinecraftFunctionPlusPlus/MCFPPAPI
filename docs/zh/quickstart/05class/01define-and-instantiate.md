---
lastUpdate: true
---

# 实体模板

在MCF中，大部分的操作都基于实体完成。使用频率最高的命令可能就是`execute as`命令了。在MCFPP中，引入了实体模板（Entity Template）的概念，用于集中管理某一类实体，并对这一类实体声明字段和方法，实现数据的储存和操作。在过去的设计中，实体模板又被称为类（Class）。

```mcfpp
@Base<"creeper">
class SuperCreeper{

    text name;

    constructor(name as text){
        this.name = name;
    }

    override func tick {
        effect(@a[distance=..5], Effects.Poison);
        title(@a[distance=..5], this.name);
    }

}
```

## 实体模板的定义

实体模板曾经称为类，因此在设计的时候，它的语法和Java/C#中类的声明语法非常相似，所以，如果你有相关的基础的话，你应该可以很轻松地上手。

在MCFPP中，可以使用`class`关键字来声明一个实体模板：

```mcfpp
class ClassName{
    # 类体
    # ...
}
```

其中，`ClassName`是实体模板的名字。在MCFPP中，实体模板的名字必须以大写字母开头。而紧随其后的花括号中的内容则是类体，包含了实体模板的成员变量和成员方法，以及它的构造函数等等。

## 实体模板的实例化

一般情况下，你可以使用`ClassName(参数列表)`来创建一个实体模板的实例。比如本篇开头的示例`SuperCreeper`实体模板可以用`SuperCreeper p = SuperCreeper("Super Creeper")`来创建。

## 实体模板的初始化器

在创建实体模板的时候，你可以使用实体模板初始化器来对实体模板的某些成员变量初始化，例如对于上文中的`SuperCreeper`，有：

```mcfpp
SuperCreeper p = SuperCreeper("")[
    name = "Super Creeper"
];
```

::: tip

### 不仅仅是实体模板的初始化

事实上，实体模板初始化器可以用在任何地方，而不只是在实体模板的初始化的时候。比如

```mcfpp
func main {
    var t = Test();
    t = t[a = 100];
    print(t.toText());
}
```

在这个例子中，实体模板的初始化器实际上是域操作器。`t = t[a = 100]`将t中的a赋值为100。
:::

::: tip

### 实体模板与类

类是实体模板的特殊形式。有时候，你可能只是想要储存一些数据，而不是对一类实体进行某些操作，在这个情况下，我们更倾向于把实体模板称为类。因此，在之后的文档中，如果你看到了“类”这个词，你可以认为它是“实体模板”的同义词。
:::
