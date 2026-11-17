# MCFPP 示例

每个编号目录都是一个可独立打开的工程。先装好支持 Minecraft Java 26.3 的 MCFPP 开发版和 JDK 25，再从第一个工程开始。

```sh
git clone https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example.git
cd MCFPP_Example/01-language-basics
mcfpp build
mcfpp test --dsb-jar /path/to/datapack-sandbox-cli.jar
```

将 JAR 路径替换为本机的 DatapackSandbox CLI。源码测试会在 DSB 世界中执行。要在游戏里运行，把 `build/basics` 放入存档的 `datapacks`，执行 `/reload` 和 `/function showcase.basics:main`。聊天栏应依次出现 `sum=15`、`factorial=120`、`2.5`。

在 IDEA 里打开含 `mcfpp.toml` 的编号目录。想练习断点可从 09 开始，要预览动画可从 07 开始。VS Code 可以直接打开仓库的 `examples.code-workspace`。

[示例仓库](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/tree/8f39d3921157404c642f1613fa40811f35213761) · [构建兼容的 DSB 运行时](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/tools/runtime/README.md)

## 语言与数据

- [01 · 范围、递归与浮点数](./01-language-basics)
- [02 · 给坐标加上名字](./02-data-models)
- [03 · 用集合回调结算奖励](./03-functions-collections)
- [04 · 从聊天组件到计分板命令](./04-text-commands)
- [05 · 复制 NBT 地址](./05-score-nbt)

## 实体与游戏资源

- [06 · 分别修改两个展示实体](./06-entities-context)
- [07 · 逐 tick 播放弹跳动画](./07-display-animation)
- [08 · 让进度奖励调用 MCFPP](./08-vanilla-resources)

## 测试、扩展与编辑器

- [09 · 在递归调用中观察局部变量](./09-tests-debugger)
- [10 · 用 Kotlin 展开带回调的宏](./10-kotlin-mni)
- [11 · 沿着符号跨文件导航](./11-editor-tour)
