---
lastUpdated: true
---

# 泛型的 in 与 out：哪些类型可以互换

函数只读出 `T` 时，用 `out T` 声明输出方向；只接收 `T` 时，用 `in T` 声明输入方向。下面三个声明分别展示输出、输入和可读写字段。

```mcfpp
abstract data Source<out T> {
    abstract func read(): T
}

abstract data Sink<in T> {
    abstract func accept(value: T)
}

data Box<T> { var value: T }
```

假设 `CoinReward` 满足 `Reward` 的字段要求。需要 `Source<Reward>` 的地方可以接受 `Source<CoinReward>`，因为读出的每个值都满足所需类型。需要 `Sink<CoinReward>` 的地方可以接受 `Sink<Reward>`，因为后者能够接收调用者提供的任何金币奖励。

`Box<T>` 的同一字段既能读也能写，因此保留不变类型参数 `T`。把 `Box<CoinReward>` 当作 `Box<Reward>` 写入其他奖励，会破坏原字段的类型约束。[泛型数据模板](../07generic/03generic_class)展示了读取和创建 `Box` 的完整例子。
