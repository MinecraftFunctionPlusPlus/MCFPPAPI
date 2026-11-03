---
lastUpdated: true
---

# Entities and execution contexts

An entity value records how to find a target. Use a selector, a player name, or a UUID.

```mcfpp
func main() {
    var players = @a
    var alex = entityByName("Alex")
    var known = entityByUUID("0-0-0-0-1")
    tp(players, 0 80 0)
}
```

`entityByName` accepts a player name. `entityByUUID` accepts a UUID with five hexadecimal groups. The target resolves when used. Thus, `@s` means the executor at that point.

## Execute at each target

`withPosCtx` invokes its callback once per target. It sets position, rotation, and dimension. Inside the callback, `ctx.executor` identifies the executor bound at callback entry.

```mcfpp
func main() {
    @a.withPosCtx { ctx ->
        /particle minecraft:flame ~ ~1 ~ 0 0 0 0 1
    }
}
```

This function creates a particle at each player. `withPosCtx` preserves the caller's execution identity.

## Execute as each target

`withEntityCtx` changes the executor. It preserves the position at the call site.

```mcfpp
func main() {
    @a.withEntityCtx { ctx ->
        /say Hello
    }
}
```

To use both the target's identity and position, first enter its entity context. Then enter a position context through `ctx.executor`.

## Follow entity relations

`onPassengers` selects direct passengers. Other relations include `onVehicle`, `onOrigin`, `onOwner`, `onController`, `onLeasher`, `onTarget`, and `onAttacker`. These relations require Minecraft 1.19.4 or later.

```mcfpp
func main() {
    @s.withPosCtx { origin ->
        origin.onPassengers { passenger ->
            tp(passenger.executor, origin.pos)
        }
    }
}
```

Run this function as an entity with passengers. It teleports direct passengers to `origin.pos`. The position includes its dimension, which `tp` also uses.

`ctx.executor` binds an entity identity for that callback. `ctx.pos` records its position and dimension. Use these values within the synchronous callback and synchronous functions that it calls. This keeps targets explicit during nested operations.

## Run a function that needs an executor

For a project with namespace `demo`, use:

```mcfunction
execute as @a at @s run function demo:main
```

This command calls `main` as each player at that player's position. Read [Native commands](../02base/05original-command) for more execution syntax.
