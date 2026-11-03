---
lastUpdated: true
---

# Inheritance and abstract templates

List parent templates after `:`. A child inherits fields and methods. Use `override` to replace an inherited implementation.

```mcfpp
abstract data Readable {
    abstract func read(): int
}

data Counter: Readable {
    var value: int = 5

    override func read(): int {
        return this.value
    }
}

func main() {
    var counter = Counter()
    print(counter.read())
}
```

`abstract data` defines a shared interface for children. `abstract func` declares a method signature. A concrete child supplies all inherited abstract methods before you create its instances.

Separate multiple parents with commas, such as `data Combined: First, Second`. Resolve shared member names through explicit implementations and compatible field types.
