---
lastUpdate: true
---

# Special Types in Data Templates

In data templates, to fit the situation where a key in NBT can be null or can be of multiple types, two special types are provided in data templates: nullable types and union types.

## Nullable Types

可空类型表示，在数据模板中，这个值是可选的。在给数据模板赋初值的时候，或者数据模板生成默认数据的时候，可以不用包含这个键对应的值。

Nullable types represent that a value is optional in a data template. When assigning an initial value to a data template or when generating default data for a data template, you can omit the value corresponding to this key.

However, the compiler only checks nullable types when assigning values, not when accessing them. In other words, the compiler does not care whether the member type is nullable or whether the member is null when accessing members. When generating commands, the use of nullable types is the same as other ordinary types, even if an error may occur in the game due to the absence of the member.

```mcfpp

data Test{
    int a;  
    int? b; # b is nullable
}

func main(){
    Test test = {
        "a": 1
    };
    print(test.b); # Compile successfully, but may cause an error in the game
}
```

## Union Types

Union types represent that a key in a data template can be one of multiple types.

```mcfpp

data Test{
    (int|String) a; # a can be int or String
    (int|String)? b; # b can be int, String, or null
}

func main(){
    Test test1 = {
        "a": 1
    };
    Test test2 = {
        "a": "qwq"
    };
}
```

When accessing union types, you need to cast the type, otherwise it will degenerate into the minimum common type of the two types.

```mcfpp
# ...Continuing from the previous example
print(test1.a); # As any type
print((int)test2.a); # As int type
print((string)test2.a); # As string type
```
