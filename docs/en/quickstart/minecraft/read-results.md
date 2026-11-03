---
lastUpdated: true
---

# Read scores, NBT, and command results

A game score or NBT path can be absent. `tryRead` reports whether a value exists and supplies the value to a callback.

## Read an entity score

Create test data in the game:

```mcfunction
scoreboard objectives add points dummy
scoreboard players set @s points 10
```

```mcfpp
func main() {
    @s.withEntityCtx { ctx ->
        var found = ctx.executor.score["points"].tryRead { points ->
            print(points)
        }
        print(found)
    }
}
```

When the score exists, `tryRead` invokes the callback once and returns `true`. A zero score also counts as a successful read. An absent score produces `false`.

The callback receives a snapshot. Use the address value's `set` method to write a value. Read [ScoreRef and NBTRef](../02base/06references) for complete examples.

## Read NBT

```mcfpp
func main() {
    @s.withEntityCtx { ctx ->
        var found = ctx.executor.dat.air.tryRead { air ->
            print(toInt(air))
        }
        print(found)
    }
}
```

This example reads the entity's `Air` field. `toInt` converts the NBT number to an integer for calculations.

## Check a command result

Standard library commands with result support return `CommandResult`. It contains `success: bool` and `result: int`.

```mcfpp
func main() {
    var moved = tp(@a, 0 80 0)
    if (moved.success) {
        print(moved.result)
    } else {
        print("No player moved")
    }
}
```

`success` reports whether the command succeeded. The Minecraft command determines the meaning of `result`. For teleportation, it reports the number of affected targets.
