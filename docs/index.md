---
title: Quick start
order: -1
nav:
  title: Quick start
  order: -1
---

Notice: sentences of mcfpp is end up with semicolon.

# Project information file in JSON format

Project information file is situated on root of engineering catalogue, As an entry for compiler compilation, contains all information about the project.

```json
{
    //Files included in the project. Allow the use of wildcard * and relative paths
    //Use * to represent all files in the catalog
    "file":[
        "*"                           
        "D:/workspace/mcfpp/project/*"     
    ],
    //The target Minecraft version it compiles 
    "version":"1.19.4",                 
    //Other projects referenced by this project
    "include":[
        "D:/workspace/mcfpp/another_project.json"
    ],
    "targetPath":"./out",               //Output catalog after it’s compiled 
    //The default namespace of the project. Optional, default is “default”
    "namespace":"mcfpp"
}
```

# General grammar

## Variables 

Declare : `type identifier (= expr)?;`

Such as : `int i = 5 + p;`，`int x,y,z;`

The operators mcfpp support are `+`,`-`,`*`,`/`,`%`(Take the remainder),`&&`,`||`,`!`,`++`,`--`

Notice that `++` and `--` only can be independent sentence, that means, it only can be `i++;`, but not `i = i ++;`

Basic data type of mcfpp are:

| Data type    | Description                  | Example                                         |
|-----------|--------------             |-----------                                  |
|int        | The most basic data type, represent an integer |`1`,`114514`,`-5`                             |
|double     | Represent a double-precision floating point numbers       |`2.5`,`1.0`,`9.5e6`                           |
|jstring    | Represent a JSON raw text      |`"mcfpp"`,`{"text":"mcfpp","color":"#114514"}`|
|string     | Represent a string            |`"mcfpp"`,`"qwq"`                             |
|entity     | Represent a entity              | omit                                            |
|selector   | Represent a entity selector       |`@a`,`@p[limit=6]`                            |

### Variable modifier

Variable modifiers can used to represent any type of variable, including `dynamic`，`const`，`import`

- dynamic

During Compiling, If any variable has been defined as literal, like `int i = 5;`, Compiler will optimize this variable, such as `i += 7` will record `i` as 12 but not compile as scoreboard command. And `dynamic` is used to represent the variable is always dynamic calculating during compilation, though it’s a literal. Such as `dynamic int i = 5;`, `i` will be seen as a dynamic variable during compilation, and won’t be optimized.

- const

`const` means a variable is always constant. That is, its value is given during compilation, and never changes. Such as `const int i = 5;`, `i` will be seem as constant during compiling. Constant is always static during compiling, and its value must be clear when we declare it, can’t assign after declaring.

- import

`import` means a variable is import variable, it’s value is imported from other place. Such as `import int i;`, `i` will be seen as import variable after compile. Often, variable only can be used after assignment, but if we use `import` modifier, Then variable can be used after declaration without assignment.

## Comment

```cpp
//Single line comment

/*
* Block comment
*/
```

## Logical statements

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
break and continue is available 

## Namespace 

Each file’s namespace can be declared independently 

```cpp
namespace xxx;
```

If the file haven’t declared a separate namespace, the namespace defaults to the namespace set in the project configuration file.

## Function 

```cpp
returnType identifier(type param...){
    statement...
}
```

Function’s namespace is decided by the file’s namespace. If the file haven’t declared a separate namespace, the namespace defaults to the namespace set in the project configuration file.

:::warning{title=Note!}
In mcfpp, function name only can contains characters, underline and numbers.
:::

return is available.

### Annotation of function 

Annotation of function is optional, used for designate some special attributes of the function.

```cpp
@tag("example:qwq")
@tick()
void test(){
    statement...
}
```

Annotation starts with symbol `@`, followed by an identifier, then with a bracket. Inside the bracket, it’s a list of exegesis parameters. All parameters in the Annotation only can be constant, can’t be variable.

Here’s all annotation in mcfpp:

| Annotation | Parameter | Description |
|-----|----|----|
| tag | A namespace id | Designate the tag of the function |
| tick | Optional, a non-zero integer, representing how many ticks does the function execute. If not specified! It’ll execute every tick. | Designate the function as tick function |
| load | None | Designate the function as load function |

### static keyword

Function of mcfpp have a special parameter used for return, that is static. Static makes changes to this variable in a function affect the variables passed into the function. For example 

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

The result value for a is 1, b is 0.

## Global scope <Badge type="info">Future characteristic</Badge>

Global scope is the scope out of class and function, can declare variables in it. Global scope is related to the namespace. The variables that declared in global scope can be accessed by any position in the namespace. The grammar for global scope declaration is:

```cpp
global {
    int i = 6;
}

```

We can only declare global scope once in one namespace, For example:

```cpp
namespace test;

global {
    int i = 5;  //Global scope 
    float b = 9;
}

void main(){
    print(i);   //Use global scope 
}
```

## Class

