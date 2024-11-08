---
lastUpdated: true
---

# Logic statements

::: tip
The logic statement of MCFPP is totally the same as in C/Java. You can skip this chapter if you already know it.
:::

## if statement

`if` statement is a condition statement, it can used to determine a condition is true or false. If true, then the code in the `if` statement block will be execute. The grammar of `if` is:

```mcfpp
if (condition){
    #code
}
```

`condition` is a boolean expression, it’s value is `true` or `false`. If the value of `condition` is `true`, then `#code` will be execute.

`if` statement can be used together with `else` statement, `else` statement used to execute the code when the condition in `if`is false. The grammar of `if-else` is shown:

```mcfpp
if (condition){
    #code1
}else{
    #code2
}
```

`condition` is a boolean expression, it’s value is `true` or `false`. If the value of `condition` is `true`, then `#code1‘ will be execute; Else, ’#code2‘ will be execute.

We can use `else if` to add another condition when `if` is false. The grammar of `if-else if-else` is shown below:

```mcfpp
if (condition1){
    #code1
}else if (condition2){
    #code2
}else{
    #code3
}
```

## while statement and do-while statement

`while` is a loop statement, it can execute a code block repeatedly, until the condition is false. The grammar of `while` statement is:

```mcfpp
while (condition){
    #code
}
```

`condition` is an boolean expression, when `condition` is `true`, it’ll execute the code block in `#code`. Then, determine the value of `condition` again. If value of `condition` is `true`, then `#code` will be execute; loop again and again, until the value of `condition` is `false`.

`do-while` statement is similar with `while` statement, but no matter the condition is true or false, it’ll execute the statement in the loop once, and then determine the condition to see continue execution or not. The grammar of `do-while` is shown below:

```mcfpp
do{
    #code
}while (condition);
```

## for statement 

`for` statement is a more complex version of loop, it’s grammar is:

```mcfpp
for (forinit; condition; forupdate){
    #code
}
```

`forinit` is an initialization expression, used to initialize loop variable. `condition` is a boolean expression, used to determine if the loop keeps going on. `forupdate` is a update expression, used to update the variable of the loop. `#code` represents the loop body, which is the code in the loop. The execute process of `for` is shown below:

1. Execute `forinit`, initialize the loop variable.
2. Determine the value of `condition`, if the value of `condition` is `true`, execute `#code`, then execute `forupdate`, to update the loop variable, and determine the value of `condition` again.
3. If the value of `condition` is `false`, exit the loop.

In `for` loop, the declaration of variable `forinit` only valid in the `for` loop.

## break and continue statement

`break` statement used to jump out the whole loop, `continue` statement used to skip the current loop. For example:

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

In this example, when the value of `i` is `5`, `break`will jump out of the loop; when the value of `i` is `3`, `continue` will jump this loop, go to the next loop directly. So, the change of I in each loop are:`0`，`1`，`2`，`4`，`5`, and finally jump out.

`break` and `continue` statement only can be used in the loop
