---
lastUpdated: true
---

# Native Commands

MCFPP supports the use of Minecraft native commands. There are two ways to use native commands:

## Using `/` to Insert Commands

Statements that start with `/` are considered as native commands. For example:

```mcfpp
func test(){
    /summon minecraft:armor_stand ~ ~ ~
}
```

This will directly insert a summon command into the `test` function.

## Using the `insert` Function

The `insert` function allows you to insert a string at the current location. For example:

```mcfpp
func test(){
    insert("summon minecraft:armor_stand ~ ~ ~");
}
```

This will insert the raw text from the `insert` function's parameter into the `test` function. It's important to note that the `insert` function's parameter is a string, so you can insert any content. This also means that the compiler will not perform any checks on the command format.
