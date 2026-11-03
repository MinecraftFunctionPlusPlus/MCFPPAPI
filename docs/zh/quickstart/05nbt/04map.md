---
lastUpdated: true
---

# Map：可遍历的键值数据

`map<T>` 使用字符串键保存值，并提供 `keys` 供遍历。

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

## 存储布局

Map 使用 `entries` 列表，每个元素包含 `key` 和 `value`。空 Map 写作：

```mcfpp
func main() {
    var rewards: map<int> = {entries: []} as map<int>
    rewards["daily"] = 10
    print(rewards.size())
}
```

`as map<T>` 按这个布局解释已有数据。初始化时直接提供 `entries`，可以与当前 Map 实现保持一致。

常用方法包括 `containsKey(key)`、`remove(key)`、`merge(other)`、`size()`、`isEmpty()` 和 `clear()`。

按固定键快速访问时，使用[字典](./03dict)。需要列出全部键时，使用 Map。
