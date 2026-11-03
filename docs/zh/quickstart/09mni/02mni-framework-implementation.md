---
lastUpdated: true
---

# MNI 参数与返回值

本节接在 [MNI 入门](./01mni-framework)之后。继续使用同一个工程，让 Java 入口接收两个整数，并返回它们的和。

## 用 MCInt 接收整数

`src/main/java/example/mni/Arithmetic.java`：

```java
package example.mni;

import top.mcfpp.annotations.MNIFunction;
import top.mcfpp.core.lang.MCInt;
import top.mcfpp.util.ValueWrapper;

public final class Arithmetic {
    @MNIFunction(normalParams = {"int", "int"}, returnType = "int")
    public static void add(
            MCInt left, MCInt right, ValueWrapper<MCInt> result) {
        result.set((MCInt) left.plus(right));
    }

    @MNIFunction(
        readOnlyParams = {"int"},
        normalParams = {"int"},
        returnType = "int"
    )
    public static void addBonus(
            MCInt bonus, MCInt score, ValueWrapper<MCInt> result) {
        result.set((MCInt) score.plus(bonus));
    }
}
```

`add` 接收两个普通整数参数。`addBonus` 接收一个固定奖励和一个普通分数。两者都通过 `ValueWrapper<MCInt>` 返回结果。

先看 `add` 中最关键的一行：

```java
result.set((MCInt) left.plus(right));
```

`left.plus(right)` 请求编译器进行 MCFPP 整数加法。编译器根据输入生成相应计算，再把结果交给 `result`。

## 声明两种接口

`src/main/mcfpp/main.mcfpp`：

```mcfpp
func add(left: int, right: int): int = example.mni.Arithmetic.add
func addBonus<bonus: int>(score: int): int = example.mni.Arithmetic.addBonus

func main() {
    external count: int = 2
    print(add(count, 3))
    print(addBonus<5>(count))
}
```

执行 `mcfpp build`，再在游戏中调用 `main`。两次输出分别为 `5` 和 `7`。

`external count` 使用游戏运行时存储。Java 在构建时收到的是“如何访问这个整数”的编译器对象。数据包执行时，生成的加法命令才读取实际整数。

`<5>` 则在构建时就确定了奖励值。尖括号与圆括号的区别见[编译时参数](../07generic/01concrete_var)。

## 对齐三处参数声明

普通 MNI 包装入口有三处互相对应的描述：

| MCFPP 声明 | Java 注解 | Java 方法参数 |
| --- | --- | --- |
| `left: int, right: int` | `normalParams = {"int", "int"}` | `MCInt left, MCInt right` |
| `<bonus: int>` | `readOnlyParams = {"int"}` | 位于普通参数前的 `MCInt bonus` |
| `: int` | `returnType = "int"` | 末尾的 `ValueWrapper<MCInt> result` |

MCFPP 声明决定调用者看到的接口。注解描述 Java 入口的签名。Java 参数使用相应的编译器类型，并按声明顺序排列。

对于本例的自由函数，顺序是：只读参数 → 普通参数 → 返回值包装。成员入口还会在返回值包装之前接收调用者对象，签名规则见 [MNIFunction API](/zh/api/annotation/mnifunction)。

## Java int 与 MCInt 分别用在哪里

| 写法 | 表示什么 | 典型用途 |
| --- | --- | --- |
| Java `int` | Java 此刻就持有的整数 | 读取配置、普通 Java 计算与测试 |
| Java `MCInt` | 编译器中的 MCFPP 整数值 | 接收源码输入、生成整数运算 |
| MCFPP `int` | 数据包程序中的整数类型 | 声明变量、参数和返回值 |

`MCInt` 可以表示已知整数，也可以表示运行时数据。对它使用 `plus` 等编译器运算方法，可以让同一入口处理两种输入。直接取得 Java 整数，则需要该值在构建时已经确定。

## 常用值类型对应

声明其他输入和结果时，使用对应的编译器值类。Java 文件需要导入表中的类：

| MCFPP 类型 | Java 类 |
| --- | --- |
| `int` | `top.mcfpp.core.lang.MCInt` |
| `float` | `top.mcfpp.core.lang.MCFloat` |
| `bool` | `top.mcfpp.core.lang.bool.ScoreBool` |
| `string` | `top.mcfpp.core.lang.nbt.MCString` |

例如，字符串输入使用 `MCString input`，字符串结果使用 `ValueWrapper<MCString> result`。注解与 MCFPP 声明中仍写 `string`。

## 返回结果或生成操作

有结果的入口在每条正常完成的路径上调用 `result.set(...)`。它把一个 MCFPP 值交给调用者，Java 方法本身仍返回 `void`。

需要生成消息、实体操作等无结果行为时，使用[下一节的命令入口](./05access)。注解字段的完整说明见 [MNIFunction API](/zh/api/annotation/mnifunction)。
