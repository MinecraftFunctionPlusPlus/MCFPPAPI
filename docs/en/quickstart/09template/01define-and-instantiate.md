---
lastUpdated: true
---

# Data templates

`data` defines named fields, factories, and instance methods. It tells the compiler which members an NBT value contains.

```mcfpp
data Reward {
    var amount: int
    var label: string

    new(amount: int, label: string) {
        return { amount, label }
    }

    func show() {
        print(this.label)
        print(this.amount)
    }
}

func main() {
    var reward = Reward.new(10, "Daily reward")
    reward.amount += 5
    reward.show()
}
```

`Reward.new(10, "Daily reward")` and `Reward(10, "Daily reward")` call the same factory. Every successful path through `new` explicitly returns a value with all required fields. `{ amount, label }` reads the two parameters of the same names. To migrate an ordinary data constructor that assigned to `this`, return those fields from `new`. An instance method such as `show` still reads its receiver through `this`.

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

The field defaults form a complete `Reward`, so the compiler supplies a zero-argument factory, `Reward()`. This example prints `10` and `20`.

Continue with [nested templates](./02template-nest), [singleton objects](./05object), and [inheritance](./06inheritance). Use [generic templates](../07generic/03generic_class) for configurable field types.
