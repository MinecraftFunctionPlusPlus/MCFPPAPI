---
title: 快速开始
order: -1
nav:
  title: 快速开始
  order: -1
---
注意mcfpp语句是以分号结尾的。

# 工程信息文件JSON格式
工程信息文件置于工程根目录的位置，作为编译器编译的入口，包含了工程的所有信息。
```json
{
    //工程包含的文件。允许通配符*和相对路径
    //使用*表示目录下的所有文件
    "file":[
        "*"                           
        "D:/workspace/mcfpp/project/*"     
    ],
    //目标编译的mc版本
    "version":"1.19.4",                 
    //此工程引用到的其他工程
    "include":[
        "D:/workspace/mcfpp/another_project.json"
    ],
    "targetPath":"./out",               //编译后的输出目录
    //工程的默认命名空间。可选，默认为default
    "namespace":"mcfpp"
}
```

# 通用语法
## 变量
声明：`type identifier (= expr)?;`
例如：`int i = 5 + p;`，`int x,y,z;`
mcfpp 支持的运算符有`+`,`-`,`*`,`/`,`%`(取余),`&&`,`||`,`!`,`++`,`--`
注意`++`和`--`只能单独作为一个语句，即只能`i++;`，而不能`i = i ++;`

mcfpp的基本数据类型有：
|类型名     |类型描述                   |例子                                          |
|-----------|--------------             |-----------                                  |
|int        |最基础的类型，表示一个整数  |`1`,`114514`,`-5`                             |
|double     |表示一个双精度浮点数        |`2.5`,`1.0`,`9.5e6`                           |
|jstring    |表示一个Json原始文本        |`"mcfpp"`,`{"text":"mcfpp","color":"#114514"}`|
|string     |表示一个字符串              |`"mcfpp"`,`"qwq"`                             |
|entity     |表示一个实体                |略                                            |
|selector   |表示一个目标选择器          |`@a`,`@p[limit=6]`                            |

### 变量修饰符
变量修饰符可以用来表示变量的类型，包括`dynamic`，`const`，`import`
- dynamic
在编译过程中，如果有变量被声明为字面量，例如`int i = 5;`，编译器就会对此变量进行优化处理，比如`i += 7`，会直接在编译器中将`i`记录为12而非编译为记分板命令。而 `dynamic`用于表示一个变量无论如何都会是编译时动态计算的，即使它是一个字面量。例如`dynamic int i = 5;`，`i`在编译时也会被当作一个动态变量，而不会被优化。
- const
`const`用于表示一个变量是一个常量，即它的值在编译时就已经确定了，且不会改变。例如`const int i = 5;`，`i`在编译时就会被当作一个常量。常量总是编译时静态的。常量的值必须在声明时就确定，不能在声明后再赋值。
- import
`import`用于表示一个变量是一个导入变量，即它的值是从其他地方导入的。例如`import int i;`，`i`在编译时就会被当作一个导入变量。一般来说，变量需要被赋值后才能使用，但是如果使用了`import`修饰符，那么变量就可以在声明后直接使用，而不需要赋值。

## 注释
```cpp
//单行注释

/*
* 块注释
*/
```

## 逻辑语句

- if
```cpp
if(bool){
    statement...
}else if(bool){
    statement...
}else{
    statement...
}
```
- while
```cpp
while(bool){
    statement...
}
```
- do-while
```cpp
do{
    statement...
}while(bool);
```
- for
```cpp
for(forinit;bool;forupdate){
    statement...
}
```
break和continue语句是可用的。

## 命名空间
每个文件的命名空间可以被单独声明
```cpp
namespace xxx;
```
若文件没有单独声明命名空间，则为工程配置文件设置的命名空间。

## 函数
```cpp
returnType identifier(type param...){
    statement...
}
```
函数的命名空间由文件的命名空间决定。若文件没有单独声明命名空间，则为工程配置文件设置的命名空间。
:::warning{title=Note!}
mcfpp中的函数名只能包含字母、下划线及数字。
:::
return是可用的。

