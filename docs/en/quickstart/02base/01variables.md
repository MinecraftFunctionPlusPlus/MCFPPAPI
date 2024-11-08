---
lastUpdated: true
---

# Variable

## Defination of variables

Same as other languages, you can define some variables in MCFPP for store, transfer and process data.

The defination of data is like this:

```mcfpp
#<type> <identifier> [= <expression>]
int i = 5;
int b = i * 6;
```

The identifier of variable can be the combination of any characters and numbers. In one scope, a name of variable only can defined once.

## Type of variable 

In MCFPP, variable have basic data type and combined data type. Basic data type is hard-coding and built-in, but combined data types, such as class, template and so on, can be determined by the developer themselves. So on, the basic types MCFPP have is shown here:

| Type name | Type description | Example |
|-|-|-|
|int| The most basic data type, represent an integer |`1`,`114514`,`-5`|
|float| Represent a single-precision floating-point |`2.5`,`1.0`,`9.5e6`|
|bool| Represent a Boolean data |`true`,`false`|
|nbt| Represents a NBT data |`"a":{"b":"c"}`,`"a":[1,2,3,4]`|
|list| Represent a list |`[1,2,3,4]`,`["a","b","c"]`|
|dict| Represent a dictionary |`{"a":1,"b":2,"c":3}`|
|map|A high-level implement of dictionary, have much more functions than dictionary | Same as dictionary |
|string| Represent a string |`"mcfpp"`,`"qwq"`|
|text| Represents the raw json text |`"mcfpp"`,`{"text":"mcfpp","color":"#114514"}`|
|entity| Represent an entity. Store the UUID of an entity | omit |
|selector| Represent a entity selector |`@a`,`@p`|

There's a simple introduction for type, You can expand and view them one by one:

::: details int
**int**  type is the most basic type in MCFPP, represent a integer. It can be positive, negative, zero. Also can be decimal , binary, octal and hexadecimal. An int type data will be stored as a score board variable, So it’s size is same as the score board.
:::

::: details float
**float** type is  a single-precision floating-point type in MCFPP. It can be positive, negative, zero. And also can be decimal, scientific notation and so on. The float calculation of MCFPP relies on [XiaoDou's MathLib](https:#github.com/xiaodou8593/math2.0). The calculation of float calculation is purely score board calculation, so the memory usage won’t be so big.
:::

::: details bool
**bool** type is a type of Boolean data in MCFPP. It only have two values: `true` and `false`. Bool type data would be stored as a score board variable, so it’s size is same as the score board.
:::

::: details nbt
**nbt** type represent a NBT data. But in fact, most times NBT type data just stores a NBT path, so in fact it can be called as NBT Pointer. It’s worth mentioning, **nbt** type variables is the basic of most basic types. Like `list`, `map` are both archive by the NBT data operations.
:::

::: details list
**list** type represent a list, `list` type achieved most functions of `ArrayList` in Java, more details can read the API of the standard library. `list`would be stored as a NBT list.
:::

::: details dict
**dict** type represent to a dictionary, which stored as a combined NBT tag. Because the limit of Minecraft, `dict` type only can insert and delete to basic key values, can’t iterating over an array. You can use `map` to have more operations.
:::

::: details map
**map** type high-level implement of `dict`, have much more functions than `dict`. `map` type achieve most functions of `HashMap` in Java, more details are in the API of the standard library. But it’s worth mentioning that the higher implement of `map` means `map` have more cost than `dict`.
:::

::: details string
Represent a string, which is a string tag in NBT.
:::

::: details text
Represent a raw JSON text, compared to `string` type, `text` type can contain more format information, such as color, bold and so on. `text` type data will be stored as a combined NBT tag.
:::

::: details entity
Reference to a single entity. Stored as a UUID integer NBT array.
:::

::: details selector
Represent a entity selector. Stored as a string.
:::

## `var`

Keyword `var` can be used to declare a variable, without specifying variable types. Compiler would infer the type of the variable by the initialization expression.

However, if we use `var` to declare a variable, then the initialization expression is necessary.

For example:

```mcfpp
var i = 5; # type of i will be inferred as int
var j = 5.0; # type of j will be inferred as float
var i; # [!code error] # Error, there’s no initialization expression 
```

## Variable modifiers

Variable modifiers can used to represent the type of variables, including `dynamic`, `const`, `import`

- dynamic

During Compiling, If any variable has been defined as literal, like `int i = 5;`, compiler will optimize this variable, such as `i += 7` will record `i` as 12 but not compile as scoreboard command. And `dynamic` is used to represent the variable is always dynamic calculating during compilation, though it’s a literal. Such as `dynamic int i = 5;`, `i` will be seen as a dynamic variable during compilation, and won’t be optimized.

- const

`const` means a variable is always constant. That is, its value is given during compilation, and never changes. Such as `const int i = 5;`, `i` will be seem as constant during compiling. Constant is always static during compiling, and its value must be clear when we declare it, can’t assign after declaring.

- import

`import` means a variable is import variable, it’s value is imported from other place. Such as `import int i;`, `i` will be seen as import variable after compile. Often, variable only can be used after assignment, but if we use `import` modifier, Then variable can be used after declaration without assignment.

## Optimization of variables

During compilation , compiler will optimize to some known values. When a variable’s value be set as a literal, compiler would record it’s name, until lose track to this variable.

```mcfpp
int i = 5;  # Compiler record it’s value is 5
i += 7;     # Compiler set i’s value as 12 directly, won’t output score board command
int j = i;  # Compiler also knows j’s value now

import int x;
j = x;      # Compiler lose track to what j’s value actually is 
j += 1;     # Compiler will output score board command 
```
