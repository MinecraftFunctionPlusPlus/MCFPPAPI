---
lastUpdate: true
---

# 类的定义和实例化

```mcfpp
class Person{
    string name;
    int age;
    string sex;
    
    constructor(string name, int age){
        this.name = name;
        this.age = age;
    }

    func setName(string name){
        this.name = name;
    }

    func toString() -> string{
        return "Name: " + this.name + ", Age: " + this.age;
    }
}
```

## 类的定义

作为一个面向对象的编程语言，MCFPP有完善的面向对象的语法和功能。它的语法和Java/C#的语法非常相似，所以，如果你有相关的基础的话，你应该可以很轻松地上手。

在MCFPP中，可以使用`class`关键字来声明一个类：

```mcfpp
class ClassName{
    #类体
    #...
}
```

其中，`ClassName`是类的名字。在MCFPP中，类的名字必须以大写字母开头。而紧随其后的花括号中的内容则是类体，包含了类的成员变量和成员函数，以及它的构造方法等等。是吧，和Java/C#是一样的。

## 类的实例化

一般情况下，你可以使用`ClassName(参数列表)`来创建一个对象的实例。比如本篇开头的示例`Person`类可以用`Person p = Person("Alumopper",16)`来创建。在MCFPP中，你并不需要`new`关键字。它被省略掉了。

## 类的初始化器

在创建类的时候，你可以使用类初始化器来对类的某些成员变量初始化，例如对于上文中的`Person`，有：

```mcfpp
Person p = Person("Alumopper",16)[
    sex = "女"
];
```

这样，`p`的`sex`成员变量就被初始化为`"女"`了。

::: tip

### 不仅仅是类的初始化

事实上，类初始化器可以用在任何地方，而不只是在类的初始化的时候。比如

```mcfpp
func main(){
    Test t = Test();
    t = t[a = 100];
    print(t.toText());
}
```

在这个例子中，类的初始化器实际上是域操作器。`t = t[a = 100]`将t中的a赋值为100。
:::
