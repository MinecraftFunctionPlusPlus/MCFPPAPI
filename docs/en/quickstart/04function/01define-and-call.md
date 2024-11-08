---
lastUpdate: true
---

# Define and call

The way of define function in MCFPP has some differences with C/Java, and more similar to the grammar of Python.

## Function definition

In MCFPP, the grammar of define a function is shown below:

```mcfpp
func functionName(parameter1, parameter2, ...) -> returnType{
    #Function body
}
```

`func` is the keyword of function, while `functionName` is the identifier of the function. The following `parameter1, parameter2, ...` is the parameter list of the function. `returnType` is optional, which is the returned type of the function. Function body is a series of statements surrounded by `{}`. Here's a example below:

```mcfpp
func add(int a, int b) -> int{
    return a + b;
}
```

The name of the function is `add`, it have two integer-type parameters `a` and `b`, return value is also integer type. Its function is add the two parameters and return them.

## return

`return` is same as the `return` command in Minecraft, both used to return the returned value of the function. It's grammar is `return expression;`, `expression` is an expression, it's value is the returned value of the function.

If a function defined the type of the returned value, then each branch of it must have `return` statement, so the function must would return a value. And the value that `return` statement returned must have the same type as the type of return value of the function, or the subtype of the returned value's type.

If a function haven't defined the return value's type, then the default is `void`, which won't return any value. Now, `return` statement is still available, but its grammar becomes `return;`, without any expression. It will stop the function immediately.

## Call the function

In MCFPP, grammar of call function is the same as in C/Java, that's `functionName(parameter1, parameter2, ...);`. In it, the `functionName` is the name of function,`parameter1, parameter2, ...` are the parameters to the function, here's the example:

```mcfpp
func test(){
    print(add(1, 2));  #the add function defined before 
}
```

In this example, `test` function called `add` function, and sent two parameters `1` and `2`. `add` function returns `3`, so the `test` function will print `3`.

## The argument of function

In the function, the change to the parameter won't affect the variables out of the function. For example:

```mcfpp
func test(int a){
    a = 5;
}

void main(){
    int a = 0;
    test(a);
    print(a);   #output 0
}
```

In this case, `test` function modified the passed in parameter `a`, but the `a` in `main` function haven't been affected.
