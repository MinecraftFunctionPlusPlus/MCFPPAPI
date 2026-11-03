---
lastUpdated: true
---

# Variables

Variables store program data. `var` declares a variable that you can assign again. Write its type after its name.

```mcfpp
func main() {
    var lives: int = 3
    var bonus = 2
    const maxLives = 10
    external score: int = 0

    lives += bonus
    score += lives
    print(score)
}
```

`lives: int` declares an integer. `bonus = 2` infers `int` from the initial value. For a later assignment, declare the type and initialize the variable before reading it.

## Common types

| Type | Purpose | Example |
| --- | --- | --- |
| `int` | Integers and scoreboard arithmetic | `42` |
| `float` | Floating-point arithmetic | `1.5` |
| `bool` | Conditions | `true` |
| `string` | Strings | `"hello"` |
| `text` | Minecraft chat text | `"hello"` |
| `nbt` | General NBT data | `{count: 2}` |
| `list<T>` | Ordered elements | `[1, 2, 3]` |
| `dict<T>` | String keys and values | `{red: 1, blue: 2}` |
| `map<T>` | A mapping with accessible keys | See [Map](../08nbt/04map) |
| `entity` | A game entity | Obtained through entity APIs |
| `selector` | A Minecraft selector | `@a` |

Use [`data`](../09template/01define-and-instantiate) for named fields. Use [`ScoreRef` and `NBTRef<T>`](./06references) for game data addresses.

## const and external

`const` permits one assignment. Use it for fixed settings and address references. A fixed reference can still update its target through `set`.

`external` requires runtime storage. The example's `score` uses runtime operations even with an initial value of `0`.

The compiler can calculate known ordinary values:

```mcfpp
func main() {
    var total = 5
    total += 7
    print(total)
}
```

The compiler can calculate `12` here. Runtime input causes it to generate commands for the calculation. `const` describes assignment count. A known value describes what the compiler knows.
