---
lastUpdated: true
---

# Singleton and companion objects

`object data` declares shared members. Access fields and call methods through the declaration name:

```mcfpp
object data Settings {
    var reward: int = 10

    func amount(): int {
        return Settings.reward
    }
}

func main() {
    print(Settings.amount())
}
```

Object initialization runs once in dependency order. Project objects belong to the program's declarations. Imported library objects participate when needed.

A `data` template and `object data` can share a name as companions. The template name accesses shared members. An instance accesses instance fields:

```mcfpp
data Reward {
    var amount: int = 5
}

object data Reward {
    var defaultAmount: int = 10
}

func main() {
    var reward = Reward()
    print(reward.amount)
    print(Reward.defaultAmount)
}
```

Generic templates and companions use matching read-only parameter declarations. Members retain the identity of their declaring owner.
