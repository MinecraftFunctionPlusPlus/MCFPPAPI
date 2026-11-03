---
lastUpdated: true
---

# Map: iterable key-value data

`map<T>` stores values under string keys. It provides `keys` for iteration.

```mcfpp
func main() {
    var rewards: map<int> = {entries: [
        {key: "daily", value: 10},
        {key: "weekly", value: 50}
    ]} as map<int>

    rewards["bonus"] = 5
    print(rewards["daily"])

    for (key: rewards.keys) {
        print(key)
        print(rewards[key])
    }
}
```

## Storage layout

A Map uses an `entries` list. Each entry contains `key` and `value`. Create an empty Map with:

```mcfpp
func main() {
    var rewards: map<int> = {entries: []} as map<int>
    rewards["daily"] = 10
    print(rewards.size())
}
```

`as map<T>` interprets data with this layout. Supply `entries` directly to match the current implementation.

Common methods include `containsKey(key)`, `remove(key)`, `merge(other)`, `size()`, `isEmpty()`, and `clear()`.

Use a [dictionary](./03dict) for direct key access. Use Map when you need to list all keys.
