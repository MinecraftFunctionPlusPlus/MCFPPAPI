---
lastUpdated: true
---

# 宏中的 Minecraft 操作

`CodeScope` 直接提供 `MinecraftBuilder` 操作。创建 `src/main/kotlin/example/macros/PlayerMacros.kt`：

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

在 MCFPP 中声明并调用：

```mcfpp
func awardPlayers(): void = example.macros.PlayerMacros.awardPlayers
```

创建 `points` 目标并初始化分数，然后从 MCFPP 调用 `awardPlayers()`：

```mcfunction
scoreboard objectives add points dummy
scoreboard players set @a points 0
```

每次运行调用方函数，当前所有玩家加一分。`entities(...)` 保存选择条件；游戏运行时选择实际目标。`executeAs` 回调的 `player` 是单个 `EntityHandle`，`score(player, "points")` 返回 `Ref<IntT>`。

## 身份、位置与朝向

`executeAs` 改变执行者，`at` 改变位置，`rotated` 改变旋转。每个 Kotlin 回调使用对应的子 `CodeScope`。例如，把上例的加分语句换为：

```kotlin
at(position(player)) {
    val below = offset(currentPosition(), 0.0, -1.0, 0.0)
    ifThen(blockMatches(blockAt(below), BlockPredicate.block("minecraft:stone"))) {
        score(player, "points") += 1
    }
}
```

这个版本只给站在石头上的玩家加分。句柄保留创建它们的作用域和上下文；在相应回调及其合法内层使用。

| API | 作用 |
| --- | --- |
| `EntityQuery.allEntities().withType("minecraft:zombie").withTag("arena").withLimit(5).sorted(EntitySort.NEAREST)` | 选择最近的五只带标签僵尸 |
| `score(ScoreHolder.named("#health"), "hp")` | 固定持有者的分数位置 |
| `position(x, y, z)` / `position(entity)` | 绝对位置或实体位置 |
| `offset(base, x, y, z)` | 沿世界坐标轴偏移 |
| `localOffset(base, rotation, left, up, forward)` | 按明确旋转进行局部偏移 |
| `currentRotation()` / `rotation(yaw, pitch)` | 当前旋转或绝对旋转 |
| `BlockPredicate.tag("minecraft:logs")` | 方块标签条件 |

坐标和偏移量使用宿主 `Double` 字面量。完整射线示例位于编译器仓库 `examples/mni/raycast/provider/kotlin`。API 方法表见 [Kotlin DSL API](/zh/api/kotlin-dsl)。
