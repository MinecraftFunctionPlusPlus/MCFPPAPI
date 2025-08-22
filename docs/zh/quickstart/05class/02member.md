---
lastUpdate: true
---

# 实体模板的成员

和Java类似，在MCFPP中，实体模板的成员包括属性和方法。属性是实体模板的数据成员，用来存储对象的数据；方法是实体模板的函数成员，用来操作对象的数据。实体模板的成员可以通过`.`操作符来访问。

## 属性

属性是实体模板的数据成员，用来存储对象的数据。属性的定义语法如下：

```mcfpp
class A{
    a as int;
    b as int = 5;
}
```

上述代码定义了一个实体模板`A`，它有两个属性`a`和`b`。`a`是一个整数类型的属性，没有初始化；`b`是一个整数类型的属性，初始化为`5`。

:::tip
实体模板和数据模板的成员定义都不需要写`var`关键字，直接写成员的类型和名字即可。
:::

## 方法

方法是实体模板的函数成员，用来操作对象的数据。方法的定义语法如下：

```mcfpp
class A{
    func test() {
        print("Hello, World!");
    }
}
```

在方法中使用`this`关键字可以访问对象的属性。例如：

```mcfpp
class A{
    a as int;
    func setA(a as int){
        this.a = a;
    }
}
```

## 访问控制

MCFPP中，实体模板的成员可以使用`public`、`protected`、`private`关键字来控制访问权限。默认情况下，实体模板的成员是`private`的。

- `public`：公有的，可以被外部访问。
- `protected`：受保护的，可以被子实体模板访问。
- `private`：私有的，只能在实体模板的内部访问。

```mcfpp
class A{
    public a as int;
    protected b as int;
    private c as int;
}

class B: A{
    func test {
        a = 1;  #合法
        b = 2;  #合法
        c = 3;  #编译错误
    }
}

func test {
    var obj = A();
    obj.a = 1;  #合法
    obj.b = 2;  #编译错误
    obj.c = 3;  #编译错误
}
```
