---
lastUpdate: true
---

# 接口

MCFPP中，可以使用`interface`关键字来声明一个接口。接口是一种抽象的数据类型，它定义了一组方法的签名，但没有具体的实现。模板可以实现一个或多个接口，从而组合不同的功能和数据结构。

## 接口的声明

接口的声明语法如下：

```mcfpp
interface InterfaceName{
    func methodName(parameterList) -> returnType;
    func methodName(parameterList) -> returnType {
        # default implement
    };
    ...
}
```

接口中的方法只有方法签名，没有方法体。接口中的方法可以有多个，每个方法之间使用分号`;`分隔，表示抽象方法。接口中的方法也可以有一个默认实现，按照普通的成员方法书写即可。

接口不能直接通过构造函数构建一个变量，但是可以直接将一个复合标签的NBT字面量传递给一个接口类型的变量：

```mcfpp
interface Example {
    a as int;
    b as string;
}

var example as Example = {
    a: 1,
    b: "qwq"
}
```

## 接口的继承

接口也可以继承自其他接口。继承接口的语法如下：

```mcfpp
interface Interface1{
    func method1();
}

interface Interface2: Interface1{
    func method2();
}
```

## 接口的实现与模板的继承

模板可以实现一个或多个接口，也可以继承多个模板。实现接口的模板必须实现接口中定义的所有抽象方法。其语法如下：

```mcfpp
data Template: Interface1, Interface2, Template1, Template2, ...{
    #模板的属性和方法
    ...
    # 实现或重写方法
    override func methodName(parameterList) -> returnType{
        #方法体
    }
}
```

在继承或实现的过程中，模板会完全覆盖父类型的字段，但是会继承其方法实现。使用`super`关键字可以调用父类型中的方法。

若两个接口中定义了两个相同的方法且均有默认实现，或继承了两个拥有相同方法的模板，那么同时实现它们的模板必须显式重写父接口的默认实现，在默认实现中选择具体调用哪个父接口的方法，或者使用自己的实现。

```mcfpp
interface Interface1 {
    func method1() {
        print("Interface1::method1");
    }
}

interface Interface2 {
    func method1() {
        print("Interface2::method2");
    }
}

data Test: Interface1, Interface2{
    # 必须显式重写
    override func method1() {
        print("Test::method1"); # 使用自己的实现
        # super.method1();  # 错误！无法判断需要调用哪个方法
        (super as Interface1).method1();  # 通过类型转换调用指定父接口的默认实现
        (super as Interface2).method1();
    }
}
```

::: tip 多态
在编译过程中，编译器会记录一个模板或接口中定义的方法是否被重写或实现过。若有，则会在模板储存的nbt中添加一个字段`$mcfpp_method_<方法名>`，其值为一个命令函数的命名空间ID。在调用的过程中，会通过这个字段来判断具体调用哪个方法，从而实现多态。
:::
