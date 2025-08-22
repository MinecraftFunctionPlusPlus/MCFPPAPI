---
lastUpdate: true
---

# Special Types

In data templates, to fit the situation where a key in NBT can be null or can be of multiple types, two special types are provided in data templates: nullable types and union types.

## Nullable Types

Nullable types represent that a value is optional in a data template. When assigning an initial value to a data template or when generating default data for a data template, you can omit the value corresponding to this key.

However, the compiler only checks nullable types when assigning values, not when accessing them. In other words, the compiler does not care whether the member type is nullable or whether the member is null when accessing members. When generating commands, the use of nullable types is the same as other ordinary types, even if an error may occur in the game due to the absence of the member.

```mcfpp

data Test{
    var a as int;  
    var b as int?; # b is nullable
}

func main(){
    var test as Test = {
        "a": 1
    };
    print(test.b); # Compile successfully, but may cause an error in the game
}
```

## Union Types

Union types represent that a key in a data template can be one of multiple types.

```mcfpp

data Test{
    a as (int|String); # a can be int or String
    b as (int|String)? ; # b can be int, String, or null
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

When accessing union types, you need to cast the type, otherwise it will degenerate into the minimum common type of the two types.

```mcfpp
# ...Continuing from the previous example
print(test1.a); # As any type
print((int)test2.a); # As int type
print((string)test2.a); # As string type
```
