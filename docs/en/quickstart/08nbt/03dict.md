---
lastUpdated: true
---

# Dictionaries

`dict<T>` maps string keys to values of one type. It stores content in an NBT compound.

```mcfpp
func main() {
    var rewards: dict<int> = {daily: 10, weekly: 50}
    rewards["bonus"] = 5

    if rewards.containsKey("daily") {
        print(rewards["daily"])
    }

    rewards.remove("weekly")
    print(rewards.size())
}
```

Literal keys are identifiers. Indices and methods receive string keys.

| Method | Purpose |
| --- | --- |
| `containsKey(key)` | Test whether a key exists |
| `remove(key)` | Remove a key and value |
| `merge(other)` | Merge another dictionary |
| `size()` | Read the number of entries |
| `isEmpty()` | Test whether the dictionary is empty |
| `clear()` | Remove all entries |

Establish that a key exists before reading it. Use [Map](./04map) to iterate over keys. Use [data templates](../09template/01define-and-instantiate) for fixed fields.
