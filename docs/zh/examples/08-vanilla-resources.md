# 08 · 让进度奖励调用 MCFPP

`use_spyglass.json` 把原版奖励函数设为 `showcase.resources:on_use`。`mcfpp.toml` 的 `[entrypoints]` 将这个稳定 ID 映射到 `showcase.resources:handleUse`。函数增加使用次数、显示可翻译的文本、调用手写的 `effects.mcfunction`，最后撤销进度，使它可以再次触发。

```mcfpp
func handleUse() {
    /scoreboard players add #uses showcase_resources 1
    print(Text.translatable("showcase.wand_used", [], "Spyglass callback received"))
    /function showcase.resources:effects
    /advancement revoke @s only showcase.resources:use_spyglass
}
```

## 动手验证

运行 `main` 初始化计分板，然后在游戏中使用望远镜。用 `/scoreboard players get #uses showcase_resources` 查看次数。安装构建生成的 `resources-resources` 资源包即可使用项目的中英文翻译。`vanillaCallbackInvokesMcfpp` 直接调用公开入口并检查次数为 `1`。

游戏入口为 `/function showcase.resources:main`。

[完整源码](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/08-vanilla-resources/src/main/mcfpp/main.mcfpp) · [测试](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/08-vanilla-resources/src/test/mcfpp/resources_test.mcfpp) · [mcfpp.toml](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/08-vanilla-resources/mcfpp.toml)
