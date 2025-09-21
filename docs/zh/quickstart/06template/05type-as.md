---
lastUpdate: true
---

# 类型委托

通过一种特殊的定义，数据模板可以将自己委托给任何的另一种数据类型。

使用`as`关键字来定义一个类型委托。

```mcfpp
data 数据模板名 as 类型 {
    # 数据模板成员
}
```

使用了委托的数据模板中会自动生成一个名为`value`的私有字段，类型即为委托的类型。同时，这个数据模板将不再能定义新的字段。。随后，这个数据模板可以通过显式转换的方式，直接转换为委托的类型。


假设我们有一个数据模板`Test`，其中只有一个`int`类型的成员`value`：

```mcfpp
data Test{
    value as int;
}

var test as Test = {
    "value": 1
};
```

在储存的时候，这个数据模板变量的nbt会被储存为`test:{value: 1}`。

但是如果我们使用类型委托：

```mcfpp
data Test as int;

var test as Test = Test(1);

```

此时，`test`的nbt会被储存为`test: 1`。也就是说，使用了类型委托的数据模板，在nbt储存方面上，等价于被委托的类型。

使用了数据委托的数据模板会默认生成一个参数为委托类型的构造函数。

虽然不能再定义字段，但是仍然可以在这个数据模板中定义函数，并且你可以在函数中使用`this.value`来访问委托的值。

```mcfpp
data Test as int {
    func getValue() -> int {
        return this.value;
    }
}

var test as Test = Test(1);
print(test.getValue()); # 1

```

委托虽然在储存上等价于被委托的类型，但是在使用上仍然是一个独立的类型。也就是说，`Test`和`int`是两个不同的类型，不存在继承关系。`Test`不会继承`int`的任何成员，而是默认继承于`any`类型。并且，使用了数据委托的数据模板不再能继承其他的数据模板。

```mcfpp
data Test as int: Parent {  # [!code error] #错误，缺少初始化表达式，无法推断
    func getValue() -> int {
        return this.value;
    }
}

var test as Test = Test(1);
print(test.getValue()); # 1 
print(test + 1); # [!code error] #错误，Test并未继承int，因此没有实现+运算符
print((test as int) + 1);   # 2
```
