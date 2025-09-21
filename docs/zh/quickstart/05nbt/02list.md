---
lastUpdate: true
---

# 列表

NBT支持列表这种基本数据类型，MCFPP将其抽象了出来，作为一种单独的类型提供。

## 基本使用

使用`list<type T>`类型标识符定义一个列表。其中类型参数`T`表示这个列表中存储的元素类型。

```mcfpp
var l as list<int> = []; #创建一个空列表
l.add(1); #向列表中添加一个元素
l.add(2); 
l.add(3); 
print(l); #输出[1,2,3]
print(l[0]);    #输出1

l.removeAt(1); #从列表中移除索引为1的元素
```

列表的传递为值传递，而不是引用传递。事实上，所有基于纯NBT的数据类型都是值传递。

```mcfpp

var l as list<int> = [1,2,3];
var l2 = l;
l2.add(4);
print(l); #输出[1,2,3]
print(l2); #输出[1,2,3,4]
```

## 列表的操作

MCFPP标准库提供了一系列的列表操作函数。

| 函数名 | 参数 | 返回值 | 作用 |
| --- | --- | --- | --- |
| `add` | `T` | `void` | 向列表中添加一个元素 |
| `addAll` | `list<T>` | `void` | 向列表中添加一组元素 |
| `insert` | `int, T` | `void` | 在指定位置插入一个元素 |
| `removeAt` | `int` | `void` | 移除指定位置的元素 |
| `remove` | `T` | `void` | 移除指定元素 |
| `indexOf` | `T` | `int` | 返回指定元素的索引 |
| `lastIndexOf` | `T` | `int` | 返回指定元素的最后一个索引 |
| `contains` | `T` | `bool` | 判断列表中是否包含指定元素 |
| `clear` | - | `void` | 清空列表 |

## 列表的遍历<Badge type="tip" text="未来特性" />

使用`foreach`循环可以简单地遍历列表中的所有元素。

```mcfpp
var l = [1,2,3];
foreach(i in l){
    print(i);
}
```
