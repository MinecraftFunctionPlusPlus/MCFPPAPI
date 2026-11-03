---
lastUpdated: true
---

# Conditions and loops

## if and else

`if` selects a block with a `bool` condition. Parentheses around the condition are optional.

```mcfpp
func classify(score: int) {
    if score >= 10 {
        print("Gold")
    } else if score >= 5 {
        print("Silver")
    } else {
        print("Bronze")
    }
}

func main() {
    external score: int = 7
    classify(score)
}
```

Comparison operators include `==`, `!=`, `<`, `<=`, `>`, and `>=`. Combine conditions with `&&`, `||`, and `!`.

## while and do while

`while` checks the condition before each iteration. `do while` executes the body once before checking the condition.

```mcfpp
func main() {
    external count: int = 0
    while count < 3 {
        print(count)
        count += 1
    }

    do {
        count -= 1
    } while count > 0
}
```

Use `break` to end a loop. Use `continue` to start the next iteration. Update counters with `+=` or `-=`.

## Iterate over a list

```mcfpp
func main() {
    var rewards: list<int> = [10, 20, 30]
    for (reward: rewards) {
        print(reward)
    }
}
```

The loop variable receives each element. See [Lists](../08nbt/02list) for more operations.
