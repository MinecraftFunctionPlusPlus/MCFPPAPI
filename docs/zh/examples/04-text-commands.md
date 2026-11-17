# 04 · 从聊天组件到计分板命令

`rewardLabel` 组合金色名称、绿色分数、悬停说明和点击建议。`Text.translatable` 接收翻译键、参数列表和后备字符串。接下来的命令块把同一个 MCFPP 变量写入 Minecraft 计分板。

```mcfpp
func main() {
    var points = 25
    print(rewardLabel("任务奖励", points))
    print(Text.of("跳跃键：") + Text.keybind("key.jump"))
    print(Text.translatable("showcase.welcome", [Text.of("Steve")], "Welcome, %s!"))
    /{
        scoreboard objectives add showcase_text dummy
        scoreboard players set #points showcase_text ${points}
        execute if score #points showcase_text matches 25 run say text-command-demo
    }
}
```

## 动手验证

在游戏里点击奖励文本，输入框会填入 `/help`。`commandInterpolation` 测试读取 `#points` 并检查值为 `25`。把 `points` 改成 `24` 后重新构建，分数也变为 `24`，最后一条命令的 `matches 25` 条件不再成立。

游戏入口为 `/function showcase.text:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/04-text-commands/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/04-text-commands/src/test/mcfpp/text_test.mcfpp)
