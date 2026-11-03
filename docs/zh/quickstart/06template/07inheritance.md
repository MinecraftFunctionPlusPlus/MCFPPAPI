---
lastUpdated: true
---

# 继承与抽象模板

在模板名后的 `:` 列出父模板。子模板继承字段和方法，用 `override` 实现重写。

```mcfpp
abstract data Readable {
    abstract func read(): int
}

data Counter: Readable {
    var value: int = 5

    override func read(): int {
        return this.value
    }
}

func main() {
    var counter = Counter()
    print(counter.read())
}
```

`abstract data` 声明可供子模板实现的共同接口。`abstract func` 只声明方法签名。具体子模板实现所有抽象方法后，就可以创建实例。

多个父模板用逗号分隔，例如 `data Combined: First, Second`。成员重名时，按继承关系明确实现，保持字段类型一致。
