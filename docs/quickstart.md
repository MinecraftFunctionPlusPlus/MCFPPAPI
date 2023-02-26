---
title: 快速开始
order: -1
nav:
  title: 快速开始
  order: -1
---
# 通用语法

如果你有编程基础，那就直接看看 mcfpp 语法概要吧！
如果没有编程基础，那还是乖乖看后面的[详细教材](/perface)吧~
注意mcfpp语句是以分号结尾的。

## 变量

`type identifier (= expr)?;`
例如：`int i = 5 + p;`，`int i;`
mcfpp 支持的运算符有`+`,`-`,`*`,`/`,`%`(取余),`&&`,`||`,`!`,`++`,`--`
注意`++`和`--`只能单独作为一个语句，即只能`i++;`，而不能`i = i ++;`

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
**break和continue语句是可用的。**
## 函数
```cpp
tag func namespace:functionname(type param...){
    statement...
}
```
namespace是可以省略的。如果省略，则默认按照当前文件的命名空间。
tag为函数的标签，是一个命名空间id。命名空间若省略，对于tick和load标签默认为minecraft命名空间，而其他则和文件命名空间一致。
:::warning{title=Note!}
mcfpp中的函数必须只能包含小写字母和下划线，和mcfunction中的函数命名法则一样。
:::
:::success{title=Tips!}
mcfpp的函数没有返回值，但是它有一个特殊的形参形式用于返回，即static。static使得函数中对此变量的改变会影响到传入此函数的变量。例如
```cpp
func test(static int a,int b){
    a++;
    b++;
}

func main(){
    int a = 0;
    int b = 0;
    test(a,b);
}
```
最后结果a的值为1，b为0。
:::
## 类
```cpp
class ClassName{
    classMember...
}
```
mcfpp中的类可以分开定义，也就是说，如果定义了两个相同的类，它们将会被看作一个类对待。<Badge type="warning">可能被移除的特性</Badge>
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
例如:`public func(){}`

**static是可用的**

### 构造函数
`访问修饰符+类名(参数){方法体}`
### 继承
`子类 extends 父类`
### super和this
调用父类构造方法：`super()`
调用自己的构造方法：`this()`
访问自身及父类的字段：`this.xxx`

下面是一个完整的类的例子
```cpp
class Student{
    static int id;

    int stuid;
    int score;

    public Student(int score){
        stuid = id;
        id++;
        this.score = score;
    }

    public getscore(static int score){
        score = this.score;
    }
}
```
## 特殊语法
### native函数
native可以被声明在类或者函数中，用于在**编译**阶段调用运行指定的一个java函数。
它的声明是这样的：
```cpp
native func test(params...) -> packagename.classname.funcname;  
```
前面是一个普通的函数声明，箭头所指的则是java中的一个方法的完整路径，包括包，类和方法名。
相应的java函数的声明有一个要求，即函数的参数必须为`(Var[] xxx, Class cls)`。`Var[] xxx`是调用这个函数时传入的参数的信息，`Class cls`是这个函数所在的类。如果这个函数不是一个类的成员，则`cls`参数将会是`null`
这是一个例子：
NativeTest1.java
```js
package top.alumopper.mcfpp.test;

import top.alumopper.mcfpp.lang.*;

public class NativeTest1{
    public static void test(Var[] vars, Class cls){
        System.out.println("MNI > Hello Minecraft!");
        for (Var v : vars) {
            System.out.println("MNI > Get argument " + v.identifier);
        }
    }
}
```
test.mcfpp
```cpp
native func test(int i) -> top.alumopper.mcfpp.test.NativeTest1.test;

func main(){
    int i = 0;
    test(i);
}
```