# 08 · Call MCFPP from an advancement reward

`use_spyglass.json` names `showcase.resources:on_use` as its reward function. The `[entrypoints]` table in `mcfpp.toml` maps that stable ID to `showcase.resources:handleUse`. The handler increments the use count, prints translated text, calls the handwritten `effects.mcfunction` and revokes the advancement so it can trigger again.

```mcfpp
func handleUse() {
    /scoreboard players add #uses showcase_resources 1
    print(Text.translatable("showcase.wand_used", [], "Spyglass callback received"))
    /function showcase.resources:effects
    /advancement revoke @s only showcase.resources:use_spyglass
}
```

## Try it

Run `main` to initialize the scoreboard, then use a spyglass in game. Check the count with `/scoreboard players get #uses showcase_resources`. Enable the generated `resources-resources` pack for the project’s Chinese and English translations. `vanillaCallbackInvokesMcfpp` calls the public entry point directly and checks a count of `1`.

The in-game entry point is `/function showcase.resources:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/08-vanilla-resources/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/08-vanilla-resources/src/test/mcfpp/resources_test.mcfpp) · [mcfpp.toml](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/08-vanilla-resources/mcfpp.toml)