```cpp
class ClassName{
    classMember...
}
```

:::warning{title=Note!}
Class of mcfpp must start with majuscule
:::

### Access modifier

- public Can access by any class 
- protect Only can access by itself or it’s subclasses
- private （default）Only can access by itself

### Class field

`Access modifier + normal variable declaration`
Such as : `public int i;`

### Class function 

`Access modifier + normal function declaration `
Such as : `public void qwq(){}`

**static is available **

### Constructor 

`Access modifier + Class name(Parameter){Function}`

### Inheritance

`Subclass : Parent class/Parent interface`. Allow override many classes and interfaces.

Use keyword `override`, And achieve rewrite to parent classes and interfaces 

### super and this

Call parent class’ constructor : `super()`

Call itself’s constructor : `this()`

Call itself and parent class’ constructor : `this.xxx`

Access static member : `ClassName.xxx` or `ClassName.function()`

:::warning{title=Note!}
In mcfpp, when access a class’s member, must use keyword ‘this’ or class name.
:::

Here’s a example for a complete class 

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

### Abstract class and abstract function 

Add `abstract` keyword before class can declare the class as abstract class. Abstract function can’t be instantiate.

Add `abstract` keyword before function can declare the function as abstract function. Abstract function can’t include function body.

### Extension Function

Extension Function makes you can “add” function to current types. And don’t need to create new derived type, recompile or change original data type by other methods. Extension function declares out of the class, but it also can be called, as other functions in the class.

Declares extension function in the form of `Class name.Function name`, for example:

```cpp
namespace test;

void main(){
    Test t = Test();
    t.test1();      //Call extension function 
    Test.test2();   //Call static extension function 
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

//Declare extension function 
void Test.test1(){
    print(this.index);
}

//Declare static extension function 
static void Test.test2(){
    print(Test.i);
} 
```

## Interface

```cpp
interface InterfaceName{
    interfaceMember...
}
```

You can declare abstract function in the interface. Interface can inherit from other interfaces.

## Structure 

Structure is a datatype that totally makes up by score board. So structure only can contain score board, that’s `int` type variables as members.

When declaring field, we can ignore type ‘int’. Except this, structure is almost the same as class.

Here’s an example of structure:

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

#### Difference between class and structure 

Although grammar and function are basically the same, but here’s an essential difference of implementation principle between class and structure.

Class is an object, but structure is a data structure.

On the side of how they actually achieving, the achieving of class is based on entities, as an object of a class, entities store different information about the class. If there’s a variable `selector s = @s` in the function of the class, then `s`would point to the entity itself. At the same time, the entity of the class would own a scoreboard’s value as the simulation of its heap Address. Every example have a specific scoreboard value as an address. And the class pointer actually points to the value of the scoreboard to point to this entity, thus achieving the class pointer.

The method of achieving structure is based on the score board. Structure distinguish the “memory” place by the name of the score board. Such as the structure foo under the namespace test, there’s member mem, so mcfpp will create a score board called `struct_test_foo_mem`. The instance of the structure would record the corresponding value on score board by the name of the instance variables(Identifier in Minecraft), such as `foo a`, the corresponding value in the score board is `<prefix>_a `. Also, structure variable is also a kind of value type variable, not reference type. So, during variable assignment, it’ll copy the whole structure once. So you should notice the size problem when passing parameters.
:::


## MNI

MNI is similar with the JNI in Java, is a kind of programming framework, makes the compiler can call the local program that’s written by **Java** when compiling, and achieve more flexible programming. MNI only exist in the process of compiling, but not exist when running.

### native function 

native can be declared in classes or functions, Used to run a specific Java function when **compiling**.

It’s declaration is like this:

```cpp
native test(params...) -> packagename.classname.funcname;  
```

The left side is a normal function declaration (But don’t include return type, that means native function have not return type.) The arrow point to is a complete path in a java function , including path, class and function name.

There’s a requirement for the declaration of corresponding Java functions, the parameter of the function must be `(Var[] xxx, ClassBase cls)`. `Var[] xxx` is the incoming parameter information when call the function, `ClassBase cls` is the object of the class of the function. Is the function isn’t member of any class, then `cls` parameter would be `null`

There’s an example, also a part of mcfpp basic library, that’s the achieving of print function:

**System.java**
```js
package top.mcfpp.lang;

import org.jetbrains.annotations.NotNull;
import top.mcfpp.annotations.InsertCommand;
import top.mcfpp.lang.*;
import top.mcfpp.lib.Function;

public class System {
    
    //Native function 
    public static void print(@NotNull Var[] vars, ClassPointer cls) {
        //Only one parameter 
        Var var = vars[0];
        if (var instanceof MCInt) print((MCInt) var);
        else if (var instanceof JsonString) print((JsonString) var);
        else print(var);
    }

    @InsertCommand
    public static void print(@NotNull MCInt var) {
        if (var.isConcrete()) {
            //Is certain, output value directly 
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
