---
lastUpdated: true
---

# 文档注释

在声明前使用连续的 `///` 行书写 Markdown。IDEA 文档提示可以显示这些说明。

```mcfpp
/// # Reward calculation
/// Adds the configured bonus to a score.
///
/// - Input: the current score.
/// - Result: the score plus five.
func addBonus(score: int): int {
    return score + 5
}

func main() {
    print(addBonus(10))
}
```

`///` 后的一个空格用于分隔，之后的缩进和 Markdown 标记保留。可以使用标题、列表、粗体和行内代码。

为函数说明参数单位、边界和返回结果。为模板说明字段含义。为 MNI 函数说明 Java 在编译时执行，以及它生成的游戏行为。

使用普通 `//` 注释解释某条实现语句。使用 `///` 说明对调用者有用的接口。

## 在代码块中查看 API 文档

将鼠标移到下面带点状下划线的名称上，可以查看从 MCFPP 声明导出的文档。点击名称可以固定卡片；键盘使用 Tab 选中名称，再按 Enter 打开、Esc 关闭。

普通 MCFPP 代码块会自动显示 `print`、类型转换、实体目标和引用地址等标准库 API 的卡片。自定义库需要导入其文档，并通过 `api=库名` 指定；只有已收录的声明会显示卡片。正文与参数、返回值、弃用说明均随页面语言切换。

```mcfpp api=example symbols=docs:Counter,docs:Counter.read,docs:identity,docs:oldRead
var counter = Counter()
var current = counter.read()
var score = identity(10)
var legacy = oldRead(score)
```

`identity` 的卡片同时列出整数和布尔重载；`oldRead` 的卡片显示弃用说明。这些说明来自显式 MCFPP 声明上的 `///`，普通函数、原生 MNI 函数和 MNI 宏共用同一种文档数据。

代码块通过名称查询已导出的 API 文档。同名声明会列为候选；这里没有执行调用点的类型推断。字符串、注释和原生命令文本中的相同名称不会触发卡片。

### 给文档网站接入自己的库

1. 在库工程中运行 `mcfpp doc --format json`。
2. 在 MCFPPAPI 仓库导入产物：`pnpm docs:api <库输出目录>/docs/docs.json my-library`。
3. 在 Markdown 围栏的语言后添加 `api=my-library`：

````md
```mcfpp api=my-library
// 使用库中的类型或函数
```
````

如需限定候选，可添加 `symbols=命名空间:类型,命名空间:类型.成员`；使用导出 JSON 中的声明 `id` 可以限定到一个具体重载。更新 JSON 后重新启动或构建网站。导入后，网站构建只需要 Node.js，浏览器无需加载编译器。

本文示例的源码位于 MCFPP 仓库的 `examples/documentation`。站点维护与重新生成步骤见仓库内的 `scripts/API-HOVERS.md`。

## 为自己的工程生成文档

```sh
mcfpp doc
mcfpp doc --format json --include-private --output api
```

第一条命令默认生成 `build/docs/index.html` 和 `build/docs/docs.json`。打开 HTML 即可离线浏览和搜索。`--include-private` 加入私有声明，相对 `--output` 路径从工程根目录计算。用 `/// @param` 和 `/// @return` 记录接口约定，IDE 悬停与导出文档会读取同一份注释。[工程 11](../../examples/11-editor-tour) 提供跨文件导航练习。
