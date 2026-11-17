# 11 · 沿着符号跨文件导航

`Task` 来自 `models/task.mcfpp`，`reward` 来自 `services/rewards.mcfpp`。`typealias Task as Mission` 给同一类型起一个本地名字。`reward` 调用 `Task.total()` 后把积分翻倍。

```mcfpp
import showcase.editor.models:Task
import showcase.editor.services:*

typealias Task as Mission

/// 在 Mission 上执行跳转定义、重命名、悬停、参数提示和 Find Usages。
func main() {
    var mission: Mission = {name: "探索遗迹", points: 15}
    var result = reward(mission)
    print(Text.of(mission.name).color("gold") + Text.of(result))
}
```

## 动手验证

在 IDEA 里从 `reward(mission)` 跳到声明，查看文档中的 `@param` 与 `@return`，再对 `Task` 执行 **Find Usages** 查找跨文件引用。试着对 `reward` 使用 **Rename** 并查看预览。运行 `crossFileResolution` 时，基础积分 `15` 应得到奖励 `30`。

游戏入口为 `/function showcase.editor:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/11-editor-tour/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/11-editor-tour/src/test/mcfpp/editor_test.mcfpp)
