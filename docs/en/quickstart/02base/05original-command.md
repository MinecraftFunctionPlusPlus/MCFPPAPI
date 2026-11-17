---
lastUpdated: true
---

# Native commands and interpolation

Start a line with `/` to insert a Minecraft command. The generated datapack contains the command body.

```mcfpp
func main() {
    /say Hello from MCFPP
    /give @s minecraft:stone 1
}
```

Use one line for each native command. Quotes, JSON, and NBT keep their Minecraft command meaning.

## Insert a value

`${expression}` inserts an expression result into the command. This example places a gold block below the executor:

```mcfpp
func main() {
    const block = "minecraft:gold_block"
    /setblock ~ ~-1 ~ ${block}
}
```

Known values can appear directly in commands. Runtime values depend on the target version and command interface. Use standard library functions when you need typed arguments or a command result.

## Reuse commands through a function

Place a fixed command in an ordinary function to call it from several locations:

```mcfpp
func announce() {
    /say Ready
}

func main() {
    announce()
}
```

See [MNI command generation](../11mni/05access) to compose commands with Java.

## Line breaks and division

A single `/` at the start of a line means a command. For a division across lines, place the operator on the preceding line:

```mcfpp
func main() {
    var count = 12 /
        3
    print(count)
}
```

## Write several commands in a block

Between `/{` and a closing `}` on its own line, write one Minecraft command per line without the leading slash. Use `${points}` to read the surrounding MCFPP variable.

```mcfpp
func main() {
    var points = 25
    /{
        scoreboard objectives add showcase_text dummy
        scoreboard players set #points showcase_text ${points}
        execute if score #points showcase_text matches 25 run say text-command-demo
    }
}
```

The `#points` score on `showcase_text` becomes `25` and `text-command-demo` appears in chat. [See example 04](/en/examples/04-text-commands)
