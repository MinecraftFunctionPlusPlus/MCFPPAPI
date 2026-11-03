---
lastUpdated: true
---

# Read-only lists, NBT arrays, and ranges

## Read a list through a read-only view

`ImmutableList<T>` provides reading, searching, and iteration. Use it for function parameters that only need to read a list.

```mcfpp
func first(values: ImmutableList<int>): int {
    return values[0]
}

func main() {
    var source = [2, 4, 6]
    var view = source as ImmutableList<int>
    print(first(view))
    print(view.contains(4))
}
```

`as` creates a read-only view of shared storage. `source` can still change the list. `view` sees those changes. The read-only rule applies to the list itself. Mutable elements retain their own modification rules.

## Use Minecraft NBT arrays

NBT arrays contain a specific integer kind. Use the `B`, `I`, or `L` marker.

```mcfpp
func main() {
    var bytes = [B; 1b, 2b, 3b]
    var numbers = [I; 10, 20, 30]
    var longs = [L; 1L, 2L, 3L]
    print(bytes)
    print(numbers)
    print(longs)
}
```

The corresponding types are `ByteArray`, `IntArray`, and `LongArray`. Use these literals when game data requires the corresponding NBT types. Use `list<T>` for a general mutable sequence.

## Iterate over an integer range

```mcfpp
func main() {
    for (index: 1..3) {
        print(index)
    }
}
```

The range includes both endpoints. This loop prints `1`, `2`, and `3`. Integer variables can also supply the bounds. The loop captures its bounds before iteration. `index` contains the current iteration value.
