---
lastUpdate: true
---

# 定义和实现接口

MCFPP中，可以使用`interface`关键字来声明一个接口。接口是一种抽象的数据类型，它定义了一组方法的签名，但没有具体的实现。类可以实现一个或多个接口，从而保证类具有接口中定义的方法。

## 接口的声明

接口的声明语法如下：

```mcfpp
interface InterfaceName{
    func methodName(parameterList) -> returnType;
    func methodName(parameterList) -> returnType;
    ...
}
```

接口中的方法只有方法签名，没有方法体。接口中的方法可以有多个，每个方法之间使用分号`;`分隔。接口中的方法一定都是抽象方法，但是不需要额外使用`abstract`关键字来声明

## 接口的实现

接口不能被实例化，但可以被类实现。

类可以实现一个或多个接口。实现接口的类必须实现接口中定义的所有方法。实现接口的语法如下：

```mcfpp
class ClassName: Interface1, Interface2, ...{
    #类的属性和方法
    ...
    override func methodName(parameterList) -> returnType{
        #方法体
    }
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

如果一个类实现了一个继承了其他接口的接口，那么这个类必须实现接口以及其继承接口中定义的全部方法。
