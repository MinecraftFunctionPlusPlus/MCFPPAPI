---
lastUpdated: true
---

# 原版资源协同

MCFPP、原版数据包和客户端资源可以放在一个工程里：

```text
src/main/mcfpp/main.mcfpp
src/main/resources/data/demo/function/effects.mcfunction
src/main/resources/data/demo/advancement/use_wand.json
src/main/resources/assets/demo/items/wand.json
src/main/resources/assets/demo/models/item/wand.json
src/main/resources/assets/demo/textures/item/wand.png
```

执行 `mcfpp build`，得到 `build/<name>` 数据包和 `build/<name>-resources` 资源包。将前者安装到世界的 `datapacks`，后者放入客户端的 `resourcepacks` 并启用。没有 assets 文件时不生成资源包。

## 让进度调用 MCFPP

在 `mcfpp.toml` 中显式导出一个入口：

```toml
[entrypoints]
"demo:on_use" = "demo:handleUse"
```

```mcfpp
func handleUse() {
    print("Used the wand")
    /function demo:effects
    /advancement revoke @s only demo:use_wand
}
```

进度 JSON 使用 `"rewards": {"function": "demo:on_use"}`。原版调用沿用执行者和位置，包装器负责 MCFPP 调用帧的建立和清理。函数标签和 schedule 同样可以使用公开 ID。

目标必须是唯一、公开、无参数、返回 void 的普通顶层函数。右侧保留声明名的大小写；左侧遵循原版资源 ID 规则，并与生成函数 ID 不同。本例 `handleUse` 的内部函数为 `demo:handle_use`，公开 ID 为 `demo:on_use`。

## 物品定义引用模型和贴图

Minecraft 1.21.4 及以上可在 `assets/demo/items/wand.json` 中写：

```json
{"model":{"type":"minecraft:model","model":"demo:item/wand"}}
```

对应模型 `assets/demo/models/item/wand.json`：

```json
{"parent":"minecraft:item/generated","textures":{"layer0":"demo:item/wand"}}
```

最后放入贴图 `assets/demo/textures/item/wand.png`。通过物品的 `minecraft:item_model="demo:wand"` 组件引用物品定义。

## 插件和构建诊断

IDEA 插件 0.6.0 对已识别的命令和 JSON 资源字段提供类型相关的补全、跳转、缺失引用提示和资源文件重命名更新。公开入口直接跳转到 MCFPP 声明，重命名声明时更新 TOML 目标，供原版调用的公开 ID 保持稳定。MCFPP 面板的 **Data Pack**、**Resource Pack** 打开对应输出目录。

普通资源与编译产物同路径时构建失败。确有需要时，在 TOML 第一个表之前声明 `resourceOverrides = ["demo/function/example.mcfunction"]`。公开入口不能覆盖。函数标签合并并去重，编译器要求的初始化与 tick 条目保留。

构建在临时目录完成资源组装和检查，再发布两份输出。冲突、JSON 语法错误或已识别的本工程引用缺失时，上一份成功的包保留。可选标签成员、动态资源 ID、Minecraft 和其他外部命名空间不会被当作本地缺失。插件的基础 schema 与静态检查覆盖常用引用，游戏仍负责完整的版本相关格式验证。

编译器仓库的 `examples/vanilla-integration` 提供完整示例。可以先用 `/advancement grant @s only demo:use_wand` 验证回调链，再测试物品使用。
