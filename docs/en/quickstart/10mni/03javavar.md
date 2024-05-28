---
lastUpdate: true
---

# JavaVar

在MCFPP中有一个相当特殊的变量类型，即`JavaVar`。它只能被MNI函数返回，不能被直接创建。`JavaVar`也只存在于编译过程中，它表示了编译过程中的一个Java变量，同样也属于MNI框架的一部分。

`JavaVar`变量仅可通过MNI的返回值获取。例如我们有MNI函数实现如下：

```mcfpp
func getJavaVar() = top.mcfpp.lang.JavaVar.getJavaVar;
```

```java
import java.util.Random;

//...
method.add("getJavaVar", (readonlyArgs, normalArgs, caller, returnVar) -> {
    returnVar.value = new JavaVar(new Random());    //返回一个随机数生成器
    return null;
});
//...
```

这个MNI函数将会返回一个`JavaVar`变量，它的值是`Random`类的一个实例。接下来，我们可以在mcfpp中调用这个函数：

```mcfpp
var random = getJavaVar();
```

现在，random是一个JavaVar类型的变量，它的值是`Random`类的一个实例。接下来，我们可以去调用它的各种方法：

```mcfpp
#调用方法
var nextInt = random.nextInt(100);
```

调用`JavaVar`类型变量的成员方法得到的变量仍然是`JavaVar`类型的变量。得益于MCFPP和Java/Kotlin语法的极大相似，我们可以几乎无缝在MCFPP中调用Java/Kotlin的方法。

同样，在适当的情况下，编译器会完成部分类型的MCFPP变量和Java变量之间的自动转换。

```mcfpp
int qwq = 100;  #MCFPP变量

var nextInt = random.nextInt(qwq);  #MCFPP变量自动转换为Java变量，并传入Java方法中

int nextMCFPPInt = nextInt;    #Java变量自动转换为MCFPP变量
```

这样的转换有一个前提，也就是，MCFPP变量必须是已知的，才能被自动转换为对应的Java变量，否则将会转换为为`Var`类，即所有MCFPP变量在编译器中的基类。当然，如果Java方法默认需要一个`Var`类型的参数，编译器就不会执行自动转换。
