---
lastUpdate: true
---

# MAP

To address the inconvenience of working with compound tags in vanilla Minecraft NBT, MCFPP introduces a new data structure: `map`. A `map` is a key-value data structure where the keys must be strings, and the values must all be of the same type.

## Basic Usage

Use `map<type T>` to declare a `map`. Like with `dict`, you can access key-value pairs in a `map` using `[]`.

```mcfpp
map<int> m = {
    "a": 1,
    "b": 2,
    "c": 3
};

print(m["a"]); # Outputs 1

m["d"] = 4; # Adds a new key-value pair
```

## map Operations

The MCFPP standard library provides a series of functions to manipulate `map`.

| Function Name | Parameters | Return Value | Description |
| --- | --- | --- | --- |
| `clear` | `void` | `void` | Clears the `map` |
| `containsKey` | `string key` | `bool` | Checks if the `map` contains the specified key |
| `containsValue` | `T value` | `bool` | Checks if the `map` contains the specified value |
| `isEmpty` | `void` | `bool` | Checks if the `map` is empty |
| `getKeys` | `void` | `list<string>` | Retrieves all keys in the `map` |
| `getValues` | `void` | `list<T>` | Retrieves all values in the `map` |
| `remove` | `string key` | `void` | Removes the key-value pair for the specified key |
| `merge` | `map<T> map` | `void` | Merges two `maps` |
| `size` | `void` | `int` | Returns the size of the `map` |

## map Traversal <Badge type="tip" text="Future Feature" />

You can use the `foreach` loop to easily traverse all key-value pairs in a `map`.

```mcfpp
map<int> m = {
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
Compared to `dict`, which is composed solely of compound tags, `map` has a more complex structure. Typically, a `map` consists of three parts: a list of keys, a list of values, and a compound tag representing the key-value pairs. This structure means that writing data to a `map` has a higher overhead than writing to a `dict`. However, this structure also grants `map` more functionality.

For instance, consider the following code:

```mcfpp
map m = {};

m["qwq"] = "pwp";
m["owo"] = "uwu";
m["nya"] = "meow";
```

When stored, the structure of the `map` would look like this:

```js
namespace.stack_frame:[
    {
        m:{
            key:["qwq","owo","nya"],        // Key list
            value:["pwp","uwu","meow"],     // Value list
            data:{
                "qwq":"pwp","owo":"uwu","nya":"meow"    // Key-value pairs, similar to a dict
            }    
        }
    }
]
```

:::
