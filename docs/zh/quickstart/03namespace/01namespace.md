---
lastUpdated: true
---

# 命名空间与导入

命名空间给函数和数据类型分组。Minecraft 使用 `命名空间:路径` 找到生成的资源。

## 从目录推导

当 `mcfpp.toml` 中设置 `namespace = "hello"` 时：

| 源码位置 | 默认命名空间 |
| --- | --- |
| `src/main/mcfpp/main.mcfpp` | `hello` |
| `src/main/mcfpp/game/rewards.mcfpp` | `hello.game` |
| `src/main/mcfpp/game/rounds/start.mcfpp` | `hello.game.rounds` |

文件夹形成命名空间，文件名用于组织源码。同一个文件夹中的文件可以声明同一命名空间的函数。

## 显式声明

将 `namespace` 放在文件开头：

```mcfpp
namespace demo.rewards

func grant() {
    /give @s minecraft:stone 1
}
```

对应游戏函数为 `demo.rewards:grant`。

## 导入其他文件

`src/main/mcfpp/rewards.mcfpp`：

```mcfpp
namespace demo.rewards

func amount(): int {
    return 10
}
```

`src/main/mcfpp/main.mcfpp`：

```mcfpp
import demo.rewards:*

func main() {
    print(amount())
}
```

需要区分同名函数时，使用完整命名空间调用，例如 `demo.rewards:amount()`。MNI 的 Java 包名是另一套名称，写在[原生声明](../09mni/02mni-framework-implementation)的等号右侧。
