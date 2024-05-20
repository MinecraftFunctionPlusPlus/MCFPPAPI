---
lastUpdate: true
---

# 内联函数

MCFPP中，可以使用`inline`关键字来声明一个内联函数。编译器会在调用内联函数的地方直接将函数的代码插入，而不是通过函数调用的方式来执行。这样可以减少函数调用的开销，提高程序的运行效率。

## 内联函数的声明

内联函数的声明语法如下：

```mcfpp
inline func functionName(parameter1, parameter2, ...) -> returnType{
    #函数体
}
```

## 内联函数的调用过程

在调用内联函数的地方，编译器会直接将内联函数的代码插入，而不是通过函数调用的方式来执行。例如下面的例子：

```mcfpp
inline func add(int a, int b) -> int{
    return a + b;
}

func main(){
    print(add(1, 2));
}
```

编译的时候，上述代码会相当于：

```mcfpp
func main(){
    int a = 1;
    int b = 2;
    int ret = a + b;
    print(ret);
}
```

这同时意味着，在内联函数中，对变量的修改会影响到函数外部的变量。
