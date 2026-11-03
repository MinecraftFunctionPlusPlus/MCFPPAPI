---
lastUpdated: true
---

# Function values and lambdas

A function value stores behavior that you can call. Write a function type as `(parameter types) -> result type`.

```mcfpp
func apply(value: int, transform: (int) -> int): int {
    return transform(value)
}

func main() {
    var add: (int, int) -> int = { left, right -> left + right }
    print(add(2, 3))

    print(apply(5, { value -> value * 2 }))
    print(apply(5) { it + 1 })
}
```

`(int, int) -> int` receives two integers and returns an integer. `{ left, right -> left + right }` is a lambda: an unnamed function written at its use site.

A final callback argument can appear after the call parentheses. A single parameter can use the implicit name `it`. The example prints `5`, `10`, and `6`.

## Results and captured values

The lambda's final expression supplies its result. Use `return` for an early result. Keep a result expression without a trailing semicolon.

A lambda copies local values when you create it:

```mcfpp
func main() {
    var bonus = 3
    var addBonus: (int) -> int = { value -> value + bonus }
    bonus = 9
    print(addBonus(2))
}
```

This prints `5` because `addBonus` captured `bonus = 3`. Top-level variables use their shared storage. An ordinary lambda uses the game's execution context at its call site.

## Use a named function

```mcfpp
func doubleScore(value: int): int {
    return value * 2
}

func main() {
    var transform: (int) -> int = doubleScore
    print(transform(6))
}
```

Use function values for score transformations, collection processing, and reusable callbacks. Use [`tryRead`](../02base/06references) when reading external data.
