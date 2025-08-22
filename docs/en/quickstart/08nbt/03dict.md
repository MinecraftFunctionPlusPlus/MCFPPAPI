---
lastUpdate: true
---

# Dictionary

The dictionary type in MCFPP corresponds to the compound tag type. It is a collection of key-value pairs, where the keys must be of string type, and the values can be of any type.

## Basic Usage

Use the `dict` type identifier to define a dictionary variable. Use compound tags to assign values to the dictionary.

```mcfpp
var playerData = {
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

print(playerData["Alumopper"]["level"]); # Outputs 1

print(playerData["CR_017"]);    # Invalid, but no error is thrown

playerData["CR_017"] = {
    "level" : 4,
    "exp" : 300
};  # Adds a new key-value pair
```

## Dictionary Operations

Dictionaries cannot be iterated over, and you cannot retrieve a list of keys or values. MCFPP provides some basic dictionary operations.

| Function Name | Parameters | Return Value | Description |
| --- | --- | --- | --- |
| `containsKey` | `string key` | `bool` | Checks if the dictionary contains a specified key |
| `merge` | `dict dict` | `void` | Merges two dictionaries |
| `remove` | `string key` | `void` | Removes the key-value pair for the specified key |
| `clear` | `void` | `void` | Clears the dictionary |
