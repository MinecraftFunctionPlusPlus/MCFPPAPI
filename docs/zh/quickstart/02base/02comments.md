---
lastUpdated: true
---

# 注释

普通注释以 `//` 开头，持续到行尾。多行说明在每一行前写 `//`。

文档注释以 `///` 开头，写在声明前。连续的文档注释行组成一段 Markdown 文档。

```mcfpp
/// Add two integer scores.
/// The result is the sum of both inputs.
func add(left: int, right: int): int {
    // Keep the calculation in one place.
    return left + right
}

func main() {
    print(add(2, 3))
}
```

文档注释中的 `**粗体**`、列表和代码片段可以帮助解释接口。写出参数含义和返回结果，比重复函数名更有帮助。

版本条件使用 `#if`、`#elif`、`#else` 和 `#endif`。这些行由[版本条件处理器](../minecraft-versions)处理。

更多示例见[文档注释](../11doc/01doc-comment)。
