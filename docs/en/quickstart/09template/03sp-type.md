---
lastUpdated: true
---

# Optional fields and union types

## Optional fields

`?` after a template field type permits its omission from initialization data.

```mcfpp
data Reward {
    var amount: int = 10
    var note: string?
}

func main() {
    var reward = Reward()
    print(reward.amount)
}
```

The example supplies `amount` and omits `note`. Establish that a field is initialized before reading it. For external NBT paths, use [`NBTRef<T>.tryRead`](../02base/06references) to handle presence.

## Union types

`(int | string)` permits either listed type:

```mcfpp
data DisplayValue {
    var value: (int | string) = 0
}

func main() {
    var numeric = DisplayValue()
    numeric.value = 10
    var named = DisplayValue()
    named.value = "Ready"
    print(numeric.value as int)
    print(named.value as string)
}
```

The compiler tracks the actual type of known fields. `as` selects the type view used at that point. The value must match that type. Check the layout when data comes from external sources.

Use `typealias int as Score` for another name for an existing type. Type aliases name types. Unions accept several value types.
