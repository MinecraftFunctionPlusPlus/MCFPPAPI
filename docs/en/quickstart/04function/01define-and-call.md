---
lastUpdated: true
---

# Define and call functions

`func` declares a function. Each ordinary parameter has a name and type. Write the return type after `:` following the parameter list.

```mcfpp
func add(left: int, right: int): int {
    return left + right
}

func main() {
    var result = add(2, 3)
    print(result)
}
```

`add` receives two integers and returns their sum. `main` calls `add(2, 3)` and prints `5`.

## Return a result

`return expression` ends the function and returns a value. Each reachable path in a result-producing function must provide a matching result.

```mcfpp
func clamp(value: int): int {
    if value > 10 {
        return 10
    }
    return value
}

func main() {
    print(clamp(15))
}
```

An omitted return type means `void`. Use `return` alone to end a `void` function early.

## Ordinary parameters copy values

```mcfpp
func increase(value: int): int {
    value += 1
    return value
}

func main() {
    var count = 2
    var next = increase(count)
    print(count)
    print(next)
}
```

The output is `2` followed by `3`. Pass an [address reference](../02base/06references) to update game data. Use [function values and lambdas](./05lambda) to pass behavior.

Read-only parameters appear in `<...>`. Use them for [type parameters and compilation settings](../07generic/02generic_function).
