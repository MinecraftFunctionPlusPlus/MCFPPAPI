---
lastUpdate: true
---

# NBT

In Minecraft, NBT is one of the most important data types. NBT is a tree-structured data format that can store a wide variety of data, such as integers, floating-point numbers, strings, arrays, lists, and compound data. In MCFPP, NBT is a built-in data type that can be used directly.

## Basic Usage of NBT Data Types

In MCFPP, the type identifier for NBT is `nbt`. You can create NBT data using the standard SNBT (Stringified NBT) syntax, for example:

```mcfpp
nbt value1 = "Hello, World!";

nbt number = 42;

nbt list = [1, 2, 3];

nbt uuid = [I; 0, 0, 0, 1];

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

You can use `[]` indexing to access members of complex NBT data, for example:

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

nbt list = [1, 2, 3];

print(list[0]);
```

The compiler does not check if the index is valid. Even if the indexed data does not exist, the compiler will still concatenate the NBT path normally. The same principle applies to `list`, `dict`, and `map` types.

There is one exception: when the compiler knows the value of the NBT type. In this case, NBT will attempt to check whether the data is valid. However, it will not throw an error but will issue a warning. The data pack will still be generated as expected.

## Conversion of NBT Data Types

In MCFPP, any data type can be converted to NBT. However, NBT cannot be converted to any other data type. During compilation, the compiler attempts to track the NBT type of an `nbt` variable and determines whether it can be converted to other data types.

```mcfpp
int i = 5;
nbt n = i;  # Valid, implicit conversion always succeeds
int p = (int)n;  # Valid, the compiler knows n is an NBT of int type

func test(nbt n){
    int i = (int)n;  # Invalid, the compiler cannot determine if the n passed as a function argument is of int type
}
```
