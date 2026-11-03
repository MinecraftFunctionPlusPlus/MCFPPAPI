---
lastUpdated: true
---

# 泛型的 in 与 out：哪些类型可以互换

本节接在[泛型数据模板](../07generic/03generic_class)之后，讨论一种进阶需求：函数需要 `Source<Reward>` 时，能否传入 `Source<CoinReward>`？

先约定 `CoinReward` 继承 `Reward`。每个金币奖励也是奖励。

## out：通过接口取出数据

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

示例通过具体实现 `CoinSource` 读取金币奖励，显示 `10`。从类型关系看，`Source<CoinReward>` 提供的每个值也都是 `Reward`，所以它满足 `Source<Reward>` 的输出要求。

`out T` 表示接口向外提供 `T`。它适合用于返回值，以及同样向外提供数据的嵌套类型。

## in：通过接口交入数据

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

示例把金币奖励交给具体实现 `RewardLog`，显示 `Reward accepted`。从类型关系看，需要 `Sink<CoinReward>` 的代码只会交入金币奖励。能够处理所有 `Reward` 的 `Sink<Reward>` 也满足这个输入要求。

`in T` 表示接口接收 `T`。它适合用于方法的输入参数。

## 同时读写时保持类型一致

假设 `Box<T>` 同时提供 `read(): T` 和 `write(value: T)`。一个 `Box<CoinReward>` 要持续保存金币奖励。若把它当作可写的 `Box<Reward>`，调用者就可能写入另一种奖励。

因此，这种读写容器使用普通 `<T>`，保留具体类型的一致性。选择规则如下：

| 接口用途 | 参数写法 | 示例 |
| --- | --- | --- |
| 主要提供数据 | `<out T>` | `Source<T>.read(): T` |
| 主要接收数据 | `<in T>` | `Sink<T>.accept(value: T)` |
| 同时读取和写入数据 | `<T>` | `Box<T>` |

编译器会检查 `in`、`out` 在字段和方法中的使用方向。给可写字段保留普通类型参数，通常更容易表达它的读写约定。

本页示例通过具体实现类型调用方法。当前编译器对普通参数中的抽象模板方法调用仍有运行时生成限制，泛型替换关系首先用于检查类型是否匹配。
