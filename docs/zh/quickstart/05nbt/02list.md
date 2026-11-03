---
lastUpdated: true
---

# 列表

`list<T>` 保存一组相同类型的元素。索引从 `0` 开始。

```mcfpp
func main() {
    var rewards: list<int> = [10, 20]
    rewards.add(30)
    rewards.removeAt(0)

    print(rewards[0])
    print(rewards.size())

    for (reward: rewards) {
        print(reward)
    }
}
```

删除第一个元素后，列表为 `[20, 30]`。`rewards[0]` 是 `20`，`size()` 是 `2`。

## 常用方法

| 方法 | 作用 |
| --- | --- |
| `add(value)` | 添加到末尾 |
| `prepend(value)` | 添加到开头 |
| `addAll(values)` | 添加一组元素 |
| `insert(index, value)` | 插入元素 |
| `removeAt(index)` | 删除指定位置 |
| `remove(value)` | 删除匹配元素 |
| `contains(value)` | 判断是否包含值 |
| `indexOf(value)` | 查找索引 |
| `size()` | 读取元素数量 |
| `isEmpty()` | 判断是否为空 |
| `clear()` | 清空列表 |

列表赋值复制值。修改副本时，原列表保留自己的内容。持久游戏数据的更新使用[地址引用](../02base/06references)。
