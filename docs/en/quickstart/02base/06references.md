---
lastUpdated: true
---

# Minecraft address references

`ScoreRef` stores a scoreboard address. `NBTRef<T>` stores an NBT address with data type `T`. A function can receive a reference and update the game data it identifies.

## Update a score

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

`scoreRef("counter", "points")` identifies score holder `counter` and objective `points`. `increase` reads the score and writes its increased value.

## Read and update NBT

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

`tryRead` reads once and returns whether the read succeeded. On success, it immediately calls the callback with the value. Zero is a successful result. Missing data produces `false`.

The callback receives the value that was read. Write changes to the target with `counter.set(...)`. `set` returns `void`. External NBT content must match the declared `T`.

## Create an address

| Expression | Target |
| --- | --- |
| `scoreRef(holder, objective)` | Score holder and objective |
| `nbtStorageRef<T>(id, path)` | Path in named storage |
| `nbtEntityRef<T>(target, path)` | Entity NBT path |
| `nbtBlockRef<T>(dimension, x, y, z, path)` | Block NBT at an explicit dimension and absolute coordinates |
| `target.score[objective]` | Entity score |
| `target.dat.field` | Field in an entity structure |

## Copy and reassign references

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

The writes update `first` and `second` respectively. Assignment copies the address. `set` writes the target content.

References can appear in ordinary parameters, results, template fields, and lists. `const` fixes the address while `set` can still update its target. `NBTRef<T>` uses the same `T` for reads and writes. Read and write integer values through `tryRead` and `set`.

Address arguments and indices evaluate once during reference creation. A selector selects entities at access time. References from `ctx.executor` stay within active synchronous execution scopes. Use explicit score, storage, entity, or block addresses for references that must remain independently usable.


For Kotlin reflection dependencies in a single JAR, see [Resolve build problems](../01project/05troubleshooting).
