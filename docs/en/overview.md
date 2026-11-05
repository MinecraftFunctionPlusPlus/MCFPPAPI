---
lastUpdated: true
---

# MCFPP syntax overview

Start with [Create a project](/en/quickstart/01project/01create-project) to build a datapack in IDEA or a terminal.

```mcfpp
data Reward {
    var amount: int = 10
}

func doubled(value: int): int {
    return value * 2
}

func main() {
    var reward = Reward()
    var transform: (int) -> int = { it + 5 }
    print(doubled(transform(reward.amount)))
}
```

This example combines a data template, functions, variables, a function type, and a lambda. It prints `30`.

## Common syntax

| Purpose | Form |
| --- | --- |
| Mutable value | `var score: int = 0` |
| One assignment | `const limit = 10` |
| Runtime storage | `external score: int = 0` |
| Function result | `func add(a: int, b: int): int` |
| Type parameter | `func identity<T>(value: T): T` |
| Type alias | `typealias int as Score` |
| Function type | `(int) -> int` |
| Lambda | `{ value -> value + 1 }` |
| Data template | `data Reward { var amount: int }` |
| Shared object | `object data Settings { var limit: int = 10 }` |
| Abstract template | `abstract data Readable { abstract func read(): int }` |
| Ordinary comment | `// explanation` |
| Documentation comment | `/// Markdown documentation` |

Newlines separate ordinary statements. Semicolons separate statements on one line. Update integers with `+=` and `-=`.

## Development topics

- [Develop in IDEA](/en/quickstart/01project/03idea): save formatting, diagnostics, and tasks.
- [Project configuration](/en/quickstart/01project/02config-file): TOML, directories, and target versions.
- [MNI introduction](/en/quickstart/11mni/01mni-framework): Kotlin macros and tests.
- [Address references](/en/quickstart/02base/06references): score and NBT access.
- [Build output and IR](/en/quickstart/01project/04build-and-ir): datapacks and compiler records.
