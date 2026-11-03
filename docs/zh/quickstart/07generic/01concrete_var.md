---
lastUpdated: true
---

# 编译时参数与已知值

前两节使用 `<T>` 选择类型。尖括号还可以接收编译时已知的数值。例如，一个函数可以把“固定奖励”作为编译配置，把“玩家当前分数”作为普通输入。

MCFPP 将尖括号中的参数称为**只读参数**。`<T>` 和 `<T: type>` 都是只读类型参数，`<bonus: int>` 是只读整数参数。

## 固定奖励与运行时分数

```mcfpp
func addBonus<bonus: int>(score: int): int {
    return score + bonus
}

func main() {
    external score: int = 10
    print(addBonus<5>(score))
    print(addBonus<20>(score))
}
```

执行 `main` 时，两处调用分别显示 `15` 和 `30`。

| 输入 | 调用中的位置 | 在什么时候提供 |
| --- | --- | --- |
| 固定奖励 `bonus` | `<5>`、`<20>` | 构建数据包时 |
| 当前分数 `score` | `(score)` | 游戏执行函数时 |

构建时，编译器为奖励 `5` 和 `20` 准备相应的函数实现。之后，生成的函数可以反复接收游戏运行时的分数。

如果奖励也要随游戏状态变化，把它写成普通参数 `bonus: int`，与 `score` 一起放入圆括号即可。

## 怎样提供编译时已知的值

可以直接传入字面量，也可以使用编译器能够确定结果的表达式：

```mcfpp
const BASE_BONUS: int = 5

func addBonus<bonus: int>(score: int): int {
    return score + bonus
}

func main() {
    var extra = 2
    print(addBonus<BASE_BONUS + extra>(10))
}
```

这里 `BASE_BONUS + extra` 在调用处已知为 `7`，所以结果为 `17`。`extra` 用 `var` 声明，编译器仍可以知道它在这个位置的值。

游戏读取结果、运行时函数参数和 `external` 变量适合放进普通参数。只读参数需要在构建时确定，编译器据此准备对应实现。

## const、var 和只读参数各自解决什么问题

| 写法 | 作用 |
| --- | --- |
| `var value = 5` | 声明可以重新赋值的变量 |
| `const value = 5` | 声明只赋值一次的变量 |
| `func f<value: int>()` | 调用者在构建时提供一个整数配置 |
| `func f(value: int)` | 生成的函数通过普通参数接收整数 |
| `external value: int = 5` | 明确为变量使用游戏运行时存储 |

“编译器是否知道这个值”取决于具体位置的数据来源。它与变量能否重新赋值分别判断。

## 给数据模板提供数值参数

```mcfpp
data Reward<bonus: int> {
    func apply(score: int): int {
        return score + bonus
    }
}

func main() {
    var small = Reward<5>()
    var large = Reward<20>()
    print(small.apply(10))
    print(large.apply(10))
}
```

两个对象使用不同的固定奖励配置，分别得到 `15` 和 `30`。需要同时选择类型与数值时，可以在同一参数表中声明它们，例如 `data Box<T, limit: int>`。

需要追踪具体生成了哪些函数时，使用[构建 IR](../01project/04build-and-ir)。继续阅读 [in 与 out](../advanced/variance)，了解泛型类型之间的替换关系。
