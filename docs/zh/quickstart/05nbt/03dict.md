---
lastUpdated: true
---

# 字典

`dict<T>` 用字符串键查找相同类型的值。它使用 NBT 复合数据保存内容。

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

字面量中的键写作标识符。索引和方法接收字符串键。

| 方法 | 作用 |
| --- | --- |
| `containsKey(key)` | 判断键是否存在 |
| `remove(key)` | 删除键值对 |
| `merge(other)` | 合并另一份字典 |
| `size()` | 获取键值对数量 |
| `isEmpty()` | 判断是否为空 |
| `clear()` | 清空字典 |

读取前应确保目标键存在。需要遍历键时，使用[Map](./04map)。字段结构固定时，使用[数据模板](../06template/01define)。
