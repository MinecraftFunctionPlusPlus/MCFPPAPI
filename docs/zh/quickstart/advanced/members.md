---
lastUpdated: true
---

# 属性与运算符

属性把读取和赋值转换为指定的代码。运算符让数据模板参与 `+` 等表达式。

## 用 get 和 set 管理属性

`field` 表示属性保存的原始值。`value` 表示正在赋入的新值。

```mcfpp
data Counter {
    var value: int = 0 {
        get { return field }
        set {
            if (value < 0) {
                field = 0
            } else {
                field = value
            }
        }
    }
}

func main() {
    var counter = Counter()
    counter.value = -5
    print(counter.value)
    counter.value = 8
    print(counter.value)
}
```

该示例输出 `0` 和 `8`。调用者仍使用普通属性读写语法。校验逻辑集中在 `set` 中。

## 定义加法

以下为运算符声明语法。当前 CLI 的数据模板运算符调用仍待完善；本节后半提供普通方法实现。

```text
data Points {
    var value: int = 0

    constructor(value: int) {
        this.value = value
    }

    operator +(other: int): int {
        return this.value + other
    }
}

func main() {
    var points = Points(10)
    print(points + 5)
    print(points.value)
}
```

这里展示运算符声明语法。当前 CLI 对 `points + 5` 会报告不支持该运算。实际工程可先用普通实例方法完成计算：

```mcfpp
data Points {
    var value: int = 10
    func plus(other: int): int {
        return this.value + other
    }
}

func main() {
    var points = Points()
    print(points.plus(5))
}
```

该实现输出 `15`。运算符调用的运行时生成仍需编译器继续完善。
