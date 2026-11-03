---
lastUpdated: true
---

# Compilation parameters and known values

The first two pages use `<T>` to select a type. Angle brackets can also accept values known during compilation. For example, a function can receive a fixed reward and a player's runtime score.

MCFPP calls parameters in angle brackets **readonly parameters**. `<T>` and `<T: type>` declare readonly type parameters. `<bonus: int>` declares a readonly integer parameter.

## Combine a fixed reward with a runtime score

```mcfpp
func addBonus<bonus: int>(score: int): int {
    return score + bonus
}

func main() {
    external score: int = 10
    print(addBonus<5>(score))
    print(addBonus<20>(score))
}
```

Running `main` displays `15` and `30`.

| Input | Call position | When supplied |
| --- | --- | --- |
| Fixed reward `bonus` | `<5>`, `<20>` | During datapack compilation |
| Current score `score` | `(score)` | When the function executes in the game |

The compiler prepares implementations for rewards `5` and `20`. Generated functions can then repeatedly receive runtime scores.

If the reward must also change during play, make `bonus: int` an ordinary parameter. Place it in parentheses with `score`.

## Supply a known value

Use a literal or an expression whose result the compiler can determine:

```mcfpp
const BASE_BONUS: int = 5

func addBonus<bonus: int>(score: int): int {
    return score + bonus
}

func main() {
    var extra = 2
    print(addBonus<BASE_BONUS + extra>(10))
}
```

At this call, `BASE_BONUS + extra` is known to be `7`. The result is `17`. `extra` uses `var`, but the compiler still knows its value at this point.

Use ordinary parameters for game reads, runtime function inputs, and `external` variables. Readonly arguments must be known during compilation. They determine the prepared implementation.

## Distinguish var, const, and readonly parameters

| Form | Purpose |
| --- | --- |
| `var value = 5` | Declare a variable that permits reassignment |
| `const value = 5` | Declare a variable assigned once |
| `func f<value: int>()` | Receive an integer configuration during compilation |
| `func f(value: int)` | Receive an ordinary integer argument in generated code |
| `external value: int = 5` | Explicitly use game runtime storage for a variable |

Whether the compiler knows a value depends on its source at that point. Assignment permissions are a separate question.

## Give a data template a numeric parameter

```mcfpp
data Reward<bonus: int> {
    func apply(score: int): int {
        return score + bonus
    }
}

func main() {
    var small = Reward<5>()
    var large = Reward<20>()
    print(small.apply(10))
    print(large.apply(10))
}
```

The objects use different fixed rewards and produce `15` and `30`. A template can declare both type and numeric parameters, such as `data Box<T, limit: int>`.

Use [build IR](../01project/04build-and-ir) to inspect generated functions. Continue with [in and out](../advanced/variance) to learn when one generic type can replace another.
