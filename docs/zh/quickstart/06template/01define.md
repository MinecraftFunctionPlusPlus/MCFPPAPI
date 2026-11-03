---
lastUpdated: true
---

# 数据模板

`data` 定义一组有名字的字段，也可以包含构造函数和方法。它让编译器知道 NBT 数据应包含哪些成员。

```mcfpp
data Reward {
    var amount: int
    var label: string

    constructor(amount: int, label: string) {
        this.amount = amount
        this.label = label
    }

    func show() {
        print(this.label)
        print(this.amount)
    }
}

func main() {
    var reward = Reward(10, "Daily reward")
    reward.amount += 5
    reward.show()
}
```

`constructor` 初始化新对象。`this` 表示当前对象，在方法中使用 `this.amount` 访问字段。外部使用 `reward.amount`。

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

这段代码依次打印 `10` 和 `20`。使用构造函数明确初始化字段，可以直接检查参数与字段类型。

接下来可以使用[嵌套模板](./02template-nest)、[单例对象](./06object)和[继承](./07inheritance)。需要通用字段类型时，使用[泛型模板](../07generic/03generic_class)。
