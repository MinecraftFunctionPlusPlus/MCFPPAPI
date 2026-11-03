---
lastUpdated: true
---

# Nested data templates

A field can use another data template as its type. This groups related data.

```mcfpp
data Position {
    var x: int
    var z: int

    constructor(x: int, z: int) {
        this.x = x
        this.z = z
    }
}

data Checkpoint {
    var name: string
    var position: Position

    constructor(name: string, position: Position) {
        this.name = name
        this.position = position
    }
}

func main() {
    var checkpoint = Checkpoint("Spawn", Position(10, 20))
    print(checkpoint.position.x)
}
```

`Checkpoint` combines a name and position. `checkpoint.position.x` accesses `position` and then `x`.

Constructors receive typed field values. Declare fields with `var name: Type`. Create nested objects through ordinary constructor calls.

Name structures that you reuse. Anonymous structures use `data { ... }` as a type with the same field declaration rules.
