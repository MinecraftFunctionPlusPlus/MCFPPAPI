---
lastUpdated: true
---

# 单例与伴随对象

`object data` 声明一份共享成员。通过声明名称读取字段和调用方法：

```mcfpp
object data Settings {
    var reward: int = 10

    func amount(): int {
        return Settings.reward
    }
}

func main() {
    print(Settings.amount())
}
```

对象初始化按依赖关系执行一次。项目内对象是程序声明的一部分。导入库中的对象在需要时参与初始化。

同名 `data` 和 `object data` 可以组成模板与伴随对象。模板名称访问共享成员，实例访问实例字段：

```mcfpp
data Reward {
    var amount: int = 5
}

object data Reward {
    var defaultAmount: int = 10
}

func main() {
    var reward = Reward()
    print(reward.amount)
    print(Reward.defaultAmount)
}
```

泛型模板与伴随对象使用匹配的只读参数声明。它们的成员仍按各自声明身份查找。
