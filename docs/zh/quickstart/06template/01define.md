---
lastUpdated: true
---

# 数据模板

`data` 定义一组有名字的字段，也可以包含创建值的工厂和实例方法。它让编译器知道 NBT 数据应包含哪些成员。

```mcfpp
data Reward {
    var amount: int
    var label: string

    new(amount: int, label: string) {
        return { amount, label }
    }

    func show() {
        print(this.label)
        print(this.amount)
    }
}

func main() {
    var reward = Reward.new(10, "Daily reward")
    reward.amount += 5
    reward.show()
}
```

`Reward.new(10, "Daily reward")` 和 `Reward(10, "Daily reward")` 调用同一个工厂。`new` 在每条成功路径上显式返回包含全部必需字段的值。`{ amount, label }` 读取两个同名参数。旧代码如果在 `constructor` 中逐项写 `this`，请把这些字段放进 `new` 的返回值。实例方法 `show` 仍通过 `this` 读取当前对象。

## 复制对象值

数据模板采用值语义。下面的修改只更新副本：

```mcfpp
data Reward {
    var amount: int = 10
}

func main() {
    var original = Reward()
    var copy = original
    copy.amount = 20
    print(original.amount)
    print(copy.amount)
}
```

因为字段初值足以组成完整的 `Reward`，编译器提供无参工厂 `Reward()`。示例依次打印 `10` 和 `20`。

接下来可以使用[嵌套模板](./02template-nest)、[单例对象](./06object)和[继承](./07inheritance)。需要通用字段类型时，使用[泛型模板](../07generic/03generic_class)。
