---
lastUpdated: true
---

# Type views

`data Name as Type` defines a view over an existing storage type:

```mcfpp
data Score as int

func main() {
    var score: Score = 10 as Score
    print((score as int) + 5)
}
```

`Score` uses integer storage. `score as int` reads through the original type. `as` changes the compiler's type view while preserving the data layout.

Use a type view to name an existing representation. Use `typealias int as Score` when you only need another name for an existing type.

The current development compiler reports a type conversion error when calling view instance methods. Use ordinary `data` for models with fields and methods. See [Data templates](./01define-and-instantiate).
