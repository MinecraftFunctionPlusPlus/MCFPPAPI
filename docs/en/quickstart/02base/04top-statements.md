---
lastUpdated: true
---

# Top-level statements and initialization

Write top-level statements before function and template declarations. The compiler places them in a generated function registered in `minecraft:load`.

```mcfpp
var message = "Datapack loaded"
print(message)

func main() {
    print(message)
}
```

Loading the datapack or running `/reload` prints the top-level message once. Calling `main` reads the same file's top-level variable again.

File order is namespace, imports, type aliases, top-level statements, then function and template declarations. Top-level statements can call functions declared later in the file.

Use top-level statements to initialize a scoreboard objective:

```mcfpp
/scoreboard objectives add rewards dummy

func main() {
    /scoreboard players add @s rewards 1
}
```

Named functions run through explicit calls. To schedule work every tick, add its function to the `minecraft:tick` [tag resource](../01project/04build-and-ir).
