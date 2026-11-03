---
lastUpdated: true
---

# Update data through a function

Ordinary parameters receive copies of values. A result returns a new value to the caller:

```mcfpp
func increase(value: int): int {
    return value + 1
}

func main() {
    var count = 2
    count = increase(count)
    print(count)
}
```

This prints `3`. The explicit `count = ...` shows where the caller's value changes.

Use [`ScoreRef` and `NBTRef<T>`](../02base/06references) for game scores and NBT.
