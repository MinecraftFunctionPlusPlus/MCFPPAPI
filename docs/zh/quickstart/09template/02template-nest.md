---
lastUpdate: true
---

# 数据模板的嵌套

如果一个数据模板中，有另一个数据模板类型的变量作为成员，那么就可以实现数据模板的嵌套。

## 基本使用

```mcfpp
data A{
    valueA as int;
}

data B{
    valueB as int;
    dataA as A;
}

func main(){
    //创建对象
    var b = B();
    var a = A();
    a.valueA = 5;
    b.valueB = 5;
    b.dataA = A();

    //或者直接赋值
    var qwq as B = {
        "valueB": 5,
        "dataA": {
            "valueA": 5
        }
    };

    //访问
    print(b.valueB);
    print(b.dataA.valueA);
}
```

当然，使用自身类型作为数据模板的成员是不被允许的。

## 匿名定义

在数据模板中，可以定义匿名数据模板作为成员的类型：

```mcfpp
data B{
    valueB as int;
    dataA as data{
        valueA as int;
    };
}
