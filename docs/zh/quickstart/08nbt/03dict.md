---
lastUpdate: true
---

# 字典

字典类型对应MCFPP中的复合标签类型。它是一个键值对的集合，键必须为字符串类型，而值可以是任意类型。

## 基本使用

使用`dict`类型标识符定义字典类型的变量。使用复合标签来为字典进行赋值。

```mcfpp
dict playerData = {
    "Alumopper" : {
        "level" : 1,
        "exp" : 0
    },
    "Xiao2" : {
        "level" : 2,
        "exp" : 100
    },
    "CR_019" : {
        "level" : 3,
        "exp" : 200
    }
}

print(playerData["Alumopper"]["level"]); #输出1

print(playerData["CR_017"]);    #非法，但是不报错

playerData["CR_017"] = {
    "level" : 4,
    "exp" : 300
};  # 添加一个新的键值对

```

## 字典的操作

字典不能被遍历，也不能获取关于键值的列表。MCFPP提供了一些基本的字典操作。

| 函数名 | 参数 | 返回值 | 作用 |
| --- | --- | --- | --- |
| `containsKey` | `string key` | `bool` | 判断字典中是否包含指定键 |
| `merge` | `dict dict` | `void` | 合并两个字典 |
| `remove` | `string key` | `void` | 移除指定键的键值对 |
