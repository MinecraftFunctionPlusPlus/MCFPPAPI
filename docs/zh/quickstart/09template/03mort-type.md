---
lastUpdate: true
---

# 特殊类型

在数据模板中，为了贴合Minecraft中一种NBT值可空和可能为多种类型的情况，数据模板中提供了两种特殊的类型——可空类型和联合类型。

## 可空类型

可空类型表示，在数据模板中，这个值是可选的。在给数据模板赋初值的时候，或者数据模板生成默认数据的时候，可以不用包含这个键对应的值。

但是，编译器只会在赋值的时候检查可空类型，而不会在访问的时候检查非空类型。换句话说，在访问成员的时候，编译器不会管这个成员的类型是不是可空类型，也不会判断这个成员是否是空值。在生成命令的时候，可空类型的使用和其他普通的类型完全一样，即使在游戏中可能会因为不存在而报错。

```mcfpp

data Test{
    a as int;  
    b as int?; # b是可空的
}

func main(){
    var test as Test = {
        "a": 1
    };
    print(test.b); # 编译不报错，但是在游戏中执行命令会出问题
}
```

## 联合类型

联合类型表示，在数据模板中，这个值可以是多种类型之一。

```mcfpp

data Test{
    a as (int|String); # a可以是int或者String
    b as (int|String)?; # b可以是int或者String，也可以是空值
}

func main(){
    var test1 as Test = {
        "a": 1
    };
    var test2 as Test = {
        "a": "qwq"
    };
}
```

访问联合类型的时候，需要强制转换类型，否则会退化为两种类型的最小公共类型。

```mcfpp
# ...接上文
print(test1.a); # 退化为any类型
print(test2.a as int); # 作为int类型
print(test2.a as string); # 作为string类型
```
