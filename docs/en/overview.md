---
title: Quick start
order: -1
nav:
  title: Quick start
  order: -1
---

# MCFPP Overview

Before the start: statements of mcfpp is end up with semicolon.

## Project information file in JSON format<Badge type="tip">WIP</Badge>

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
    //Where the compiled datapacks output. Set it to 'null' to disable output. 
    "targetPath":"./out",                
    //The default namespace of the project. Optional, default value is "default"
    "namespace":"mcfpp",
    //Optional, the description of the output datapack.
    "description": "A example MCFPP datapack",
    //Optional, whether to ignore the standard library. Default value is false
    "ignoreStdLib": false
}
```

## General grammar

### Variables

Defination : `type identifier (= expr)?;`

Such as : `int i = 5 + p;`，`int x,y,z;`

The operators mcfpp support are `+`,`-`,`*`,`/`,`%`(modular),`&&`,`||`,`!`,`++`,`--`

Notice that `++` and `--` only can be independent sentence, that means, it only can be `i++;`, but not `i = i ++;`<Badge type="tip">WIP</Badge>

Basic data type of mcfpp are:

| Data type    | Description                  | Example|
|-----------|--------------             |-----------|
|int        | The most basic data type, represent an integer |`1`,`114514`,`-5`|
|double     | Represent a double-precision floating point numbers       |`2.5`,`1.0`,`9.5e6`|
|jtext      | Represent a JSON raw text      |`"mcfpp"`,`{"text":"mcfpp","color":"#114514"}`|
|string     | Represent a string            |`"mcfpp"`,`"qwq"`|
|entity     | Represent a entity              | *omitted*|
|selector   | Represent a entity selector       |`@a`,`@p[limit=6]`|
|nbt        | Represent a NBT data            |`"a":{"b":"c"}`,`"a":[1,2,3,4]`|
|list       | Represent a list                |`[1,2,3,4]`,`["a","b","c"]`|
|dict       | Represent a dictionary          |`{"a":1,"b":2,"c":3}`|
|map        | A higher-level package of dictionary, with more functions than dictionary | Same as above|

### Variable modifier

Variable modifiers can used to represent any type of variable, including `dynamic`，`const`，`import`

- dynamic

During Compiling, If any variable has been defined as literal, like `int i = 5;`, Compiler will optimize this variable, such as `i += 7` will record `i` as 12 but not compile as scoreboard command. And `dynamic` is used to represent the variable is always dynamic calculating during compilation, though it's a literal. Such as `dynamic int i = 5;`, `i` will be seen as a dynamic variable during compilation, and won't be optimized.

- const

`const` means a variable is always constant. That is, its value is given during compilation, and never changes. Such as `const int i = 5;`, `i` will be seem as constant during compiling. Constant is always static during compiling, and its value must be clear when we define it, can't assign after declaring.

- import <Badge type="warning">Deprecated</Badge>

`import` means a variable is import variable, it's value is imported from other place. Such as `import int i;`, `i` will be seen as import variable after compile. Often, variable only can be used after assignment, but if we use `import` modifier, Then variable can be used after defination without assignment.

### Comment

```mcfpp
#Single line comment

##
Block comment
##
```

### Logical statements

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

`break` and `continue` is available.

## Namespace 

Each file's namespace can be defined independently 

```cpp
namespace xxx;
```

If the file haven't define a separate namespace, the namespace defaults to the namespace set in the project configuration file.

## Function 

```mcfpp
func identifier(type param...) -> returnType{
    statement...
}

#Example
func test(int i) -> int{
    return i + 1;
}

```

Function's namespace is decided by the file's namespace. If the file haven't defined a separate namespace, the namespace defaults to the namespace set in the project configuration file.

:::tip Tip
In mcfpp, function name can contains most utf-8 characters, but the compiled mcfunction's name will only contains characters, underline and numbers. The illegal characters will be replaced by `_uxxxx`.
:::

### Annotation of function <Badge type="tip">WIP</Badge>

Annotation of function is optional, used for designate some special attributes of the function.

```cpp
@tag("example:qwq")
@tick()
func test(){ 
    statement...
}
```

Annotation starts with symbol `@`, followed by an identifier, then with a bracket. Inside the bracket, it's a list of  arguments. All parameters in the Annotation only can be compile-time-concrete.

Here's all annotation in mcfpp:

| Annotation | Parameter | Description |
|-----|----|----|
| tag | A namespace id | Designate the tag of the function |
| tick | Optional, a non-zero integer, representing how many ticks does the function execute. If not specified! It'll execute every tick. | Designate the function as tick function |
| load | None | Designate the function as load function |

Custom annotation is not support currently.

### `static`

Function of mcfpp have a special parameter used for return, that is `static`. Static makes changes to this variable in a function affect the variables passed into the function. For example.

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

The result value for a is 1, b is 0.

## Top statement

In MCFPP, it is allowed to write statements directly at the beginning of a file without the need to define additional functions, i.e. top-level statements. The top-level statement is located within an implicit function, which has only one file and cannot be called externally. Its return value type is 'void'.

```mcfpp
print("Top statement");

