---
lastUpdated: true
---

# Properties and operators

Properties run specified code when you read or assign a value. Operators let data templates participate in expressions such as `+`.

## Control a property with get and set

`field` is the stored value of the property. `value` is the new value supplied to the setter.

```mcfpp
data Counter {
    var value: int = 0 {
        get { return field }
        set {
            if (value < 0) {
                field = 0
            } else {
                field = value
            }
        }
    }
}

func main() {
    var counter = Counter()
    counter.value = -5
    print(counter.value)
    counter.value = 8
    print(counter.value)
}
```

This example prints `0` and `8`. Callers use ordinary property access. The setter keeps validation in one place.

## Define addition

This example shows operator declaration syntax. Data template operator calls still need CLI support. A working method-based implementation follows.

```text
data Points {
    var value: int = 0

    constructor(value: int) {
        this.value = value
    }

    operator +(other: int): int {
        return this.value + other
    }
}

func main() {
    var points = Points(10)
    print(points + 5)
    print(points.value)
}
```

This shows the operator declaration syntax. The current CLI reports an unsupported operation for `points + 5`. Use an ordinary instance method for this calculation:

```mcfpp
data Points {
    var value: int = 10
    func plus(other: int): int {
        return this.value + other
    }
}

func main() {
    var points = Points()
    print(points.plus(5))
}
```

This implementation prints `15`. Runtime generation for operator calls still needs compiler work.
