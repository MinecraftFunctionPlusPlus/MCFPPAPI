---
lastUpdated: true
---

# Namespaces and imports

Namespaces group functions and data types. Minecraft locates generated resources with `namespace:path`.

## Derive a namespace from directories

With `namespace = "hello"` in `mcfpp.toml`:

| Source location | Default namespace |
| --- | --- |
| `src/main/mcfpp/main.mcfpp` | `hello` |
| `src/main/mcfpp/game/rewards.mcfpp` | `hello.game` |
| `src/main/mcfpp/game/rounds/start.mcfpp` | `hello.game.rounds` |

Directories form the namespace. Filenames organize source code. Files in one directory can declare functions in the same namespace.

## Declare a namespace

Place `namespace` at the start of the file:

```mcfpp
namespace demo.rewards

func grant() {
    /give @s minecraft:stone 1
}
```

The game function is `demo.rewards:grant`.

## Import another file

`src/main/mcfpp/rewards.mcfpp`:

```mcfpp
namespace demo.rewards

func amount(): int {
    return 10
}
```

`src/main/mcfpp/main.mcfpp`:

```mcfpp
import demo.rewards:*

func main() {
    print(amount())
}
```

Use a qualified call such as `demo.rewards:amount()` to distinguish functions with the same name. Java packages are separate names. They appear after `=` in [native declarations](../11mni/02mni-framework-implementation).
