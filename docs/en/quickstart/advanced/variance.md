---
lastUpdated: true
---

# Generic in and out: when types can substitute

Use `out T` when an interface produces values of type `T` and `in T` when it consumes them. These declarations show the two directions alongside a writable field.

```mcfpp
abstract data Source<out T> {
    abstract func read(): T
}

abstract data Sink<in T> {
    abstract func accept(value: T)
}

data Box<T> { var value: T }
```

Suppose `CoinReward` satisfies the fields of `Reward`. A `Source<CoinReward>` can supply a `Source<Reward>` consumer because every value read from it satisfies the requested type. A `Sink<Reward>` can serve code that needs a `Sink<CoinReward>` because it accepts every coin reward that caller might send.

The same `Box<T>` field can be read and written, so its type parameter stays invariant. Writing a different reward through a `Box<Reward>` view would break the original `Box<CoinReward>` contract. See [generic data templates](../07generic/03generic_class) for a complete example of creating and reading a `Box`.
