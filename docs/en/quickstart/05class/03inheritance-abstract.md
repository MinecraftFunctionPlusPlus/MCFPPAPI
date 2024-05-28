---
lastUpdate: true
---

# 继承和抽象

MCFPP中，类支持继承和抽象。继承是指一个类可以派生出一个或多个子类，子类可以继承父类的属性和方法。抽象是指一个类可以定义抽象方法，子类必须实现这些抽象方法。

## 继承

继承是指一个类可以派生出一个或多个子类，子类可以继承父类的属性和方法。继承的语法如下：

```mcfpp
class Parent{
    protect int a;
    func test(){
        print("Parent");
        print(a);
    }
}

class Child: Parent{
    int b;
    override func test(){
        print("Child");
        print(super.a);
    }
}
```

使用`:`关键字可以声明一个类继承自另一个类。利用`super`关键字，子类可以访问父类的属性和方法。使用`protected`关键字可以声明受保护的属性，子类可以访问父类的受保护属性。使用`override`关键字可以重写父类的方法。

## 抽象

一个类可以定义抽象方法，子类必须实现这些抽象方法。抽象方法没有方法体，只有方法签名。抽象方法的定义语法如下：

```mcfpp
abstract class A{
    abstract func test();
}

class B: A{
    override func test(){
        print("Hello, World!");
    }
}
```

使用`abstract`关键字可以声明一个抽象类或一个抽象方法。抽象类的子类必须实现抽象方法，否则会编译错误。