---
lastUpdated: true
---

# Enumerations

The current CLI analyzes enum declarations. Datapack generation for enum assignment still needs work. The examples below show syntax. A working constant-based version follows.

An enumeration names a fixed set of choices. Use it for room states, round stages, and reward kinds.

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

Use a member name when assigning a variable of type `RoundState`. An enumeration value keeps its member identity as your program passes and stores it.

## Specify member values

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

Use `=` to specify a member value. Choose member names that explain the purpose of each option.


## A working form for current projects

The current CLI analyzes the enum declarations above. Enum variable assignment still triggers `Unbound author-environment value` during datapack generation. Use named constants for these states:

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

This version works in current datapack projects. Runtime generation for complete enum values still needs compiler work.
