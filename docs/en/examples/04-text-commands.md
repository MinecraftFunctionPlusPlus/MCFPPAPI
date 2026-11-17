# 04 · From chat components to scoreboard commands

`rewardLabel` combines a gold name, a green score, hover text and a suggested command. `Text.translatable` supplies a translation key, arguments and fallback text. The command block then writes the same MCFPP variable to a Minecraft scoreboard.

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

## Try it

Click the reward text in game to fill the chat input with `/help`. The `commandInterpolation` test reads `#points` and checks for `25`. Change `points` to `24` and rebuild. The score changes with it, so the last command’s `matches 25` condition is false.

The in-game entry point is `/function showcase.text:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/04-text-commands/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/04-text-commands/src/test/mcfpp/text_test.mcfpp)
