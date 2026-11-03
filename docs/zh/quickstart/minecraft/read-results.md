---
lastUpdated: true
---

# 读取分数、NBT 与命令结果

游戏中的计分项和 NBT 路径可能尚未存在。`tryRead` 同时提供“是否读到值”和“读到的值”。

## 读取实体分数

先在游戏中创建测试数据：

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

路径存在时，`tryRead` 调用一次回调，并返回 `true`。分数为零也算读取成功。路径缺失时返回 `false`。

回调参数是读取到的快照。写回数据时，使用地址值的 `set` 方法。完整示例见 [ScoreRef 与 NBTRef](../02base/06references)。

## 读取 NBT

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

该示例读取实体 NBT 的 `Air` 字段。`toInt` 把 NBT 数值转换为便于计算的整数。

## 查看命令是否成功

支持结果的标准库命令返回 `CommandResult`。它包含 `success: bool` 和 `result: int`。

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

`success` 表示命令是否成功。`result` 的含义由 Minecraft 命令决定，例如传送命令成功处理的目标数量。
