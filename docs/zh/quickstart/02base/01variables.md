---
lastUpdated: true
---

# 变量

## 变量的声明

和其他语言一样，你可以在MCFPP中声明一些变量用来储存、传递、处理数据。

变量的声明一般如下：

```mcfpp
#变量的类型 变量的标识符 （可选： = 表达式或值）
int i = 5;
int b = i * 6;
```

变量的标识符可以为任意字母和数字的组合。在同一个作用域中，一个相同名称的变量只能被声明一次。

## 变量的类型

在MCFPP中，变量分为基本数据类型和复合数据类型。基本数据类型是硬编码且内定的，而复合数据类型，比如类、模板等，则可以由开发者自己确定。目前来说，MCFPP已有的基本类型如下所示：

|类型名|类型描述|例子|
|-|-|-|
|int|最基础的类型，表示一个整数  |`1`,`114514`,`-5`|
|float|表示一个单精度浮点数|`2.5`,`1.0`,`9.5e6`|
|bool|表示一个布尔型数据|`true`,`false`|
|nbt|表示一个NBT数据|`"a":{"b":"c"}`,`"a":[1,2,3,4]`|
|list|表示一个列表|`[1,2,3,4]`,`["a","b","c"]`|
|dict|表示一个字典|`{"a":1,"b":2,"c":3}`|
|map|字典的更高级包装，拥有比字典更多的功能|同上|
|string|表示一个字符串|`"mcfpp"`,`"qwq"`|
|jtext|表示一个Json原始文本|`"mcfpp"`,`{"text":"mcfpp","color":"#114514"}`|
|entity|表示一个实体。储存了一个实体的UUID|略|
|selector|表示一个目标选择器|`@a`,`@p[limit=6]`|

以下是对类型的简要介绍，可以逐一展开查看：

::: details int
**int**类型是MCFPP中最基础的类型，表示一个整数。它可以是正数、负数、零，也可以是十进制、二进制、八进制、十六进制等。一个int类型的数据会被储存为一个记分板变量，因此它的大小和记分板的大小一样。
:::

::: details float
**float**类型是MCFPP中表示一个单精度浮点数的类型。它可以是正数、负数、零，也可以是十进制、科学计数法等。MCFPP的浮点数运算依赖[小豆的数学库完成](https:#github.com/xiaodou8593/math2.0)。浮点数的运算为纯粹的记分板运算，因此占用量不会很大。
:::

::: details bool
**bool**类型是MCFPP中表示一个布尔型数据的类型。它只有两个值：`true`和`false`。bool类型的数据会被储存为一个记分板变量，因此它的大小和记分板的大小一样。
:::

::: details nbt
**nbt**类型表示一个NBT数据。不过实际上，NBT类型的数据更多情况下只是储存了一个NBT路径，因此把它们称作NBT指针也不足为过。值得注意的是，**nbt**类型的变量是大多数基本类型的基础，例如`list`，`map`等都依托NBT数据的操作实现。
:::

::: details list
**list**类型表示一个列表。`list`类型实现了java中`ArrayList`的大多数方法，详细可以参考标准库的API。`list`会被储存为一个NBT列表。
:::

::: details dict
**dict**类型表示一个字典，被储存为一个NBT复合标签。受MC的限制，`dict`类型只能进行基本的键值对插入和删除操作，无法进行遍历操作。你可以使用`map`来进行更多的操作。
:::

::: details map
**map**类型是`dict`类型的更高级包装，拥有比`dict`更多的功能。`map`类型实现了java中`HashMap`的大多数方法，详细可以参考标准库的API。但是值得注意的是，`map`的更高级包装意味着`map`会拥有比`dict`更多的开销。
:::

::: details string
TODO
:::

::: details jtext
TODO
:::

::: details entity
TODO
:::

::: details selector
TODO
:::

## var关键字

`var`关键字是MCFPP中的一个特殊关键字，它可以用来声明一个变量，而不需要指定变量的类型。编译器会根据变量的初始化表达式来推断变量的类型。

然而，如果要使用`var`关键字声明一个变量，那么变量的初始化表达式是必须的。

例如：

```mcfpp
var i = 5; #i的类型会被推断为int
var j = 5.0; #j的类型会被推断为float
var i; # [!code error] #错误，缺少初始化表达式
```

## 变量修饰符

变量修饰符可以用来表示变量的类型，包括`dynamic`，`const`，`import`

- dynamic

在编译过程中，如果有变量被声明为字面量，例如`int i = 5;`，编译器就会对此变量进行优化处理，比如`i += 7`，会直接在编译器中将`i`记录为12而非编译为记分板命令。而 `dynamic`用于表示一个变量无论如何都会是编译时动态计算的，即使它是一个字面量。例如`dynamic int i = 5;`，`i`在编译时也会被当作一个动态变量，而不会被优化。

- const

`const`用于表示一个变量是一个常量，即它的值在编译时就已经确定了，且不会改变。例如`const int i = 5;`，`i`在编译时就会被当作一个常量。常量总是编译时静态的。常量的值必须在声明时就确定，不能在声明后再赋值。

## 变量的编译时优化

在编译的过程中，编译器会针对一些编译器已知的量进行优化处理。当一个变量被直接赋值为字面量的时候，编译器就会记住这个变量的名字，直到对这个变量失去跟踪。

```mcfpp
int i = 5;  #编译器记住了这个变量的值为5
i += 7;     #编译器直接将i的值记为12，不会输出记分板命令
int j = i;  #编译器同样也知道了j的值

import int x;
j = x;      #编译器丢失了对j具体值的跟踪
j += 1;     #编译器会输出记分板命令
```