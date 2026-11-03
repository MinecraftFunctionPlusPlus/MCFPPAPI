---
lastUpdated: true
---

# Abstract data

Use `abstract data` to define a shared interface. A concrete child supplies implementations for its abstract methods.

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

The example prints `5`. `Counter` inherits the method contract and supplies `read` with `override`.

Continue with [Inheritance and abstract templates](../09template/06inheritance) for multiple parents.
