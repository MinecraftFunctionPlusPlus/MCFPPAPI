---
lastUpdated: true
---

# 实体与执行上下文

实体值记录如何找到目标。可以使用选择器，也可以按名称或 UUID 创建实体值。

```mcfpp
func main() {
    var players = @a
    var alex = entityByName("Alex")
    var known = entityByUUID("0-0-0-0-1")
    tp(players, 0 80 0)
}
```

`entityByName` 接收玩家名称。`entityByUUID` 接收五段十六进制 UUID。目标在使用时解析，因此 `@s` 表示当时的执行者。

## 在每个目标的位置执行

`withPosCtx` 为每个目标调用一次回调。它设置执行位置、朝向和维度。回调中的 `ctx.executor` 表示进入回调时绑定的执行者。

```mcfpp
func main() {
    @a.withPosCtx { ctx ->
        /particle minecraft:flame ~ ~1 ~ 0 0 0 0 1
    }
}
```

这个函数在每位玩家的位置生成粒子。`withPosCtx` 保留调用者的执行身份。

## 以每个目标的身份执行

`withEntityCtx` 切换执行者。位置沿用调用处的位置。

```mcfpp
func main() {
    @a.withEntityCtx { ctx ->
        /say Hello
    }
}
```

需要同时使用目标的身份和位置时，在目标的实体上下文中读取 `ctx.executor`，再进入它的位置上下文。

## 遍历实体关系

`onPassengers` 获取直接乘客。其他关系包括 `onVehicle`、`onOrigin`、`onOwner`、`onController`、`onLeasher`、`onTarget` 和 `onAttacker`。这些关系需要 Minecraft 1.19.4 或更新版本。

```mcfpp
func main() {
    @s.withPosCtx { origin ->
        origin.onPassengers { passenger ->
            tp(passenger.executor, origin.pos)
        }
    }
}
```

在游戏中以一个有乘客的实体运行这个函数。它会把直接乘客传送到 `origin.pos`。位置值包含维度，`tp` 会一并使用。

`ctx.executor` 绑定当前回调的实体身份。`ctx.pos` 记录当前回调的位置和维度。把这些值用于当前同步回调及其调用的同步函数，可以在嵌套操作中保持目标明确。

## 运行需要执行者的函数

假设工程命名空间为 `demo`：

```mcfunction
execute as @a at @s run function demo:main
```

它让每位玩家成为执行者，并在各自位置调用 `main`。更多原生上下文写法见[原生命令](../02base/05original-command)。
