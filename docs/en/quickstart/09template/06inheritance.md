---
lastUpdated: true
---

# Field inheritance and structural types

`Marker: Position, Named` combines the fields of both parents. A `Marker` stores `x`, `y`, `name` and its local `active` field together. Access a field directly on the marker.

```mcfpp
data Position { var x: int; var y: int }
data Named { var name: string }
data Marker: Position, Named {
    var active: bool
    new(x: int, y: int, name: string) {
        return { x, y, name, active: true }
    }
}

func label(value: { name: string }): string { return value.name }

func main() {
    var marker = Marker.new(3, 4, "spawn")
    print(label(marker))
}
```

`label` reads only `name`. Any value with a `string` field of that name satisfies the parameter. This example prints `spawn`. The same field checks apply to assignments and return values.

## Combining parents

In a type position, `(Position & Named)` requires the fields of both templates. If two parents declare the same field, its value must satisfy both types. A required field constrained to both `int` and `string` has type `never`, so no object can satisfy the intersection.

Return a complete value, including the parent fields, from a child factory. To reuse a parent factory, call `Parent.new(...)` and copy the resulting fields into the child value. Ordinary `data` inheritance combines fields. Migrate code that depended on virtual dispatch via `override` or `super` to functions taking the shared structure, such as `label` above. For entity template construction and summoning, see [example 06](/en/examples/06-entities-context).
