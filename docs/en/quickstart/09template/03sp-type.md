---
lastUpdated: true
---

# Optional fields and union types


## Safe access and fallback values

`var amount: int?` allows the object to omit that field. This function uses `?.` to access an optional reward, then `?:` to return 7 when there is no amount.

```mcfpp
data Reward { var amount: int? }
data Player { var reward: Reward? }

func points(player: Player): int {
    return player.reward?.amount ?: 7
}

func main() {
    var missing: Player = {}
    var zero: Player = { reward: { amount: 0 } }
    print(points(missing))
    print(points(zero))
}
```

The calls print `7` and `0`. `?:` evaluates its right operand only when the left side is absent. Zero, false and the empty string are present values. A missing receiver also skips argument evaluation in a `?.` method call. Use `value ?: return` to exit early. Postfix `!!` reads directly and requires the caller to guarantee presence.

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
}
```

Both assignments satisfy the union. When reading through a union type, only members common to every branch are directly available. An `as` view reinterprets the stored data. The compiler warns when it cannot prove the representations are compatible.

Use `typealias int as Score` for another name for an existing type. Type aliases name types. Unions accept several value types.
