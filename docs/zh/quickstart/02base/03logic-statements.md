---
lastUpdated: true
---

# 逻辑语句

::: tip
MCFPP中的逻辑语句和C/Java中的逻辑语句完全一致。如果你对其他语言足够熟悉，你可以跳过这一节。
:::

## if语句

`if`语句是一种条件语句，它用来判断一个条件是否成立。如果条件成立，那么`if`语句中的代码块将会被执行。`if`语句的语法如下：

```mcfpp
if (condition){
    #code
}
```

`condition`是一个布尔表达式，它的值为`true`或`false`。如果`condition`的值为`true`，那么`#code`中的代码块将会被执行。

`if`语句还可以和`else`语句一起使用，`else`语句用来在`if`语句的条件不成立时执行代码块。`if-else`语句的语法如下：

```mcfpp
if (condition){
    #code1
}else{
    #code2
}
```

`condition`是一个布尔表达式，它的值为`true`或`false`。如果`condition`的值为`true`，那么`#code1`中的代码块将会被执行；否则，`#code2`中的代码块将会被执行。

可以使用`else if`语句用来在`if`语句的条件不成立时判断另一个条件。`if-else if-else`语句的语法如下：

```mcfpp
if (condition1){
    #code1
}else if (condition2){
    #code2
}else{
    #code3
}
```

## while语句和do-while语句

`while`语句是一种循环语句，它用来重复执行一个代码块，直到条件不成立。`while`语句的语法如下：

```mcfpp
while (condition){
    #code
}
```

`condition`是一个布尔表达式。如果`condition`的值为`true`，那么则执行`#code`代表的代码块。此后，再次判断`condition`的值，如果`condition`的值为`true`，那么`#code`代表代码块将会被执行；如此循环，直到`condition`的值为`false`。

`do-while`语句和`while`类似，但是无论条件是否成立，它都会先执行因此循环体中的语句，而后再判断条件来决定是否继续进行。`do-while`语句的语法如下：

```mcfpp
do{
    #code
}while (condition);
```

## break和continue语句

`break`语句用来跳出整个循环，`continue`语句用来跳过本次循环。例如：

```mcfpp
for (int i = 0; i < 10; i++){
    if (i == 5){
        break;
    }
    if (i == 3){
        continue;
    }
    #code
}
```

在上面的例子中，当`i`的值为`5`时，`break`语句会跳出整个循环；当`i`的值为`3`时，`continue`语句会跳过本次循环，直接进行下一次循环。因此，i在每次循环中的变化为：`0`，`1`，`2`，`4`，`5`，最后跳出循环。

`break`和`continue`语句只能在循环中使用。
