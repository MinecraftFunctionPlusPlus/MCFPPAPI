---
lastUpdate: true
---

# 定义和调用

## 函数定义

MCFPP中，函数的定义语法如下：

```mcfpp
func functionName(parameter1, parameter2, ...) -> returnType{
    #函数体
}
```

`func`是函数的关键字，`functionName`是函数的标识符或者说名字，而紧随其后的`parameter1, parameter2, ...`则是函数的参数列表，`returnType`是可选的，即函数的返回类型。函数体则是由`{}`包裹的一系列语句。下面是一个实际的例子：

```mcfpp
func add(a as int, b as int) -> int{
    return a + b;
}
```

这个函数的名字是`add`，它有两个整数类型的参数`a`和`b`，返回值也是一个整数类型。这个函数的作用是把两个参数相加并返回结果。

若函数没有参数，你可以省略参数列表

```mcfpp
func getRandom -> int{
    return random(0, 100);
}

func sayHi {
    print("hi");
}
```

## return

`return`和Minecraft中的`return`命令作用相同，都是用于返回函数的返回值。它的语法即为`return expression;`，其中`expression`是一个表达式，它的值就是函数的返回值。

如果一个函数定义了返回值类型，那么它的每一个分支都必须有`return`语句，即函数必定返回一个值。且`return`语句返回的值必须和函数的返回值类型相同，或者是返回值类型的子类型。

如果一个函数没有定义返回值类型，那么默认为`void`，即不会返回任何值。这个时候，`return`语句仍然是可用的，但是它的语法变为`return;`，即不带任何表达式。它将会起到立刻终止函数运行的作用。

## 函数的调用

MCFPP中，函数的调用语法和C/Java一样，即`functionName(parameter1, parameter2, ...);`。其中，`functionName`是函数的名字，`parameter1, parameter2, ...`是要传递给函数的参数。下面是一个实际的例子：

```mcfpp
func test {
    print(add(1, 2));  #上面定义的add函数
}
```

这个例子中，`test`函数调用了`add`函数，并传递了两个参数`1`和`2`。`add`函数返回了`3`，因此`test`函数将会打印出`3`。

## 函数的传参

函数中，对参数的修改不会影响到函数外部的变量。例如：

```mcfpp
func test(int a) {
    a = 5;
}

void main {
    int a = 0;
    test(a);
    print(a);   #输出0
}
```

在这个例子中，`test`函数对传入的参数`a`进行了修改，但是`main`函数中的`a`并没有受到影响。
