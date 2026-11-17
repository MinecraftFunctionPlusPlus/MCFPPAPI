# 11 · Follow a symbol across files

`Task` comes from `models/task.mcfpp` and `reward` from `services/rewards.mcfpp`. `typealias Task as Mission` gives the same type a local name. `reward` calls `Task.total()` and doubles the points.

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

## Try it

In IDEA, go to the declaration from `reward(mission)` and inspect its `@param` and `@return` documentation. Use **Find Usages** on `Task` to see references across files. Try **Rename** on `reward` and inspect the preview. Run `crossFileResolution` to check that 15 base points produce a reward of 30.

The in-game entry point is `/function showcase.editor:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/11-editor-tour/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/11-editor-tour/src/test/mcfpp/editor_test.mcfpp)
