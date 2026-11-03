---
lastUpdated: true
---

# Process collections with callbacks

Lists provide `map`, `filter`, `fold`, and `foreach`. These methods accept functions or lambdas. Use them for reward tables, prices, and scores.

| Method | Callback parameters | Result |
| --- | --- | --- |
| `map` | Current element | A new list of callback results |
| `filter` | Current element | Elements for which the callback returns `true` |
| `fold(initial)` | Accumulator, current element | The final accumulator |
| `foreach` | Current element | Executes the callback for each element |

## Calculate rewards

```mcfpp
func main() {
    var scores = [1, 2, 3, 4]
    var bonus = 10
    var rewards = scores.map { it + bonus }
    var eligible = scores.filter { it >= 3 }
    var total = scores.fold(0) { sum, score -> sum + score }
    print(rewards)
    print(eligible)
    print(total)
}
```

`rewards` is `[11, 12, 13, 14]`. `eligible` is `[3, 4]`. `total` is `10`. Use `it` for a callback with one parameter, or specify a parameter name.

## Reuse a function

```mcfpp
func doubled(value: int): int {
    return value * 2
}

func main() {
    var prices = [5, 10, 15]
    var saleValues = prices.map(doubled)
    print(saleValues)
}
```

The callback determines the result type of `map`. For example, `scores.map { it > 2 }` produces `list<bool>`.

## Skip one callback invocation

```mcfpp
func main() {
    var values = [1, 2, 3]
    values.foreach {
        if (it == 2) {
            return
        }
        print(it)
    }
    print("Finished")
}
```

This example prints `1`, `3`, and `Finished`. A `return` inside the callback ends that invocation. Processing then continues with the remaining elements.

`fold` processes elements in list order. For an empty list, it returns the initial value. A callback can read outer variables. It captures their values when the callback is created. Read [Lambdas](../04function/05lambda) for function types and trailing lambda syntax.
