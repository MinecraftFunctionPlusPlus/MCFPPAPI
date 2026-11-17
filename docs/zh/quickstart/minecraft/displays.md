---
lastUpdated: true
---

# 展示实体与调度

用 `EntityRef<ItemDisplay>` 操作世界中某个已生成的物品展示实体。`transform.y` 调整模型相对实体的高度，`transform.scale.x` 修改一个缩放分量。已知 UUID 时可用 `entityByUUID<ItemDisplay>(id)` 取得引用；调用者负责确认实际实体类型，运行时可用 `checkType<ItemDisplay>()` 检查。

```mcfpp
func timers() {
    loop(10) { frame ->
        /say repeated-every-10-ticks
        return frame < 2
    }
    schedule(20) {
        /say after-20-ticks
    }
}
```

第一次 `loop(10)` 在第 10 tick 触发，`frame` 为 0。它在第 20、30 tick 再触发两次，最后返回 `false` 停止。`schedule(20)` 在第 20 tick 执行一次。要每 tick 更新，用 `tick { frame -> ... }`，首次回调在下一 tick。

延迟任务登记时捕获局部值，在服务器调度上下文中执行。要跨 tick 操作同一个实体，可以捕获其类型化引用，再在回调里写 `display.transform.y`。[示例 07](../../examples/07-display-animation) 将弹跳曲线的结果写入此属性，可在 IDEA 预览中播放。
