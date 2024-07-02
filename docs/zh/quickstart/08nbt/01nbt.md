---
lastUpdate: true
---

# NBT

在Minecraft中，NBT最重要的数据类型之一。NBT作为一种树状结构的数据类型，可以存储各种各样的数据，例如整数、浮点数、字符串、数组、列表、复合数据等。在MCFPP中，NBT是一种内置的数据类型，可以直接使用。

## NBT数据类型的基本使用

在MCFPP中，NBT数据类型的类型标识符为`nbt`。你可以使用一般的SNBT语法来创建NBT数据，例如：

```mcfpp
nbt value1 = "Hello, World!";

nbt number = 42;

nbt list = [1,2,3];

nbt uuid = [I;0,0,0,1]

nbt itemStack = {
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
nbt itemStack = {
    "Count": 1,
    "Item": "minecraft:stone",
    "tag": {
        "display": {
            "Name": "Stone"
        }
    }
};

print(itemStack["tag"]["display"]["Name"]);

nbt list = [1,2,3];

print(list[0]);
```

编译器不会检查索引是否合法。即使索引对应的数据不存在，编译器也将正常拼接NBT路径。在后续的`list`,`dict`,`map`类型中，也是同理的。

除了一种情况，就是编译器知道这个nbt类型的值。此时nbt将会尝试检查数据是否合法，但是并不会报错，而是会给出警告。数据包依然会正常生成。

## NBT数据类型的转换

在MCFPP中，任何数据类型都能被转换为NBT。但是NBT并不能转换为任何数据类型。在编译过程中，编译器会尝试跟踪nbt变量的NBT类型，并由此判断是否能够转换为其他数据类型。

```mcfpp
int i = 5;
nbt n = i;  #合法，隐式转换永远成功
int p = (int)n; #合法，编译器已知n是一个int类型的NBT数据

func test(nbt n){
    int i = (int)n; #非法，编译器无法确定作为函数参数传入的n是否为int类型的数据
}
```
