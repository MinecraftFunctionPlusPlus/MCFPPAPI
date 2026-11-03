---
lastUpdated: true
---

# 变量

变量保存程序要处理的数据。`var` 声明可重新赋值的变量，类型写在名称后面。

```mcfpp
func main() {
    var lives: int = 3
    var bonus = 2
    const maxLives = 10
    external score: int = 0

    lives += bonus
    score += lives
    print(score)
}
```

`lives: int` 明确指定整数类型。`bonus = 2` 从初始值推断为 `int`。先声明再赋值时，写出类型，并在读取之前完成初始化。

## 常用类型

| 类型 | 用途 | 示例 |
| --- | --- | --- |
| `int` | 整数与计分板运算 | `42` |
| `float` | 浮点运算 | `1.5` |
| `bool` | 条件 | `true` |
| `string` | 字符串 | `"hello"` |
| `text` | Minecraft 聊天文本 | `"hello"` |
| `nbt` | 任意 NBT 数据 | `{count: 2}` |
| `list<T>` | 有序元素 | `[1, 2, 3]` |
| `dict<T>` | 字符串键和值 | `{red: 1, blue: 2}` |
| `map<T>` | 可列出键的映射 | 见 [Map](../05nbt/04map) |
| `entity` | 游戏实体 | 通过实体接口获取 |
| `selector` | Minecraft 选择器 | `@a` |

使用 [`data`](../06template/01define) 定义自己的字段类型。使用 [`ScoreRef` 与 `NBTRef<T>`](./06references) 保存游戏中数据的地址。

## const 与 external

`const` 允许一次赋值，适合配置值和固定的地址引用。引用的绑定保持固定，目标数据仍可通过引用的 `set` 方法更新。

`external` 要求使用运行时存储。上例中的 `score` 即使初始值为 `0`，后续运算也按运行时值处理。

普通变量的已知值可以在编译时计算：

```mcfpp
func main() {
    var total = 5
    total += 7
    print(total)
}
```

编译器能在此处算出 `12`。当变量接收运行时输入时，编译器改为生成相应命令。`const` 描述赋值次数，编译时已知描述编译器是否知道值。
