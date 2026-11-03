---
lastUpdated: true
---

# 枚举

当前 CLI 已支持枚举声明分析，枚举变量赋值的产物生成仍待完善。下面先说明声明语法，文末提供可运行的命名常量写法。

枚举为一组固定选项命名，适合表示房间状态、关卡阶段和奖励种类。

```text
enum RoundState {
    Waiting,
    Running,
    Finished
}

func main() {
    var state: RoundState = Waiting
    print(state.identifier)
    state = Running
    print(state.identifier)
}
```

变量的类型为 `RoundState` 时，使用成员名称赋值。枚举值保留成员身份，可在程序中传递和保存。

## 指定成员的值

```text
enum RewardKind {
    Small = 1,
    Large = 5,
    Special
}

func main() {
    var reward: RewardKind = Large
    print(reward.value)
}
```

`=` 可以为成员指定值。使用有意义的成员名，可以让调用代码直接表达选项的用途。


## 当前工程中的可运行写法

当前 CLI 能分析上面的枚举声明，但枚举变量赋值在数据包生成阶段仍会触发 `Unbound author-environment value`。下面使用命名常量表达同一组状态：

```mcfpp
const WAITING: int = 0
const RUNNING: int = 1
const FINISHED: int = 2

func main() {
    var state = WAITING
    state = RUNNING
    if (state == RUNNING) {
        print("Round started")
    }
}
```

这个版本可用于当前数据包工程。完整枚举值的运行时生成仍需编译器继续完善。