### 函数的注解
函数的注解是可选的，用于指定函数的一些特殊属性。
```cpp
@tag("example:qwq")
@tick()
void test(){
    statement...
}
```
注解由一个`@`符号开始，后面跟着一个标识符，然后是一对括号，括号中是注解的参数列表。注解中的参数只能为常量，不能为变量。
下面列出了mcfpp中的所有注解：
|注解名|参数|描述|
|-----|----|----|
|tag|一个命名空间id|指定函数的标签|
|tick|可选。一个非0整数，表示函数每隔多少tick执行一次。若不指定，则默认为每tick执行一次|指定函数为tick函数|
|load|无|指定函数为load函数|

### static关键字
mcfpp的函数有一个特殊的形参形式用于返回，即static参数。static使得函数中对此变量的改变会影响到传入此函数的变量。例如
```cpp
void test(static int a,int b){
    a++;
    b++;
}

void main(){
    int a = 0;
    int b = 0;
    test(a,b);
}
```
最后结果a的值为1，b为0。

## 全局作用域 <Badge type="info">未来特性</Badge>
全局作用域是指在类和函数之外的域，可以在其中声明变量。全局作用域和命名空间有关。在全局作用域之内声明的变量可以在命名空间中的任意位置进行访问。全局作用域的声明语法是：
```cpp
global {
    int i = 6;
}

```
一个命名空间下只能声明一次全局作用域。例如：
```cpp
namespace test;

global {
    int i = 5;  //全局变量
    float b = 9;
}

void main(){
    print(i);   //使用全局变量
}
```

## 类
```cpp
class ClassName{
    classMember...
}
```
:::warning{title=Note!}
mcfpp中的类必须以大写字母开头。
:::
### 访问修饰符
- public 公开的
- protect 只有自己和子类能访问
- private （默认）私有的

### 类字段
`访问修饰符+普通的变量定义`
例如:`public int i;`
### 类函数
`访问修饰符+普通的函数定义`
例如:`public void qwq(){}`

**static是可用的**

### 构造函数
`访问修饰符+类名(参数){方法体}`
### 继承
`子类 : 父类/父接口`。允许继承多个类或接口。
使用`override`关键字，从而实现对父类或者父接口中方法的重写。
### super和this
调用父类构造方法：`super()`
调用自己的构造方法：`this()`
访问自身及父类的字段：`this.xxx`
访问静态成员：`ClassName.xxx`或`ClassName.function()`
:::warning{title=Note!}
在mcfpp中，要访问一个类的成员，必须使用this关键字或者使用类名进行访问。
:::

下面是一个完整的类的例子
```cpp
class Student{
    static int id;

    int stuId;
    int score;

    public Student(int score){
        this.stuId = id;
        Student.id++;
        this.score = score;
    }

    public getScore(static int score){
        score = this.score;
    }
}
```

### 抽象类和抽象函数
在类前添加`abstract`关键字可以将这个类声明为抽象类。抽象类不能被实例化。
在函数前添加`abstract`关键字可以将这个函数声明为抽象函数。抽象函数不能含有函数体。

### 扩展方法
扩展方法使你能够向现有类型“添加”方法，而无需创建新的派生类型、重新编译或以其他方式修改原始类型。扩展方法在类的外部声明，但是可以像类的成员方法一样调用。
使用`类名.方法名`的形式来声明扩展方法，例如：
```cpp
namespace test;

void main(){
    Test t = Test();
    t.test1();      //调用扩展方法
    Test.test2();   //调用静态扩展方法
}

class Test{
    private int index = 0;
    public static int i = 0;

    public int index = 0;

    public Test(){
        this.index = Test.i;
        Test.i = Test.i + 1;
    }
}

//声明扩展方法
void Test.test1(){
    print(this.index);
}

//声明静态扩展方法
static void Test.test2(){
    print(Test.i);
} 
```
## 接口
```cpp
interface InterfaceName{
    interfaceMember...
}
```
你可以在接口中声明抽象函数。接口可以继承于其他接口。

