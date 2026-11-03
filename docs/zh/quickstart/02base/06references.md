---
lastUpdated: true
---

# Minecraft 地址引用

`ScoreRef` 保存一个计分项的地址。`NBTRef<T>` 保存一个 NBT 地址，`T` 表示读写的数据类型。将引用传给函数后，函数可以更新对应的游戏数据。

## 更新一个计分项

```mcfpp
func increase(counter: ScoreRef) {
    counter.tryRead { previous ->
        counter.set(previous + 1)
    }
}

func main() {
    /scoreboard objectives add points dummy
    /scoreboard players set counter points 0

    const counter = scoreRef("counter", "points")
    increase(counter)
    /scoreboard players get counter points
}
```

`scoreRef("counter", "points")` 指向名为 `counter` 的计分持有者和 `points` 计分项。`increase` 读取分数，再写入增加后的值。

## 读取和更新 NBT

```mcfpp
func main() {
    /data modify storage demo:state counter set value 5

    const counter = nbtStorageRef<int>("demo:state", "counter")
    var found = counter.tryRead { previous ->
        counter.set(previous + 1)
    }
    print(found)
}
```

`tryRead` 读取一次数据，返回是否读取成功。成功时，它立即调用回调，并将读到的值作为参数。零值也是成功的读取。数据缺失时，返回 `false`。

回调参数是读到的值。通过 `counter.set(...)` 将修改写回目标。`set` 返回 `void`。外部 NBT 的实际内容应符合声明的 `T`。

## 地址的创建方式

| 表达式 | 目标 |
| --- | --- |
| `scoreRef(holder, objective)` | 计分持有者与计分项 |
| `nbtStorageRef<T>(id, path)` | 命名 storage 中的路径 |
| `nbtEntityRef<T>(target, path)` | 实体 NBT 路径 |
| `nbtBlockRef<T>(dimension, x, y, z, path)` | 指定维度和绝对坐标的方块 NBT |
| `target.score[objective]` | 实体分数 |
| `target.dat.field` | 实体结构中的字段 |

## 复制与改指向

```mcfpp
func main() {
    /scoreboard objectives add points dummy

    var current = scoreRef("first", "points")
    var saved = current
    current = scoreRef("second", "points")

    saved.set(5)
    current.set(9)
}
```

两次写入分别更新 `first` 和 `second`。赋值复制地址，`set` 写入目标内容。

引用可作为普通参数、返回值、模板字段和列表元素。`const` 固定引用的指向，仍允许通过 `set` 更新目标。`NBTRef<T>` 的读写使用同一个 `T`，普通整数通过 `tryRead` 与 `set` 传入传出。

创建引用时，地址参数和索引求值一次。选择器在访问时选择实体。从 `ctx.executor` 派生的引用在活跃的同步执行作用域中使用。需要保存可独立传递的引用时，使用明确的持有者、storage、实体或方块地址。


旧发行包的反射依赖错误和源码查看方法见[构建问题处理](../01project/05troubleshooting)。
