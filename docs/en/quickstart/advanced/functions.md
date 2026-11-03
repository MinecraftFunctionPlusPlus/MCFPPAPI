---
lastUpdated: true
---

# Extension functions and default arguments

## Add a function to an existing type

Extension syntax places the receiver type before the function name:

The following example shows extension syntax. Integer extension functions still need CLI support for binding `this`.

```text
func int.withBonus(bonus: int): int {
    return this + bonus
}

func main() {
    var score = 20
    print(score.withBonus(5))
    print(score)
}
```

Use this ordinary function for the same calculation:

```mcfpp
func withBonus(score: int, bonus: int): int {
    return score + bonus
}

func main() {
    var score = 20
    print(withBonus(score, 5))
    print(score)
}
```

This returns the calculated value. The original variable remains `20`. Import the function's namespace to reuse it across files.

## Set a default argument

```mcfpp
func reward(base: int, bonus: int = 5): int {
    return base + bonus
}

func main() {
    print(reward(10))
    print(reward(10, 20))
}
```

The first call uses the default and prints `15`. The second call supplies `bonus` and prints `30`. Place parameters with defaults at the end of the parameter list. Supply arguments by position.

Read [Lambdas and function types](../04function/05lambda) to pass behavior to another function.