## 结构体
结构体是一种完全由记分板构成的数据结构，因此结构体中只能有记分板变量，即`int`类型的变量作为成员。
在声明字段的时候，可以将字段类型`int`省略不写。
除此之外结构体和类几乎完全一致。
下面是一个结构体的例子：
```cpp
struct FloatStruct{
    public static int index;
    public int member1;
    public member2;

    public FloatStruct(){
        member1 = index;
        index++;
    }

    public void print(){
        print(this);
    }
}
```
:::warning{title=Note!}
#### 类和结构体的区别
虽然语法和功能基本一致，但是类和结构体在实现原理上有着本质的区别。

类是一个对象，而结构体是一个数据结构。

在具体的实现方面，类的实现方式是基于实体的，一个实体作为一个类的对象，实体上储存了类的各种信息，如果在类的方法中，设定了一个`selector s = @s`的变量，那么`s`将会指向类实体本身。同时，类的实体还会拥有一个记分板的值作为堆地址的模拟，每一个实例都有一个独一无二的记分板的值作为地址。而类的指针实际上指向的是这个记分板的值来指向这个实体，从而实现了类的指针。

而结构体的实现方式则是基于记分板的。结构体通过记分板的命名来区分“内存”区域。例如命名空间为test下的结构体foo，有成员mem，那么mcfpp就会创建一个名字为`struct_test_foo_mem`的记分板。这个结构体的实例则会根据实例变量的名字（在Minecraft中的标识符）来记分板上记录对应的值，例如`foo a`，在记分板上对应的值就是`前缀_a`。同时，结构体变量也是一种值类型的变量，而不是引用类型。因此在赋值的时候会把整个结构体进行一次复制，在参数传递的时候应当注意结构体的大小问题。
:::


## MNI
MNI类似于Java中的JNI，是一种编程框架，使得编译器在程序编译的过程中可以调用由**Java**代码编写的本地程序，从而实现更灵活的编写。MNI只存在于编译过程中，而不能存在于运行过程中。

### native函数
native可以被声明在类或者函数中，用于在**编译**阶段调用运行指定的一个java函数。
它的声明是这样的：
```cpp
native test(params...) -> packagename.classname.funcname;  
```
前面是一个普通的函数声明（但是不包括返回类型，也就是说native函数没有返回类型），箭头所指的则是java中的一个方法的完整路径，包括包，类和方法名。
相应的java函数的声明有一个要求，即函数的参数必须为`(Var[] xxx, ClassBase cls)`。`Var[] xxx`是调用这个函数时传入的参数的信息，`ClassBase cls`是这个函数所在的类的对象。如果这个函数不是一个类的成员，则`cls`参数将会是`null`
这是一个例子，也是是mcfpp基本库的一部分，即print函数的实现：

**System.java**
```js
package top.mcfpp.lang;

import org.jetbrains.annotations.NotNull;
import top.mcfpp.annotations.InsertCommand;
import top.mcfpp.lang.*;
import top.mcfpp.lib.Function;

public class System {
    
    //Native函数
    public static void print(@NotNull Var[] vars, ClassPointer cls) {
        //只会有一个参数哦
        Var var = vars[0];
        if (var instanceof MCInt) print((MCInt) var);
        else if (var instanceof JsonString) print((JsonString) var);
        else print(var);
    }

    @InsertCommand
    public static void print(@NotNull MCInt var) {
        if (var.isConcrete()) {
            //是确定的，直接输出数值
            Function.Companion.addCommand("tellraw @a " + var.getValue());
        }else {
            Function.Companion.addCommand("tellraw @a " + new JsonTextNumber(var).toJson());
        }
    }

    @InsertCommand
    public static void print(JsonString var){
        Function.Companion.addCommand("tellraw @a " + var.getJsonText().toJson());
    }

    @InsertCommand
    public static void print(@NotNull Var var){
        Function.Companion.addCommand("tellraw @a " + "\"" +var + "\"");
    }

}

```

**sys.mcfpp**
```cpp
native print(int i) -> top.mcfpp.lang.System.print;
native print(bool b) -> top.mcfpp.lang.System.print;
```

**test.mcfpp**
```cpp
void main(){
    print(1);
    print(true);
}
```
