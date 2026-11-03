---
lastUpdated: true
---

# Data templates

`data` defines named fields, constructors, and methods. It tells the compiler which members an NBT value contains.

```mcfpp
data Reward {
    var amount: int
    var label: string

    constructor(amount: int, label: string) {
        this.amount = amount
        this.label = label
    }

    func show() {
        print(this.label)
        print(this.amount)
    }
}

func main() {
    var reward = Reward(10, "Daily reward")
    reward.amount += 5
    reward.show()
}
```

`constructor` initializes a new object. `this` means the current object. Use `this.amount` inside a method and `reward.amount` outside it.

## Copy an object value

Data templates use value semantics. This changes the copy:

```mcfpp
data Reward {
    var amount: int = 10
}

func main() {
    var original = Reward()
    var copy = original
    copy.amount = 20
    print(original.amount)
    print(copy.amount)
}
```

This prints `10` followed by `20`. Constructors initialize fields through explicit, typed parameters.

Continue with [nested templates](./02template-nest), [singleton objects](./05object), and [inheritance](./06inheritance). Use [generic templates](../07generic/03generic_class) for configurable field types.
