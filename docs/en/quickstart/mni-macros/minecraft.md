---
lastUpdated: true
---

# Minecraft operations in macros

`CodeScope` directly provides `MinecraftBuilder` operations. Create `src/main/kotlin/example/macros/PlayerMacros.kt`:

```kotlin
package example.macros

import top.mcfpp.annotations.MNIMacro
import top.mcfpp.mni.api.*

object PlayerMacros {
    @JvmStatic
    @MNIMacro
    fun awardPlayers(context: MacroContext): Block = context.quote.block {
        executeAs(entities(EntityQuery.allPlayers())) { player ->
            score(player, "points") += 1
        }
    }
}
```

Declare the macro in MCFPP:

```mcfpp
func awardPlayers(): void = example.macros.PlayerMacros.awardPlayers
```

Create the `points` objective and initialize scores, then call `awardPlayers()` from MCFPP:

```mcfunction
scoreboard objectives add points dummy
scoreboard players set @a points 0
```

Each runtime invocation adds one point to every current player. `entities(...)` records the query, which selects targets at runtime. The callback's `player` is one `EntityHandle`; `score(player, "points")` returns `Ref<IntT>`.

## Executor, position, and rotation

`executeAs` changes the executor, `at` changes position, and `rotated` changes rotation. Each Kotlin callback receives the corresponding child `CodeScope`. Replace the score update above with:

```kotlin
at(position(player)) {
    val below = offset(currentPosition(), 0.0, -1.0, 0.0)
    ifThen(blockMatches(blockAt(below), BlockPredicate.block("minecraft:stone"))) {
        score(player, "points") += 1
    }
}
```

This version awards points only to players standing on stone. Handles retain their creation scope and context; use them in that callback and its valid descendants.

| API | Purpose |
| --- | --- |
| `EntityQuery.allEntities().withType("minecraft:zombie").withTag("arena").withLimit(5).sorted(EntitySort.NEAREST)` | Select up to five nearest tagged zombies |
| `score(ScoreHolder.named("#health"), "hp")` | A fixed holder's score location |
| `position(x, y, z)` / `position(entity)` | Absolute or entity position |
| `offset(base, x, y, z)` | World-axis offset |
| `localOffset(base, rotation, left, up, forward)` | Local offset using an explicit rotation |
| `currentRotation()` / `rotation(yaw, pitch)` | Current or absolute rotation |
| `BlockPredicate.tag("minecraft:logs")` | A block-tag predicate |

Coordinates and offsets use host `Double` literals. The complete raycast example is under `examples/mni/raycast/provider/kotlin` in the compiler repository. See the [Kotlin DSL API](/en/api/kotlin-dsl).
