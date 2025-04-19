---
lastUpdate: true
---

# NBT

在Minecraft中，NBT最重要的数据类型之一。NBT作为一种树状结构的数据类型，可以存储各种各样的数据，例如整数、浮点数、字符串、数组、列表、复合数据等。在MCFPP中，NBT是一种内置的数据类型，可以直接使用。

## NBT数据类型的基本使用

在MCFPP中，NBT数据类型的类型标识符为`nbt`。你可以使用一般的SNBT语法来创建NBT数据，例如：

```mcfpp
var value1 as nbt = "Hello, World!";

var number as nbt = 42;

var list as nbt = [1,2,3];

var uuid as nbt = [I;0,0,0,1]

var itemStack as nbt = {
    "Count": 1,
    "Item": "minecraft:stone",
    "tag": {
        "display": {
            "Name": "Stone"
        }
    }
};
```

你可以使用`[]`索引来访问复杂NBT数据中的成员。例如：

```mcfpp
var itemStack = {
    "Count": 1,
    "Item": "minecraft:stone",
    "tag": {
        "display": {
            "Name": "Stone"
        }
    }
};

print(itemStack["tag"]["display"]["Name"]);

var list = [1,2,3];

print(list[0]);
```

编译器不会检查索引是否合法。即使索引对应的数据不存在，编译器也将正常拼接NBT路径。在后续的`list`,`dict`,`map`类型中，也是同理的。

除了一种情况，就是编译器知道这个nbt类型的值。此时nbt将会尝试检查数据是否合法，但是并不会报错，而是会给出警告。数据包依然会正常生成。
