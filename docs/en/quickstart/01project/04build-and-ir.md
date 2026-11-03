---
lastUpdated: true
---

# Build output and IR

## Inspect the datapack

`mcfpp build` writes files to `targetPath`. This example uses `name = "hello"` and `targetPath = "build"`:

```text
build/
├── hello/
│   ├── pack.mcmeta
│   └── data/
│       ├── hello/function/
│       └── minecraft/tags/function/
├── bin.mclib
└── module.json
```

`hello/` is the datapack loaded by Minecraft. `bin.mclib` and `module.json` support library export. They remain outside the datapack directory. The target version selects the pack format and generated commands.

The compiler starts with project functions, load and tick tags, and explicit resources. It retains library functions and resources used by those references. Dynamic function targets retain the families they can select.

Resources from `dataPath` remain part of the user's declared output. The link report explains where files came from and why they remain.

## Export readable compiler records

IR means intermediate representation. These text records connect source code, generated commands, and final output.

Select **MCFPP → Dump IR** in IDEA, or run:

```sh
mcfpp build --dump-ir
```

The command creates three files:

| File | Content |
| --- | --- |
| `build/ir/01-compiled.ir` | Typed basic blocks, instructions, source locations, and commands for compiled functions |
| `build/ir/02-optimized.ir` | Results after entry functions and runtime initialization are arranged |
| `build/ir/03-linked.ir` | Retained resources, omitted resources, and reference sources |

A basic block is a sequence of instructions. Some functions generate Minecraft commands directly. Their records identify that path and contain the actual commands.

Select an IR path in the console to open it. You can also choose another directory:

```sh
mcfpp build --dump-ir=inspection
```

Relative directories start at the build output root. This example writes to `build/inspection/`.

## Follow a small example

```mcfpp
func add(a: int, b: int): int {
    return a + b
}

func main() {
    external count: int = 2
    print(add(count, 3))
}
```

1. Run **Dump IR**.
2. Find `add` and `main` in `01-compiled.ir`.
3. Compare entry functions and initialization in `02-optimized.ir`.
4. Check library retention reasons in `03-linked.ir`.
5. Open `main.mcfunction` in the datapack to inspect the final commands.

The compiler selects internal function names. Use source locations and call relationships to follow the result.
