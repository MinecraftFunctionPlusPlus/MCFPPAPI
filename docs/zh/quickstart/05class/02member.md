---
lastUpdate: true
---

# 类的成员

和Java类似，在MCFPP中，类的成员包括属性和方法。属性是类的数据成员，用来存储对象的数据；方法是类的函数成员，用来操作对象的数据。类的成员可以通过`.`操作符来访问。

## 属性

属性是类的数据成员，用来存储对象的数据。属性的定义语法如下：

```mcfpp
class A{
    int a;
    int b = 5;
}
```

上述代码定义了一个类`A`，它有两个属性`a`和`b`。`a`是一个整数类型的属性，没有初始化；`b`是一个整数类型的属性，初始化为`5`。

## 方法

方法是类的函数成员，用来操作对象的数据。方法的定义语法如下：

```mcfpp
class A{
    void test(){
        print("Hello, World!");
    }
}
```

在方法中使用`this`关键字可以访问对象的属性。例如：

```mcfpp
class A{
    int a;
    void setA(int a){
        this.a = a;
    }
}
```

## 访问控制

MCFPP中，类的成员可以使用`public`、`protected`、`private`关键字来控制访问权限。默认情况下，类的成员是`private`的。

- `public`：公有的，可以被外部访问。
- `protected`：受保护的，可以被子类访问。
- `private`：私有的，只能在类的内部访问。

```mcfpp
class A{
    public int a;
    protected int b;
    private int c;
}

class B: A{
    void test(){
        a = 1;  #合法
        b = 2;  #合法
        c = 3;  #编译错误
    }
}

func test(){
    A obj = new A();
    obj.a = 1;  #合法
    obj.b = 2;  #编译错误
    obj.c = 3;  #编译错误
}
```
