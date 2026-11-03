---
lastUpdated: true
---

# Lists

`list<T>` stores elements of one type. Indices start at `0`.

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

After removal, the list is `[20, 30]`. `rewards[0]` is `20` and `size()` is `2`.

## Common methods

| Method | Purpose |
| --- | --- |
| `add(value)` | Append an element |
| `prepend(value)` | Insert at the start |
| `addAll(values)` | Append several elements |
| `insert(index, value)` | Insert at an index |
| `removeAt(index)` | Remove an indexed element |
| `remove(value)` | Remove a matching value |
| `contains(value)` | Test for a value |
| `indexOf(value)` | Find an index |
| `size()` | Read the element count |
| `isEmpty()` | Test whether the list is empty |
| `clear()` | Remove all elements |

List assignment copies the value. Changes to a copy leave the original content intact. Use [address references](../02base/06references) to update persistent game data.
