---
lastUpdated: true
---

# 宏中的 Minecraft 操作：实体、位置和计分板

前面生成了算术和循环。本节让宏为每个玩家增加一分。继续使用[宏库中的 Java 入口](./overview)，通过 `MinecraftBuilder` 组合目标和操作。

## 完整的加分入口

`example/macros/PlayerMacros.java`：

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

游戏中先准备计分板和测试分数：

```mcfunction
scoreboard objectives add points dummy
scoreboard players set @a points 0
```

在加载该宏的工程中，让 MCFPP 函数调用 `awardPlayers()`。每执行一次，当前所有玩家的 `points` 增加 `1`。

## 从目标集合走到单个玩家

| 代码 | 含义 |
| --- | --- |
| `code.minecraft()` | 取得构造 Minecraft 操作的接口 |
| `EntityQuery.allPlayers()` | 描述“所有玩家”这个选择条件 |
| `minecraft.entities(...)` | 得到一个目标集合 `EntitySet` |
| `executeAs(players, ...)` | 生成以每个目标身份执行的代码 |
| 回调中的 `player` | 当前单个玩家的 `EntityHandle` |
| `each.score(player, "points")` | 当前玩家在 `points` 中的可写分数位置 |

`EntityQuery` 描述如何选目标。Java 构建代码时保存这个条件；游戏运行时才按条件查找实际目标。

`points.load()` 生成读取，`each.add` 生成加一，`each.assign` 生成写回。这三个动作组成一次加分。

## 替换目标条件

例如，想对附近五只带有 `arena` 标签的僵尸执行同一操作，将完整示例中的目标集合那一行替换为：

```java
EntitySet players = minecraft.entities(
    EntityQuery.allEntities()
        .withType("minecraft:zombie")
        .withTag("arena")
        .withLimit(5)
        .sorted(EntitySort.NEAREST)
);
```

此时变量仍叫 `players`，但集合内容由选择条件决定。实际项目中可以将变量名改为 `targets`，让名字与用途对应。

## 身份与位置分别设置

`executeAs` 改变执行者，`at` 改变执行位置。需要在每个玩家脚下检查方块时，先进入该玩家的位置。

把完整示例中 `each.assign(...)` 那一行替换为下面的循环体片段：

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

这个版本只给站在石头上的目标加分。`position(player)` 取得玩家位置，`offset(..., 0, -1, 0)` 选中下方一格。`blockMatches` 生成游戏运行时的方块判断。

## 朝向、偏移与方块条件

| API | 作用 |
| --- | --- |
| `rotated(rotation, body)` | 为一段代码设置朝向 |
| `currentRotation()` | 取得当前朝向 |
| `offset(base, x, y, z)` | 沿世界坐标轴偏移 |
| `localOffset(base, rotation, left, up, forward)` | 按指定朝向沿左、上、前三轴偏移 |
| `BlockPredicate.tag("minecraft:logs")` | 检查方块标签 |
| `predicate.withState(name, value)` | 为方块条件附加状态 |

实体和位置对象对应创建它们的代码作用域。在相应回调及其内层构造逻辑中使用这些对象，可以保持每个操作的目标明确。

完整射线检测示例位于编译器仓库 `examples/mni/raycast`。普通 MCFPP 函数中的同类操作见[实体与上下文](../minecraft/entities)。
