---
lastUpdated: true
---

# NBT data

NBT is Minecraft's tree-shaped data format. Compounds contain named keys. Lists contain ordered elements. MCFPP infers specific types such as dictionaries, lists, and arrays from literals.

```mcfpp
func main() {
    var position = {x: 5, z: 8}
    var rewards = [10, 20, 30]

    print(position["x"])
    print(rewards[0])
}
```

Use string indices for compounds and integer indices for lists. MCFPP compound literal keys are identifiers, such as `title: "Round one"`.

Integer arrays use SNBT syntax:

```mcfpp
func main() {
    var values = [I; 1, 2, 3]
    print(values)
}
```

The compiler checks known layouts and indices. Use [`NBTRef<T>.tryRead`](../02base/06references) to handle data presence in external storage, entities, or blocks.

Use [data templates](../09template/01define-and-instantiate) for fixed fields. Use [lists](./02list) or [dictionaries](./03dict) for fixed element types.
