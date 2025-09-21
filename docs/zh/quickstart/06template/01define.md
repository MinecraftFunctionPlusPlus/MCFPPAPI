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
    a as int;  # 一个整数
    b as nbt;  # 任意的NBT值
    
    # 也可以定义一些方法
    func print(){
        print(this.a);
        print(this.b);
    }
}

func main(){
    # 创建对象
    var t = Test();
    t.a = 5;
    t.b = {
        "key": "value"
    };

    # 或者直接写入值
    var t2 as Test = {
        "a": 5,
        "b": {
            "key": "value"
        }
    };
}
```

使用`.`来访问一个数据模板中的成员。如果在数据模板内部，则需要显式使用`this`关键字来访问。

```mcfpp
print(t.a);
print(t.b);
```
