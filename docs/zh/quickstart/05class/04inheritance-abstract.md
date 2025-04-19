---
lastUpdate: true
---

# 继承和抽象

MCFPP中，类支持继承和抽象。

## 继承

使用`:`关键字可以声明一个类继承自另一个类。利用`super`关键字，子类可以访问父类的属性和方法。使用`override`关键字可以重写父类的方法。

```mcfpp
class Parent{
    protect a as int;
    func test {
        print("Parent");
        print(a);
    }
}

class Child: Parent{
    b as int;
    override func test {
        print("Child");
        print(super.a);
    }
}
```

## 抽象

使用`abstract`关键字可以声明一个抽象类或一个抽象方法。可以在抽象类中定义抽象方法，而它的非抽象子类必须实现这些抽象方法。抽象方法没有方法体，只有方法签名。

```mcfpp
abstract class A{
    abstract func test();
}

class B: A{
    override func test {
        print("Hello, World!");
    }
}
```
