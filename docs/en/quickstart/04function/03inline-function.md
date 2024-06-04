---
lastUpdate: true
---

# Inline function 

In MCFPP, we can use keyword `inline` to declare an inline function. When call this function, compiler will insert the code into the code directly, but not call the function. So it can reduce the cost of calling functions, make the program more efficient. 

## Declare of inline function 

The grammar of declare a inline function is:

```mcfpp
inline func functionName(parameter1, parameter2, ...) -> returnType{
    #Function body
}
```

## Call of inline function 

In the place of calling inline function, compiler will insert the inline function directly, but not call the function. Such as the example below:

```mcfpp
inline func add(int a, int b) -> int{
    return a + b;
}

func main(){
    print(add(1, 2));
}
```

During compilation, the code is same as:

```mcfpp
func main(){
    int a = 1;
    int b = 2;
    int ret = a + b;
    print(ret);
}
```

This means that, in the inline function, the change to variable will effect the variable out of the function.
