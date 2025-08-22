---
lastUpdate: true
---

# Map

为了弥补Minecraft原版NBT中复合标签在操作上的不便利，MCFPP封装了一种新的数据结构：`map`。`map`是一种键值对的数据结构，它的键只能是字符串，而值只能是同一种类型。

## 基本使用

使用`map<type T>`来声明一个`map`。和`dict`一样，在`map`中，可以使用`[]`来访问键值对。

```mcfpp
var m as map<int> = {
    "a": 1,
    "b": 2,
    "c": 3
};

print(m["a"]); #输出1

m["d"] = 4; #添加一个新的键值对
```

## map的操作

MCFPP标准库提供了一系列的`map`操作函数。

| 函数名 | 参数 | 返回值 | 作用 |
| --- | --- | --- | --- |
| `clear` | - | `void` | 清空`map` |
| `containsKey` | `string` | `bool` | 判断`map`中是否包含指定键 |
| `containsValue` | `T` | `bool` | 判断`map`中是否包含指定值 |
| `isEmpty` | `void` | `bool` | 判断`map`是否为空 |
| `remove` | `string` | `void` | 移除指定键的键值对 |
| `merge` | `map<T>` | `void` | 合并两个`map` |
| `size` | - | `int` | 获取`map`的大小 |

以及一些属性

| 属性名 | 类型 | 描述| 
| --- | --- | --- |
| `keys`| `string`| 获取`map`的所有键|

## map的遍历<Badge type="tip" text="未来特性" />

使用`foreach`循环可以简单地遍历`map`中的所有键值对。

```mcfpp
var m as map<int> = {
    "a": 1,
    "b": 2,
    "c": 3
};

foreach(k, v in m){
    print(k + ": " + v);
}

foreach(k in m.getKeys()){
    print(k + ": " + m[k]);
}

foreach(v in m.getValues()){
    print(v);
}
```

:::tip Tip
和`dict`仅由复合标签组成相比，`map`的结构更为复杂。通常来说，一个`map`由三个部分组成，即一个键的列表，一个值的列表，以及键值构成的复合标签。这种结构意味着，在写入的时候，`map`的开销将会比`dict`更高。但是这种结构同样也为`map`带来了更多的功能。

具体来说，以下面的代码为例：

```mcfpp
var m as map<string> = {};

m["qwq"] = "pwp";
m["owo"] = "uwu";
m["nya"] = "meow";
```

在存储的时候，`map`的结构如下：

```js
namespace.stack_frame:[
    {
        m:{
            keys:["qwq","owo","nya"],        //键列表
            keyValueSet:{
                "qwq":"pwp","owo":"uwu","nya":"meow"    //键值对，相当于一个dict
            }    
        }
    }
]
```

:::
