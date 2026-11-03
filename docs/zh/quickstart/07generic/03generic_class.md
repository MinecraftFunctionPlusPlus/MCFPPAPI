---
lastUpdated: true
---

# 泛型数据模板：保存不同类型的数据

[泛型函数](./02generic_function)把类型参数用于一次函数调用。泛型数据模板把类型参数用于一类对象：字段、构造函数和方法都可以使用调用者选择的类型。

这里用 `Box<T>` 保存一个值。`Box<int>` 保存整数，`Box<string>` 保存字符串。

## 完整示例

```mcfpp
data Box<T> {
    var value: T

    constructor(value: T) {
        this.value = value
    }

    func read(): T {
        return this.value
    }
}

func showScore(box: Box<int>) {
    print(box.read())
}

func main() {
    var score = Box<int>(10)
    var label = Box<string>("Ready")
    showScore(score)
    print(label.read())
}
```

运行 `main` 后依次显示 `10` 和 `Ready`。

## 类型参数作用在哪里

| 示例位置 | `Box<int>` 中的类型 | `Box<string>` 中的类型 |
| --- | --- | --- |
| 字段 `value: T` | `int` | `string` |
| 构造参数 `value: T` | `int` | `string` |
| `read(): T` 的结果 | `int` | `string` |

在 `Box<int>(10)` 中，`<int>` 选择模板的类型，`(10)` 调用构造函数。创建对象后，它的 `T` 就由这个选择确定。

`this.value = value` 把构造参数保存到新对象的字段。`read()` 取出字段，返回同一种类型的数据。

## 把泛型类型写进参数声明

`showScore(box: Box<int>)` 表示这个函数需要一个保存整数的 `Box`。这样，函数体中的 `box.read()` 具有确定的 `int` 类型。

需要接收多种 `Box` 时，也可以给函数添加自己的类型参数。它的声明写作：

```mcfpp
func readBox<T>(box: Box<T>): T {
    return box.read()
}
```

将这段函数放在上面的 `Box<T>` 声明之后。在 `main` 中调用 `readBox<int>(score)`，就能得到保存的整数。模板参数 `T` 和函数参数 `T` 分别属于各自的声明。

## 每个对象保存自己的值

`Box<int>(10)` 与 `Box<int>(20)` 使用同一种类型。它们仍是两个对象，各自保存字段。相同的类型实参让编译器复用模板实现，对象数据则按构造调用分别创建。

需要给模板提供固定数值配置时，继续阅读[编译时参数与已知值](./01concrete_var)。需要了解父子类型之间的泛型关系时，阅读 [in 与 out](../advanced/variance)。
