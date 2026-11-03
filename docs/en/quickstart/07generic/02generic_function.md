---
lastUpdated: true
---

# Generic functions: choose a type

The same operation can accept different data types. For example, it can return an integer or a string supplied by its caller. Generics let you write one function and select its types at each call.

This page introduces type parameters. The [next page](./03generic_class) applies them to data templates. [Compilation parameters](./01concrete_var) covers fixed numeric parameters.

## Preserve the input type

Put this complete example in `main.mcfpp` of an ordinary project:

```mcfpp
func identity<T>(value: T): T {
    return value
}

func main() {
    var score = identity<int>(42)
    var message = identity<string>("Ready")
    print(score)
    print(message)
}
```

Running `main` displays `42` and `Ready`. `score` has type `int`. `message` has type `string`.

## Read the declaration and call

`T` is a name that we choose for a type parameter. You can use another name, such as `Item`. Every `T` in this declaration refers to that same parameter.

| Declaration part | Meaning |
| --- | --- |
| `identity<T>` | The caller selects a type for `T` |
| `value: T` | The parameter uses the selected type |
| `: T` | The result uses that type too |

For `identity<int>(42)`:

1. `<int>` makes `T` mean `int` for this call.
2. `(42)` supplies `42` as `value`.
3. The function returns an `int`, so `score` also has type `int`.

You can read this call as using the signature `identity(value: int): int`. The string call uses `identity(value: string): string`.

`<T>` is short for `<T: type>`. `type` means that this parameter accepts a type. Type parameters use angle brackets. Ordinary data parameters use parentheses.

## Use one type for several parameters

```mcfpp
func choose<T>(first: T, second: T, useFirst: bool): T {
    if (useFirst) {
        return first
    }
    return second
}

func main() {
    external useFirst: bool = true
    print(choose<int>(10, 20, useFirst))
    print(choose<string>("Start", "Stop", false))
}
```

`first`, `second`, and the result all use `T`. The integer call supplies two integers. The string call supplies two strings. `useFirst` always has type `bool`.

During compilation, `<int>` and `<string>` select the function types. In the game, generated functions receive ordinary arguments and execute their branches. `external useFirst` makes the first call use a runtime condition.

## Use the selected type

A function body can use its parameters, return them, or call interfaces available on their types. The compiler checks each operation against the selected type. Use `int` parameters for a function that specifically needs integer arithmetic.

Function types can also contain generics, such as `callback: (T) -> T`. First learn the type relationships above. Then read [Lambdas and function types](../04function/05lambda).

Continue with [Generic data templates](./03generic_class) to use type parameters in fields and constructors.
