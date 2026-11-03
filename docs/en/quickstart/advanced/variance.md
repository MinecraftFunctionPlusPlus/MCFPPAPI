---
lastUpdated: true
---

# Generic in and out: when types can substitute

This page follows [Generic data templates](../07generic/03generic_class). It addresses an advanced question: can `Source<CoinReward>` serve where `Source<Reward>` is required?

Assume that `CoinReward` inherits `Reward`. Every coin reward is also a reward.

## out: obtain data through an interface

```mcfpp
data Reward {
    var points: int = 10
}

data CoinReward: Reward {}

abstract data Source<out T> {
    abstract func read(): T
}

data CoinSource: Source<CoinReward> {
    override func read(): CoinReward {
        return CoinReward()
    }
}

func main() {
    var coins = CoinSource()
    print(coins.read().points)
}
```

The example reads from the concrete `CoinSource` and displays `10`. Every value from `Source<CoinReward>` is also a `Reward`. It therefore satisfies the output requirement of `Source<Reward>`.

`out T` means that the interface provides `T`. Use it in results or in nested types that also provide data.

## in: supply data through an interface

```mcfpp
data Reward {}
data CoinReward: Reward {}

abstract data Sink<in T> {
    abstract func accept(value: T)
}

data RewardLog: Sink<Reward> {
    override func accept(value: Reward) {
        print("Reward accepted")
    }
}

func main() {
    var log = RewardLog()
    log.accept(CoinReward())
}
```

The example passes a coin reward to the concrete `RewardLog` and displays `Reward accepted`. Code requiring `Sink<CoinReward>` supplies coin rewards. A `Sink<Reward>` accepts every reward, so it also meets that input requirement.

`in T` means that the interface receives `T`. Use it for method input parameters.

## Keep matching types for reading and writing

Suppose `Box<T>` provides both `read(): T` and `write(value: T)`. A `Box<CoinReward>` must keep storing coin rewards. Treating it as a writable `Box<Reward>` could let callers store another reward kind.

Use an ordinary `<T>` for this container. That keeps its specific type consistent.

| Interface purpose | Parameter form | Example |
| --- | --- | --- |
| Provide data | `<out T>` | `Source<T>.read(): T` |
| Receive data | `<in T>` | `Sink<T>.accept(value: T)` |
| Read and write data | `<T>` | `Box<T>` |

The compiler checks parameter direction in fields and methods. Ordinary type parameters usually express writable fields more directly.

These examples invoke methods through concrete implementation types. Runtime generation for abstract template method calls through ordinary parameters still has limitations. Generic substitution rules first establish type compatibility.
