---
lastUpdated: true
---

# Nested data templates

A field can use another data template as its type. This groups related data.

```mcfpp
data Position {
    var x: int
    var z: int

    new(x: int, z: int) {
        return { x, z }
    }
}

data Checkpoint {
    var name: string
    var position: Position

    new(name: string, position: Position) {
        return { name, position }
    }
}

func main() {
    var checkpoint = Checkpoint("Spawn", Position(10, 20))
    print(checkpoint.position.x)
}
```

`Checkpoint` combines a name and position. `checkpoint.position.x` accesses `position` and then `x`.

The inner `Position(10, 20)` produces a complete position value. The outer factory returns it alongside the checkpoint name.

A function that reads only the horizontal coordinate can take `p: { x: int }`. A `Position` has both `x` and `z`, so it satisfies that parameter.