func main(){
    print("Function");
}
```

## Class

```cpp
class ClassName{
    classMember...
}
```

### Access modifier

- public (default) CAN be accessed by any class
- protect CAN ONLY be accessed by itself or it's subclasses
- private CAN ONLY be accessed by itself

### Class field

`Access modifier + normal variable declaration`
Such as : `public int i;`

### Class function

`Access modifier + normal function declaration`

Such as : `public func qwq(){}`

static field is supported.

### Constructor

`Access modifier + constructor(Parameter){Function}`

### Inheritance

`Subclass : Parent class/Parent interface`. Allow override many classes and interfaces.

Use keyword `override`, And achieve rewrite to parent classes and interfaces 

### super and this

Call parent class' constructor : `super()`

Call itself's constructor : `this()`

Call itself and parent class' constructor : `this.xxx`

Access static member : `ClassName.xxx` or `ClassName.function()`

:::tip Tip
In mcfpp, when access a class's member, must use keyword ‘this' or class name.
:::

Here's a example for a complete class 

```cpp
class Student{
    static int id;

    int stuId;
    int score;

    public constructor(int score){
        this.stuId = id;
        Student.id++;
        this.score = score;
    }

    public func getScore() -> int{
        return this.score;
    }
}
```

### Abstract

Add `abstract` keyword before class can define the class as abstract class. Abstract function can't be instantiate.

Add `abstract` keyword before function can define the function as abstract function. Abstract function can't include function body.

### Extension Function

Extension Function makes you can "add" function to current types. And don't need to create new derived type, recompile or change original data type by other methods. Extension function defined out of the class, but it also can be called, as other functions in the class.

Define extension function in the form of `Class name.Function name`, for example:

```cpp
namespace test;

func main(){
    Test t = Test();
    t.test1();      #Call extension function 
    Test.test2();   #Call static extension function 
}

class Test{
    private int index = 0;
    public static int i = 0;

    public int index = 0;

    public constructor(){
        this.index = Test.i;
        Test.i = Test.i + 1;
    }
}

#Declare extension function 
func Test.test1(){
    print(this.index);
}

#Declare static extension function 
static func Test.test2(){
    print(Test.i);
} 
```

## Interface

```cpp
interface InterfaceName{
    interfaceMember...
}
```

You can define abstract function in the interface. Interface can inherit from other interfaces.

## Template <Badge type="tip">WIP</Badge>

Structure is a datatype that totally makes up by score board. So structure only can contain score board, that's `int` type variables as members.

During the defination of field, we can ignore type ‘int'. Except this, structure is almost the same as class.

Here's an example of structure:

```mcfpp
template FloatStruct{
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

:::tip Tip

#### Difference between class and structure 

Although grammar and function are basically the same, but here's an essential difference of implementation principle between class and structure.

Class is an object, but structure is a data structure.

On the side of how they actually achieving, the achieving of class is based on entities, as an object of a class, entities store different information about the class. If there's a variable `selector s = @s` in the function of the class, then `s`would point to the entity itself. At the same time, the entity of the class would own a scoreboard's value as the simulation of its heap Address. Every example have a specific scoreboard value as an address. And the class pointer actually points to the value of the scoreboard to point to this entity, thus achieving the class pointer.

The method of achieving structure is based on the score board. Structure distinguish the "memory" place by the name of the score board. Such as the structure foo under the namespace test, there's member mem, so mcfpp will create a score board called `struct_test_foo_mem`. The instance of the structure would record the corresponding value on score board by the name of the instance variables(Identifier in Minecraft), such as `foo a`, the corresponding value in the score board is `<prefix>_a `. Also, structure variable is also a kind of value type variable, not reference type. So, during variable assignment, it'll copy the whole structure once. So you should notice the size problem when passing parameters.
:::

## MNI

MNI is similar with the JNI in Java, is a kind of programming framework, makes the compiler can call the local program that's written by **Java** when compiling, and achieve more flexible programming. MNI only exist in the process of compiling, but not exist when running.

### native function

native can be defined in classes or functions, Used to run a specific Java function when **compiling**.

It's defination is like this:

```cpp
func test(params...) -> returnType = packagename.classname.funcname;  
```

Here's an example, also a part of mcfpp basic library, that is the implementation of print function. If you want to know more about MNI, you can check [here](/zh/quickstart/10mni/01mni-framework).

**System.java**

```java
package top.mcfpp.lang;

//Import statement omitted

public class System extends MNIMethodContainer {

    @NotNull
    @Override
    public Function4<Var<?>[], Var<?>[], CanSelectMember, ValueWrapper<Var<?>>, java.lang.Void> getMNIMethod(@NotNull String name) {
        return methods.get(name);
    }

    static HashMap<String, Function4<Var<?>[], Var<?>[], CanSelectMember, ValueWrapper<Var<?>>, java.lang.Void>> methods;

    static {
        methods = new HashMap<>();
        //Implement print function
        methods.put("print", (vars, vars2, canSelectMember, varValueWrapper) -> {
            //print function has only one parameter
            var value = vars2[0];
            if (value instanceof MCInt) print((MCInt) value);
            else print(value);
            return null;
        });
    }

    @InsertCommand
    public static void print(@NotNull MCInt var) {
        if (var instanceof MCIntConcrete varC) {
            //It's concrete, output the number directly
            Function.Companion.addCommand("tellraw @a " + varC.getValue());
        }else {
            Function.Companion.addCommand("tellraw @a " + new JsonTextNumber(var).toJson());
        }
    }

    @InsertCommand
    public static void print(@NotNull Var<?> var){
        Function.Companion.addCommand("tellraw @a " + "\"" +var + "\"");
    }
}
```

**sys.mcfpp**

```mcfpp
func print(int i) = top.mcfpp.lang.System.print;
func print(any a) = top.mcfpp.lang.System.print;
```

**test.mcfpp**
```cpp
func main(){
    print(1);
}
```
