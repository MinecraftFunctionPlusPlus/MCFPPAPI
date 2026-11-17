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

## 在实例方法中实现加法

当前开发版 CLI 接受 `operator +` 的声明，但对普通 `data Points` 调用 `points + 5` 会报告不支持该运算。下面的 `plus` 方法可以直接运行。

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

`points.plus(5)` 读取实例的 `value` 并返回 `15`。
