# MCFPP Examples

Each numbered directory is a standalone project. Start with a 26.3-capable MCFPP development build and JDK 25.

```sh
git clone https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example.git
cd MCFPP_Example/01-language-basics
mcfpp build
mcfpp test --dsb-jar /path/to/datapack-sandbox-cli.jar
```

Replace the JAR path with your DatapackSandbox CLI. Source tests run in DSB. To run the first pack in game, copy `build/basics` into the world’s `datapacks` directory, then run `/reload` and `/function showcase.basics:main`. Expect `sum=15`, `factorial=120` and `2.5` in chat.

In IDEA, open the numbered directory containing `mcfpp.toml`. Start at 09 for breakpoints or 07 for animation preview. In VS Code, open the repository’s `examples.code-workspace`.

[Example repository](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/tree/8f39d3921157404c642f1613fa40811f35213761) · [Build the compatible DSB runtime](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/tools/runtime/README.md)

## Language and data

- [01 · Ranges, recursion and floats](./01-language-basics)
- [02 · Give a position a name](./02-data-models)
- [03 · Calculate rewards with collection callbacks](./03-functions-collections)
- [04 · From chat components to scoreboard commands](./04-text-commands)
- [05 · Copy an NBT address](./05-score-nbt)

## Entities and game resources

- [06 · Change one of two display entities](./06-entities-context)
- [07 · Animate a bouncing display](./07-display-animation)
- [08 · Call MCFPP from an advancement reward](./08-vanilla-resources)

## Testing, extensions and the editor

- [09 · Inspect locals during a recursive call](./09-tests-debugger)
- [10 · Expand a callback macro with Kotlin](./10-kotlin-mni)
- [11 · Follow a symbol across files](./11-editor-tour)
