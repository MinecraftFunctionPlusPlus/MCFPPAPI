---
lastUpdate: true
---

# Generic Functions

## Generic Parameters

Earlier, we discussed the concept of compile-time constants. In MCFPP, you can declare a function that requires some compile-time constants as parameters. These parameters are enclosed in `<>` to distinguish them from regular parameters. When calling the function, you also need to enclose the compile-time constant parameters in `<>`.

```mcfpp
func test<i as int>{
    print(i);
}

func main(){
    test<5>;
    test<6>;
}
```

In the above example, the `test` function accepts a compile-time constant `i` as a parameter and prints it. In the `main` function, we call the `test` function twice, passing `5` and `6` as arguments. The `test` function will print `5` and `6` accordingly.

It's important to note that the compiler will not immediately compile the `test` function but will wait until it's called. Then, the compiler will compile the `test` function code, replacing `i` with `5` and `6` respectively. This way, the `test` function will have two versions that print `5` and `6`. In the compiled datapack, only the compiled versions of the `test` function will be included, and the original `test` function will not be present.

## Type Parameters

There is a special kind of variable called type variable. Type variables must always be compile-time constants, meaning they are always known to the compiler. If you try to cause the compiler to lose track of a type variable, it will throw an error.

You can declare type variables using the `type` keyword. For example:

```mcfpp
var t as type = int;
```

At this point, `t` represents the `int` type. However, you cannot yet use `t` in a variable declaration like `t qwq = 1`, because `t` has not been registered in the compiler's type cache. You can only use this type variable in variable declarations when it is passed into the compiler as a generic parameter of a function.

```mcfpp
func test<T as type>(i as T){
    print(qwq);
}

func main(){
    var t = int;
    test<t>(1);
}
```
