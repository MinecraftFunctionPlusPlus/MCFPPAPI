---
lastUpdate: true
---

# 数据模板

数据模板（Data Template）是一种类似于类的数据结构。数据模板完全基于NBT数据结构，但是和普通的NBT不同的是，数据模板规定了NBT的结构，或者说规定了NBT中有哪些成员，因此编译器能够在访问数据结构成员的时候进行检查。

## 定义

使用`data`关键字来定义一个数据模板。例如：

```mcfpp
# 定义
data Test{
    int a;  # 一个整数
    nbt b;  # 任意的NBT值
}

func main(){
    # 创建对象
    Test t = Test();
    t.a = 5;
    t.b = {
        "key": "value"
    };

    # 或者直接写入值
    Test t2 = {
        "a": 5,
        "b": {
            "key": "value"
        }
    };
}
```

使用`.`来访问一个数据模板中的成员。

```mcfpp
print(t.a);
print(t.b);
```

和类一样，你可以在数据模板中定义一些方法。

```mcfpp
data Test{
    int a;
    nbt b;

    func print(){
        print(this.a);
        print(this.b);
    }
}
```
