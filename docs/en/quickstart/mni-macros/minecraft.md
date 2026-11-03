---
lastUpdated: true
---

# Minecraft operations in macros: entities, positions, and scores

The previous pages generated arithmetic and loops. This page generates a one-point award for each player. Continue with a [macro library entry](./overview) and combine targets and operations through `MinecraftBuilder`.

## Complete award entry

`example/macros/PlayerMacros.java`:

```java
package example.macros;

import top.mcfpp.annotations.MNIMacro;
import top.mcfpp.mni.api.*;

public final class PlayerMacros {
    @MNIMacro(returnType = "void")
    public static Block awardPlayers(MacroContext context) {
        return context.quote().block(code -> {
            MinecraftBuilder minecraft = code.minecraft();
            EntitySet players = minecraft.entities(EntityQuery.allPlayers());
            minecraft.executeAs(players, (each, player) -> {
                Ref<IntT> points = each.score(player, "points");
                each.assign(points, each.add(points.load(), each.intLiteral(1)));
            });
        });
    }
}
```

Prepare the objective and test scores in the game:

```mcfunction
scoreboard objectives add points dummy
scoreboard players set @a points 0
```

In a project that loads this macro, call `awardPlayers()` from an MCFPP function. Each execution adds `1` to `points` for all current players.

## From a target collection to one player

| Code | Meaning |
| --- | --- |
| `code.minecraft()` | Obtain the Minecraft operation builder |
| `EntityQuery.allPlayers()` | Describe the condition “all players” |
| `minecraft.entities(...)` | Obtain an `EntitySet` target collection |
| `executeAs(players, ...)` | Generate code that executes as each target |
| Callback parameter `player` | An `EntityHandle` for one current player |
| `each.score(player, "points")` | A writable score location for that player |

`EntityQuery` describes target selection. Java records this condition during code construction. The game finds actual targets when the generated code runs.

`points.load()` generates a read. `each.add` generates addition. `each.assign` generates the write. These operations form one score increment.

## Replace the selection condition

To select five nearby zombies tagged `arena`, replace the collection line in the complete example with:

```java
EntitySet players = minecraft.entities(
    EntityQuery.allEntities()
        .withType("minecraft:zombie")
        .withTag("arena")
        .withLimit(5)
        .sorted(EntitySort.NEAREST)
);
```

The variable still has the name `players`, but its selection determines the collection contents. In a project, rename it to `targets` to describe its purpose.

## Set identity and position separately

`executeAs` changes the executor. `at` changes the execution position. To test the block beneath each player, first enter that player's position.

Replace `each.assign(...)` in the complete example with this loop body fragment:

```java
each.at(each.position(player), atPlayer -> {
    PositionHandle below = atPlayer.offset(
        atPlayer.currentPosition(), 0, -1, 0);
    Expr<BoolT> onStone = atPlayer.blockMatches(
        atPlayer.blockAt(below),
        BlockPredicate.block("minecraft:stone"));
    atPlayer.ifThen(onStone, branch -> {
        MinecraftBuilder here = branch.minecraft();
        Ref<IntT> value = here.score(player, "points");
        here.assign(value, here.add(value.load(), here.intLiteral(1)));
    });
});
```

This version awards points only to targets standing on stone. `position(player)` obtains the player position. `offset(..., 0, -1, 0)` selects one block below. `blockMatches` generates a runtime block test.

## Rotation, offsets, and block conditions

| API | Purpose |
| --- | --- |
| `rotated(rotation, body)` | Set rotation for generated code |
| `currentRotation()` | Obtain the current rotation |
| `offset(base, x, y, z)` | Offset along world axes |
| `localOffset(base, rotation, left, up, forward)` | Offset along left, up, and forward axes of a specified rotation |
| `BlockPredicate.tag("minecraft:logs")` | Test a block tag |
| `predicate.withState(name, value)` | Add a block state condition |

Entity and position objects belong to their creating code scopes. Use them in the corresponding callbacks and nested builders to keep operation targets explicit.

The compiler repository contains a complete raycast example in `examples/mni/raycast`. Read [Entities and contexts](../minecraft/entities) for similar operations in ordinary MCFPP functions.
